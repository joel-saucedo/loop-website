// Hacker Terminal and Glitch Effects

class HackerTerminal {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      typeSpeed: options.typeSpeed || 50,
      deleteSpeed: options.deleteSpeed || 30,
      pauseTime: options.pauseTime || 2000,
      cursor: options.cursor || '█',
      ...options
    };
    
    this.commands = [
      'npm install @loop/ai-notes',
      'git clone https://github.com/loop/intelligence.git',
      'python train_model.py --epochs=100 --lr=0.001',
      'curl -X POST /api/notes/analyze',
      'docker run --gpu loop/neural-network',
      './compile_knowledge.sh --optimize',
      'fibonacci(8) = 21',
      'φ = (1 + √5) / 2',
      'fourier_transform(signal)',
      'neural_net.forward(input_data)'
    ];
    
    this.currentCommand = 0;
    this.currentChar = 0;
    this.isDeleting = false;
    
    this.init();
  }
  
  init() {
    this.element.innerHTML = this.options.cursor;
    this.type();
  }
  
  type() {
    const command = this.commands[this.currentCommand];
    
    if (!this.isDeleting) {
      // Typing
      if (this.currentChar < command.length) {
        this.element.innerHTML = command.substring(0, this.currentChar + 1) + this.options.cursor;
        this.currentChar++;
        setTimeout(() => this.type(), this.options.typeSpeed + Math.random() * 50);
      } else {
        // Pause before deleting
        setTimeout(() => {
          this.isDeleting = true;
          this.type();
        }, this.options.pauseTime);
      }
    } else {
      // Deleting
      if (this.currentChar > 0) {
        this.element.innerHTML = command.substring(0, this.currentChar - 1) + this.options.cursor;
        this.currentChar--;
        setTimeout(() => this.type(), this.options.deleteSpeed);
      } else {
        // Move to next command
        this.isDeleting = false;
        this.currentCommand = (this.currentCommand + 1) % this.commands.length;
        setTimeout(() => this.type(), 500);
      }
    }
  }
}

class GlitchText {
  constructor(element, options = {}) {
    this.element = element;
    this.originalText = element.textContent;
    this.options = {
      intensity: options.intensity || 0.1,
      speed: options.speed || 50,
      characters: options.characters || '01!@#$%^&*()[]{}|;:,.<>?',
      ...options
    };
    
    this.isGlitching = false;
    this.glitchTimeout = null;
    
    this.init();
  }
  
  init() {
    this.element.addEventListener('mouseenter', () => this.startGlitch());
    this.element.addEventListener('mouseleave', () => this.stopGlitch());
    
    // Random glitch effect
    this.randomGlitch();
  }
  
  startGlitch() {
    if (this.isGlitching) return;
    this.isGlitching = true;
    this.glitch();
  }
  
  stopGlitch() {
    this.isGlitching = false;
    clearTimeout(this.glitchTimeout);
    this.element.textContent = this.originalText;
  }
  
  glitch() {
    if (!this.isGlitching) return;
    
    const text = this.originalText;
    let glitchedText = '';
    
    for (let i = 0; i < text.length; i++) {
      if (Math.random() < this.options.intensity) {
        const randomChar = this.options.characters[
          Math.floor(Math.random() * this.options.characters.length)
        ];
        glitchedText += randomChar;
      } else {
        glitchedText += text[i];
      }
    }
    
    this.element.textContent = glitchedText;
    
    this.glitchTimeout = setTimeout(() => {
      this.element.textContent = this.originalText;
      if (this.isGlitching) {
        setTimeout(() => this.glitch(), this.options.speed + Math.random() * 100);
      }
    }, 50);
  }
  
  randomGlitch() {
    const randomDelay = Math.random() * 10000 + 5000; // 5-15 seconds
    setTimeout(() => {
      this.startGlitch();
      setTimeout(() => this.stopGlitch(), 200 + Math.random() * 300);
      this.randomGlitch();
    }, randomDelay);
  }
}

class MatrixRain {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = {
      fontSize: options.fontSize || 14,
      columns: options.columns || 100,
      speed: options.speed || 50,
      density: options.density || 0.02,
      ...options
    };
    
    this.drops = [];
    this.characters = '01φπ∑∞αβγδεζηθικλμνξοπρστυφχψω∇∂∆∫√∝∈∋∪∩⊂⊃⊆⊇∧∨¬→↔∀∃';
    
    this.init();
  }
  
  init() {
    this.resize();
    this.initDrops();
    this.animate();
  }
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * devicePixelRatio;
    this.canvas.height = rect.height * devicePixelRatio;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
    this.width = rect.width;
    this.height = rect.height;
    
    this.options.columns = Math.floor(this.width / this.options.fontSize);
  }
  
  initDrops() {
    this.drops = [];
    for (let i = 0; i < this.options.columns; i++) {
      this.drops[i] = Math.random() * -this.height;
    }
  }
  
  animate() {
    // Fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Set text properties
    this.ctx.fillStyle = '#353FE0';
    this.ctx.font = `${this.options.fontSize}px JetBrains Mono, monospace`;
    
    // Draw characters
    for (let i = 0; i < this.drops.length; i++) {
      if (Math.random() > this.options.density) continue;
      
      const text = this.characters[Math.floor(Math.random() * this.characters.length)];
      const x = i * this.options.fontSize;
      const y = this.drops[i] * this.options.fontSize;
      
      // Gradient effect
      const gradient = this.ctx.createLinearGradient(0, y - 20, 0, y + 20);
      gradient.addColorStop(0, '#353FE000');
      gradient.addColorStop(0.5, '#353FE0');
      gradient.addColorStop(1, '#DEA635');
      this.ctx.fillStyle = gradient;
      
      this.ctx.fillText(text, x, y);
      
      // Reset drop
      if (y > this.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      this.drops[i]++;
    }
    
    setTimeout(() => requestAnimationFrame(() => this.animate()), this.options.speed);
  }
}

class BinaryWave {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = 0;
    this.waves = [];
    
    this.options = {
      waveCount: options.waveCount || 3,
      amplitude: options.amplitude || 30,
      frequency: options.frequency || 0.02,
      speed: options.speed || 2,
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
        amplitude: this.options.amplitude * (1 - i * 0.3),
        frequency: this.options.frequency * (i + 1),
        phase: (i * Math.PI) / 4,
        color: i % 2 === 0 ? '#353FE0' : '#DEA635'
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    const centerY = this.height / 2;
    
    for (const wave of this.waves) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = wave.color + '80';
      this.ctx.lineWidth = 2;
      
      for (let x = 0; x < this.width; x += 2) {
        const y = centerY + Math.sin((x * wave.frequency) + (this.time * this.options.speed) + wave.phase) * wave.amplitude;
        
        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
        
        // Add binary digits at wave peaks
        if (Math.abs(Math.sin((x * wave.frequency) + (this.time * this.options.speed) + wave.phase)) > 0.8) {
          this.ctx.fillStyle = wave.color;
          this.ctx.font = '10px JetBrains Mono, monospace';
          this.ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y - 10);
        }
      }
      
      this.ctx.stroke();
    }
    
    this.time += 0.016; // ~60fps
    requestAnimationFrame(() => this.animate());
  }
}

// Auto-initialize elements with data attributes
document.addEventListener('DOMContentLoaded', () => {
  // Initialize hacker terminals
  document.querySelectorAll('[data-hacker-terminal]').forEach(element => {
    new HackerTerminal(element);
  });
  
  // Initialize glitch texts
  document.querySelectorAll('[data-glitch-text]').forEach(element => {
    new GlitchText(element);
  });
  
  // Initialize matrix rain canvases
  document.querySelectorAll('[data-matrix-rain]').forEach(canvas => {
    new MatrixRain(canvas);
  });
  
  // Initialize binary wave canvases
  document.querySelectorAll('[data-binary-wave]').forEach(canvas => {
    new BinaryWave(canvas);
  });
});

// Export for global use
window.HackerTerminal = HackerTerminal;
window.GlitchText = GlitchText;
window.MatrixRain = MatrixRain;
window.BinaryWave = BinaryWave;
