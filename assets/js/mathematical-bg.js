// Mathematical WebGL Particle System
class MathematicalParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.time = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.particles = [];
    this.connections = [];
    
    // Reduced performance settings for better experience
    this.config = {
      particleCount: 30, // Reduced from default
      maxConnections: 60, // Reduced connections
      animationSpeed: 0.5, // Slower animation
      opacity: 0.15, // Much more subtle
      connectionDistance: 120 // Smaller connection distance
    };
    
    if (!this.gl) {
      console.warn('WebGL not supported, falling back to Canvas 2D');
      this.fallbackTo2D();
      return;
    }
    
    this.init();
  }
  
  init() {
    this.setupShaders();
    this.createParticles();
    this.setupEventListeners();
    this.resize();
    this.animate();
  }
  
  setupShaders() {
    // Vertex Shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute float a_size;
      attribute vec3 a_color;
      attribute float a_time;
      
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      
      varying vec3 v_color;
      varying float v_alpha;
      
      void main() {
        vec2 position = a_position;
        
        // Mathematical transformations
        float wave = sin(u_time * 0.001 + a_time) * 0.1;
        float spiral = cos(u_time * 0.0008 + length(position) * 0.01) * 0.05;
        
        position.x += wave;
        position.y += spiral;
        
        // Mouse interaction
        vec2 mouseInfluence = (u_mouse - position) * 0.0001;
        position += mouseInfluence;
        
        // Fibonacci spiral influence
        float angle = atan(position.y, position.x);
        float radius = length(position);
        float fibonacci = sin(angle * 1.618) * cos(radius * 0.618) * 0.02;
        position += normalize(position) * fibonacci;
        
        vec2 clipSpace = ((position / u_resolution) * 2.0) - 1.0;
        clipSpace.y *= -1.0;
        
        gl_Position = vec4(clipSpace, 0.0, 1.0);
        gl_PointSize = a_size * (1.0 + sin(u_time * 0.002 + a_time) * 0.3);
        
        v_color = a_color;
        v_alpha = 0.6 + sin(u_time * 0.003 + a_time) * 0.4;
      }
    `;
    
    // Fragment Shader
    const fragmentShaderSource = `
      precision mediump float;
      
      varying vec3 v_color;
      varying float v_alpha;
      
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        
        // Create glow effect
        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
        float core = 1.0 - smoothstep(0.0, 0.1, dist);
        
        float alpha = (glow * 0.3 + core * 0.7) * v_alpha;
        
        gl_FragColor = vec4(v_color, alpha);
      }
    `;
    
    this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
    this.gl.useProgram(this.program);
    
    // Get attribute and uniform locations
    this.attributes = {
      position: this.gl.getAttribLocation(this.program, 'a_position'),
      size: this.gl.getAttribLocation(this.program, 'a_size'),
      color: this.gl.getAttribLocation(this.program, 'a_color'),
      time: this.gl.getAttribLocation(this.program, 'a_time')
    };
    
    this.uniforms = {
      resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
      time: this.gl.getUniformLocation(this.program, 'u_time'),
      mouse: this.gl.getUniformLocation(this.program, 'u_mouse')
    };
  }
  
  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  createProgram(vertexSource, fragmentSource) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
    
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(program));
      return null;
    }
    
    return program;
  }
  
  createParticles() {
    const numParticles = 150;
    const positions = [];
    const sizes = [];
    const colors = [];
    const times = [];
    
    // Mathematical color palette
    const colorPalette = [
      [0.208, 0.247, 0.878], // #353FE0
      [0.871, 0.651, 0.208], // #DEA635
      [0.875, 0.753, 0.647], // #DFC0A5
    ];
    
    for (let i = 0; i < numParticles; i++) {
      // Position based on mathematical patterns
      const angle = (i / numParticles) * Math.PI * 2 * 1.618; // Golden ratio
      const radius = Math.sqrt(i / numParticles) * Math.min(this.canvas.width, this.canvas.height) * 0.4;
      
      // Fibonacci spiral positioning
      const x = this.canvas.width * 0.5 + Math.cos(angle) * radius;
      const y = this.canvas.height * 0.5 + Math.sin(angle) * radius;
      
      positions.push(x, y);
      
      // Size based on mathematical sequence
      const fibonacciSize = 2 + (i % 8) * 1.5;
      sizes.push(fibonacciSize);
      
      // Color selection
      const colorIndex = i % colorPalette.length;
      colors.push(...colorPalette[colorIndex]);
      
      // Time offset for animations
      times.push(Math.random() * Math.PI * 2);
    }
    
    // Create buffers
    this.positionBuffer = this.createBuffer(new Float32Array(positions));
    this.sizeBuffer = this.createBuffer(new Float32Array(sizes));
    this.colorBuffer = this.createBuffer(new Float32Array(colors));
    this.timeBuffer = this.createBuffer(new Float32Array(times));
    
    this.particleCount = numParticles;
  }
  
  createBuffer(data) {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    return buffer;
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  
  animate() {
    this.time = performance.now();
    
    // Clear canvas
    this.gl.clearColor(0.04, 0.05, 0.06, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    // Enable blending for glow effects
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    
    // Set uniforms
    this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.uniforms.time, this.time);
    this.gl.uniform2f(this.uniforms.mouse, this.mouseX, this.mouseY);
    
    // Bind attributes
    this.bindAttribute(this.attributes.position, this.positionBuffer, 2);
    this.bindAttribute(this.attributes.size, this.sizeBuffer, 1);
    this.bindAttribute(this.attributes.color, this.colorBuffer, 3);
    this.bindAttribute(this.attributes.time, this.timeBuffer, 1);
    
    // Draw particles
    this.gl.drawArrays(this.gl.POINTS, 0, this.particleCount);
    
    requestAnimationFrame(() => this.animate());
  }
  
  bindAttribute(attribute, buffer, size) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.enableVertexAttribArray(attribute);
    this.gl.vertexAttribPointer(attribute, size, this.gl.FLOAT, false, 0, 0);
  }
  
  fallbackTo2D() {
    // Fallback to Canvas 2D if WebGL is not supported
    console.log('Using Canvas 2D fallback');
    // Implementation would use the existing particle-demo.js as fallback
  }
}

// Initialize the mathematical particle system
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('mathematicalCanvas');
  if (canvas) {
    new MathematicalParticleSystem(canvas);
  }
});
