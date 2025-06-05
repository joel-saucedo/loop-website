// Advanced Fourier Transform Visualizations

class FourierVisualization {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width || 800;
    this.height = canvas.height || 400;
    this.time = 0;
    this.waves = [];
    this.epicycles = [];
    
    this.options = {
      waveCount: options.waveCount || 5,
      frequency: options.frequency || 0.02,
      amplitude: options.amplitude || 50,
      color: options.color || '#353FE0',
      lineWidth: options.lineWidth || 2,
      showEpicycles: options.showEpicycles !== false,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.setupWaves();
    this.animate();
  }
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * devicePixelRatio;
    this.canvas.height = rect.height * devicePixelRatio;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
    this.width = rect.width;
    this.height = rect.height;
  }
  
  setupWaves() {
    this.waves = [];
    for (let i = 0; i < this.options.waveCount; i++) {
      this.waves.push({
        frequency: (i + 1) * this.options.frequency,
        amplitude: this.options.amplitude / (i + 1),
        phase: (i * Math.PI) / 4,
        color: this.getHarmonicColor(i)
      });
    }
  }
  
  getHarmonicColor(index) {
    const colors = ['#353FE0', '#DEA635', '#DFC0A5', '#5865F2', '#F39C12'];
    return colors[index % colors.length];
  }
  
  drawFourierSeries(centerX, centerY) {
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    
    let x = 0;
    let y = 0;
    
    // Draw epicycles
    if (this.options.showEpicycles) {
      for (let i = 0; i < this.waves.length; i++) {
        const wave = this.waves[i];
        const prevX = x;
        const prevY = y;
        
        const radius = wave.amplitude;
        const angle = wave.frequency * this.time + wave.phase;
        
        // Draw circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = wave.color + '40';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Update position
        x += radius * Math.cos(angle);
        y += radius * Math.sin(angle);
        
        // Draw arm
        this.ctx.beginPath();
        this.ctx.moveTo(prevX, prevY);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = wave.color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw point
        this.ctx.beginPath();
        this.ctx.arc(x, y, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = wave.color;
        this.ctx.fill();
      }
    }
    
    this.ctx.restore();
    return { x: x + centerX, y: y + centerY };
  }
  
  drawWaveTrace(traceX, traceY) {
    // Store wave history
    if (!this.waveHistory) this.waveHistory = [];
    this.waveHistory.push({ x: traceX, y: traceY, time: this.time });
    
    // Limit history length
    if (this.waveHistory.length > 200) {
      this.waveHistory.shift();
    }
    
    // Draw wave trace
    if (this.waveHistory.length > 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.waveHistory[0].x, this.waveHistory[0].y);
      
      for (let i = 1; i < this.waveHistory.length; i++) {
        const point = this.waveHistory[i];
        this.ctx.lineTo(point.x, point.y);
      }
      
      const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
      gradient.addColorStop(0, this.options.color + '00');
      gradient.addColorStop(1, this.options.color);
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = this.options.lineWidth;
      this.ctx.stroke();
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Mathematical background pattern
    this.drawMathematicalGrid();
    
    // Main Fourier visualization
    const centerX = this.width * 0.25;
    const centerY = this.height * 0.5;
    
    const endPoint = this.drawFourierSeries(centerX, centerY);
    this.drawWaveTrace(endPoint.x, endPoint.y);
    
    // Draw mathematical equations overlay
    this.drawEquations();
    
    this.time += 1;
    requestAnimationFrame(() => this.animate());
  }
  
  drawMathematicalGrid() {
    this.ctx.save();
    this.ctx.strokeStyle = '#353FE020';
    this.ctx.lineWidth = 0.5;
    
    // Golden ratio grid
    const goldenRatio = 1.618033988749;
    const gridSize = 30;
    
    for (let x = 0; x < this.width; x += gridSize * goldenRatio) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    
    for (let y = 0; y < this.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  drawEquations() {
    this.ctx.save();
    this.ctx.font = '12px JetBrains Mono, monospace';
    this.ctx.fillStyle = '#DEA635';
    
    // Fourier series equation
    const equation = 'f(x) = Σ(aₙcos(nωt) + bₙsin(nωt))';
    this.ctx.fillText(equation, 20, 30);
    
    // Golden ratio
    const phi = 'φ = (1 + √5) / 2 ≈ 1.618';
    this.ctx.fillText(phi, 20, 50);
    
    this.ctx.restore();
  }
}

// Neural Network Visualization
class NeuralNetworkVisualization {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width || 800;
    this.height = canvas.height || 400;
    this.nodes = [];
    this.connections = [];
    this.time = 0;
    
    this.options = {
      layers: options.layers || [4, 6, 4, 2],
      nodeRadius: options.nodeRadius || 8,
      connectionOpacity: options.connectionOpacity || 0.3,
      animationSpeed: options.animationSpeed || 0.02,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createNetwork();
    this.animate();
  }
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * devicePixelRatio;
    this.canvas.height = rect.height * devicePixelRatio;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
    this.width = rect.width;
    this.height = rect.height;
  }
  
  createNetwork() {
    this.nodes = [];
    this.connections = [];
    
    const layerSpacing = this.width / (this.options.layers.length + 1);
    
    for (let l = 0; l < this.options.layers.length; l++) {
      const layerNodes = this.options.layers[l];
      const nodeSpacing = this.height / (layerNodes + 1);
      
      for (let n = 0; n < layerNodes; n++) {
        const node = {
          x: layerSpacing * (l + 1),
          y: nodeSpacing * (n + 1),
          layer: l,
          index: n,
          activation: Math.random(),
          baseActivation: Math.random()
        };
        this.nodes.push(node);
        
        // Create connections to next layer
        if (l < this.options.layers.length - 1) {
          const nextLayerStart = this.nodes.length;
          const nextLayerSize = this.options.layers[l + 1];
          
          for (let next = 0; next < nextLayerSize; next++) {
            this.connections.push({
              from: this.nodes.length - 1,
              to: nextLayerStart + next,
              weight: (Math.random() - 0.5) * 2,
              baseWeight: (Math.random() - 0.5) * 2
            });
          }
        }
      }
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update node activations with mathematical functions
    this.updateActivations();
    
    // Draw connections
    this.drawConnections();
    
    // Draw nodes
    this.drawNodes();
    
    // Draw mathematical overlay
    this.drawMathematicalOverlay();
    
    this.time += this.options.animationSpeed;
    requestAnimationFrame(() => this.animate());
  }
  
  updateActivations() {
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      // Use Fibonacci and golden ratio for activation patterns
      const fibonacciPattern = Math.sin(this.time + i * 1.618) * 0.5 + 0.5;
      const goldenPattern = Math.cos(this.time * 1.618 + i) * 0.3 + 0.7;
      node.activation = node.baseActivation * fibonacciPattern * goldenPattern;
    }
  }
  
  drawConnections() {
    for (const connection of this.connections) {
      const fromNode = this.nodes[connection.from];
      const toNode = this.nodes[connection.to];
      
      if (!fromNode || !toNode) continue;
      
      const opacity = Math.abs(connection.weight) * this.options.connectionOpacity;
      const weight = Math.abs(connection.weight * fromNode.activation);
      
      this.ctx.beginPath();
      this.ctx.moveTo(fromNode.x, fromNode.y);
      this.ctx.lineTo(toNode.x, toNode.y);
      this.ctx.strokeStyle = connection.weight > 0 ? 
        `rgba(53, 63, 224, ${opacity})` : 
        `rgba(222, 166, 53, ${opacity})`;
      this.ctx.lineWidth = weight * 3;
      this.ctx.stroke();
    }
  }
  
  drawNodes() {
    for (const node of this.nodes) {
      const radius = this.options.nodeRadius * (0.5 + node.activation * 0.5);
      
      // Node background
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius + 2, 0, Math.PI * 2);
      this.ctx.fillStyle = '#1a1a1a';
      this.ctx.fill();
      
      // Node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      const intensity = node.activation;
      this.ctx.fillStyle = `rgba(53, 63, 224, ${intensity})`;
      this.ctx.fill();
      
      // Node border
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = '#DEA635';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  }
  
  drawMathematicalOverlay() {
    this.ctx.save();
    this.ctx.font = '10px JetBrains Mono, monospace';
    this.ctx.fillStyle = '#DFC0A5';
    
    // Neural network equations
    const equations = [
      'y = σ(Σ(wᵢxᵢ) + b)',
      'σ(x) = 1/(1+e⁻ˣ)',
      'φ = 1.618...'
    ];
    
    equations.forEach((eq, i) => {
      this.ctx.fillText(eq, 20, 20 + i * 15);
    });
    
    this.ctx.restore();
  }
}

// Export for global use
window.FourierVisualization = FourierVisualization;
window.NeuralNetworkVisualization = NeuralNetworkVisualization;
