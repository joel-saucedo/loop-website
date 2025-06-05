// Enhanced Mathematical Background System with Vector Fields & Vortices
class ElegantBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.vortices = [];
    this.time = 0;
    this.mouse = { x: 0, y: 0, influence: 0 };
    this.excitationLevel = 0; // New for theme change excitement
    this.lastTheme = document.documentElement.classList.contains('dark');
    this.stochasticPotentials = []; // Random potential fields
    
    // Configuration for mathematical aesthetics
    this.config = {
      particleCount: 65, // Increased for more abundance
      vortexCount: 4,
      maxConnections: 120, // More connections
      connectionDistance: 220, // Longer connections
      baseSpeed: 1.2, // Increased movement
      mouseInfluence: 250, // Strong mouse attraction
      mouseInfluenceRadius: 300, // Larger attraction radius
      mouseAttraction: 0.8, // New: direct attraction to mouse
      stochasticStrength: 0.06, // More natural movement
      vectorFieldStrength: 0.7, // Stronger field
      vortexStrength: 0.35, // Enhanced vortices
      themeTransitionAmplifier: 3.0,
      trailLength: 15, // Longer trails
      interactionSpeedMultiplier: 3.5, // Faster interaction
      particleOpacityMin: 0.4, // More visible particles
      particleOpacityMax: 0.8,
      continuityFactor: 0.95 // Prevent disappearing
    };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createParticles();
    this.createVortices();
    this.createStochasticPotentials();
    this.setupEventListeners();
    this.updateThemeColors();
    this.animate();
  }
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    this.width = rect.width;
    this.height = rect.height;
  }
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.config.baseSpeed,
        vy: (Math.random() - 0.5) * this.config.baseSpeed,
        originalVx: (Math.random() - 0.5) * this.config.baseSpeed,
        originalVy: (Math.random() - 0.5) * this.config.baseSpeed,
        radius: Math.random() * 2.0 + 1.2, // Bigger particles
        opacity: Math.random() * (this.config.particleOpacityMax - this.config.particleOpacityMin) + this.config.particleOpacityMin,
        baseOpacity: Math.random() * (this.config.particleOpacityMax - this.config.particleOpacityMin) + this.config.particleOpacityMin,
        phase: Math.random() * Math.PI * 2,
        frequency: Math.random() * 0.015 + 0.008,
        trail: [],
        trailMaxLength: this.config.trailLength,
        age: 0, // Track particle age for continuity
        maxAge: Infinity // Persistent particles
      });
    }
  }
  
  createVortices() {
    this.vortices = [];
    
    for (let i = 0; i < this.config.vortexCount; i++) {
      this.vortices.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        strength: (Math.random() - 0.5) * this.config.vortexStrength,
        radius: Math.random() * 150 + 100,
        phase: Math.random() * Math.PI * 2,
        frequency: Math.random() * 0.01 + 0.005
      });
    }
  }
  
  createStochasticPotentials() {
    this.stochasticPotentials = [];
    
    for (let i = 0; i < 8; i++) {
      this.stochasticPotentials.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        strength: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 100 + 50,
        phase: Math.random() * Math.PI * 2,
        frequency: Math.random() * 0.02 + 0.01,
        drift: {
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2
        }
      });
    }
  }
  
  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.influence = Math.min(this.mouse.influence + 0.08, 1);
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.influence = Math.max(this.mouse.influence - 0.03, 0);
    });
    
    // Enhanced theme change detection with excitement effect
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.classList.contains('dark');
      if (currentTheme !== this.lastTheme) {
        this.triggerExcitement();
        this.lastTheme = currentTheme;
      }
      this.updateThemeColors();
    });
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
  }
  
  updateThemeColors() {
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
      this.colors = {
        primary: 'rgba(53, 63, 224, 0.25)',      // More pronounced Indigo Blue
        secondary: 'rgba(222, 166, 53, 0.20)',   // More visible Amber Gold  
        accent: 'rgba(223, 192, 165, 0.15)',     // Enhanced Peach Beige
        connection: 'rgba(53, 63, 224, 0.12)',   // Stronger connections
        glow: 'rgba(222, 166, 53, 0.4)',
        background: 'rgba(11, 13, 26, 0.03)',
        trail: 'rgba(53, 63, 224, 0.08)'         // Visible trails
      };
    } else {
      this.colors = {
        primary: 'rgba(53, 63, 224, 0.20)',      // Enhanced Indigo Blue
        secondary: 'rgba(222, 166, 53, 0.15)',   // More visible Amber Gold
        accent: 'rgba(223, 192, 165, 0.12)',     // Enhanced Peach Beige
        connection: 'rgba(53, 63, 224, 0.10)',   // Stronger connections
        glow: 'rgba(53, 63, 224, 0.25)',
        background: 'rgba(248, 250, 252, 0.04)',
        trail: 'rgba(53, 63, 224, 0.06)'         // Visible trails
      };
    }
  }
  
  // Vector field calculation for fluid dynamics
  vectorField(x, y) {
    const fx = Math.sin(x * 0.01 + this.time * 0.001) * Math.cos(y * 0.008);
    const fy = Math.cos(x * 0.008 + this.time * 0.0015) * Math.sin(y * 0.01);
    return { x: fx * this.config.vectorFieldStrength, y: fy * this.config.vectorFieldStrength };
  }
  
  // Vortex influence calculation
  vortexInfluence(particle) {
    let totalVx = 0, totalVy = 0;
    
    this.vortices.forEach(vortex => {
      const dx = particle.x - vortex.x;
      const dy = particle.y - vortex.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < vortex.radius && distance > 0) {
        const strength = vortex.strength * (1 - distance / vortex.radius);
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        
        totalVx += Math.cos(angle) * strength;
        totalVy += Math.sin(angle) * strength;
      }
    });
    
    return { x: totalVx, y: totalVy };
  }
  
  // Stochastic noise for natural movement
  stochasticNoise() {
    return {
      x: (Math.random() - 0.5) * this.config.stochasticStrength,
      y: (Math.random() - 0.5) * this.config.stochasticStrength
    };
  }
  
  triggerExcitement() {
    this.excitationLevel = this.config.themeTransitionAmplifier;
    
    // Add impulse to all particles
    this.particles.forEach(particle => {
      const randomAngle = Math.random() * Math.PI * 2;
      const impulseStrength = 3.0;
      particle.vx += Math.cos(randomAngle) * impulseStrength;
      particle.vy += Math.sin(randomAngle) * impulseStrength;
    });
    
    // Excite vortices
    this.vortices.forEach(vortex => {
      vortex.strength *= 2.5;
      vortex.frequency *= 3;
    });
    
    // Create temporary excitement particles
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        originalVx: 0,
        originalVy: 0,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.4,
        phase: Math.random() * Math.PI * 2,
        frequency: Math.random() * 0.03 + 0.02,
        trail: [],
        trailMaxLength: 6,
        lifetime: 180, // Temporary particle
        isExcitement: true
      });
    }
  }

  // Stochastic potential field influence
  stochasticPotentialInfluence(particle) {
    let totalVx = 0, totalVy = 0;
    
    this.stochasticPotentials.forEach(potential => {
      const dx = particle.x - potential.x;
      const dy = particle.y - potential.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < potential.radius && distance > 0) {
        const influence = potential.strength * (1 - distance / potential.radius);
        const angle = Math.atan2(dy, dx);
        
        // Add some turbulence
        const turbulence = Math.sin(potential.phase + distance * 0.01) * 0.5;
        
        totalVx += Math.cos(angle + turbulence) * influence;
        totalVy += Math.sin(angle + turbulence) * influence;
      }
    });
    
    return { x: totalVx, y: totalVy };
  }
  
  updateParticles() {
    this.particles = this.particles.filter(particle => {
      // Handle lifetime for excitement particles
      if (particle.isExcitement) {
        particle.lifetime--;
        if (particle.lifetime <= 0) return false;
      }
      
      // Store previous position for trail
      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > particle.trailMaxLength) particle.trail.shift();
      
      // Vector field influence
      const field = this.vectorField(particle.x, particle.y);
      
      // Vortex influence
      const vortex = this.vortexInfluence(particle);
      
      // Stochastic potential field influence
      const stochastic = this.stochasticPotentialInfluence(particle);
      
      // Stochastic noise
      const noise = this.stochasticNoise();
      
      // Mouse interaction with enhanced attraction and falloff
      let mouseForce = { x: 0, y: 0 };
      if (this.mouse.influence > 0) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.mouseInfluenceRadius && distance > 0) {
          const force = (this.config.mouseInfluenceRadius - distance) / this.config.mouseInfluenceRadius;
          const attractionStrength = force * this.mouse.influence * this.config.mouseAttraction * 0.02;
          const interactionStrength = force * this.mouse.influence * this.config.mouseInfluence * 0.01;
          
          // Direct attraction to mouse (pulls particles toward cursor)
          mouseForce.x = (dx / distance) * attractionStrength * this.config.interactionSpeedMultiplier;
          mouseForce.y = (dy / distance) * attractionStrength * this.config.interactionSpeedMultiplier;
          
          // Additional circular motion around mouse
          const angle = Math.atan2(dy, dx) + Math.PI / 2;
          mouseForce.x += Math.cos(angle) * interactionStrength;
          mouseForce.y += Math.sin(angle) * interactionStrength;
        }
      }
      
      // Excitement amplification
      const excitementMultiplier = 1 + this.excitationLevel * 0.5;
      
      // Combine all forces with excitement amplification
      particle.vx = particle.originalVx + 
                   (field.x + vortex.x + stochastic.x + noise.x + mouseForce.x) * excitementMultiplier;
      particle.vy = particle.originalVy + 
                   (field.y + vortex.y + stochastic.y + noise.y + mouseForce.y) * excitementMultiplier;
      
      // Apply velocity with adaptive damping
      const damping = particle.isExcitement ? 0.95 : 0.6;
      particle.x += particle.vx * damping;
      particle.y += particle.vy * damping;
      
      // Harmonic oscillation for breathing effect with continuity
      particle.phase += particle.frequency * (1 + this.excitationLevel * 0.3);
      const pulse = Math.sin(particle.phase) * 0.3;
      particle.currentRadius = particle.radius + pulse;
      
      // Ensure opacity never goes to zero for continuity
      const opacityPulse = Math.sin(particle.phase * 0.7) * 0.15;
      particle.currentOpacity = Math.max(particle.baseOpacity + opacityPulse, this.config.continuityFactor * particle.baseOpacity);
      
      // Age tracking for natural variation
      particle.age += 0.01;
      
      // Smooth boundary wrapping with fade transition
      const fadeZone = 30;
      if (particle.x < -fadeZone) {
        particle.x = this.width + fadeZone;
        particle.currentOpacity *= 0.8; // Brief fade during wrap
      }
      if (particle.x > this.width + fadeZone) {
        particle.x = -fadeZone;
        particle.currentOpacity *= 0.8;
      }
      if (particle.y < -fadeZone) {
        particle.y = this.height + fadeZone;
        particle.currentOpacity *= 0.8;
      }
      if (particle.y > this.height + fadeZone) {
        particle.y = -fadeZone;
        particle.currentOpacity *= 0.8;
      }
      
      return true;
    });
    
    // Update vortices with excitement effects
    this.vortices.forEach(vortex => {
      vortex.phase += vortex.frequency * (1 + this.excitationLevel * 0.2);
      vortex.x += Math.sin(vortex.phase) * 0.5;
      vortex.y += Math.cos(vortex.phase * 1.1) * 0.3;
      
      // Keep vortices in bounds
      vortex.x = Math.max(100, Math.min(this.width - 100, vortex.x));
      vortex.y = Math.max(100, Math.min(this.height - 100, vortex.y));
      
      // Decay excitement effects on vortices
      if (this.excitationLevel > 0 && vortex.strength > this.config.vortexStrength) {
        vortex.strength *= 0.98;
        vortex.frequency = Math.max(vortex.frequency * 0.99, 0.005 + Math.random() * 0.01);
      }
    });
    
    // Update stochastic potentials with drift
    this.stochasticPotentials.forEach(potential => {
      potential.phase += potential.frequency;
      potential.x += potential.drift.vx * (1 + this.excitationLevel * 0.1);
      potential.y += potential.drift.vy * (1 + this.excitationLevel * 0.1);
      
      // Wrap potentials around screen
      if (potential.x < -50) potential.x = this.width + 50;
      if (potential.x > this.width + 50) potential.x = -50;
      if (potential.y < -50) potential.y = this.height + 50;
      if (potential.y > this.height + 50) potential.y = -50;
    });
  }
  
  drawConnections() {
    if (!this.colors) this.updateThemeColors();
    
    let connectionCount = 0;
    
    for (let i = 0; i < this.particles.length && connectionCount < this.config.maxConnections; i++) {
      for (let j = i + 1; j < this.particles.length && connectionCount < this.config.maxConnections; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectionDistance) {
          const opacity = (1 - distance / this.config.connectionDistance) * 0.8;
          
          // Create gradient connection with theme-aware colors
          const gradient = this.ctx.createLinearGradient(
            this.particles[i].x, this.particles[i].y,
            this.particles[j].x, this.particles[j].y
          );
          
          gradient.addColorStop(0, this.colors.primary.replace(/[\d\.]+\)$/g, `${opacity * 0.6})`));
          gradient.addColorStop(0.5, this.colors.connection.replace(/[\d\.]+\)$/g, `${opacity})`));
          gradient.addColorStop(1, this.colors.secondary.replace(/[\d\.]+\)$/g, `${opacity * 0.6})`));
          
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = 0.8 + opacity * 0.5;
          
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          
          connectionCount++;
        }
      }
    }
  }
  
  drawParticles() {
    if (!this.colors) this.updateThemeColors();
    
    this.particles.forEach(particle => {
      // Enhanced trail rendering with excitement effects and better visibility
      for (let i = 0; i < particle.trail.length - 1; i++) {
        const trailProgress = i / particle.trail.length;
        const trailOpacity = trailProgress * 0.6 * (1 + this.excitationLevel * 0.5);
        const trailSize = particle.currentRadius * trailProgress * 0.8;
        
        // Excitement particles get different trail colors, regular particles use trail color
        const trailColor = particle.isExcitement ? 
          this.colors.glow.replace(/[\d\.]+\)$/g, `${trailOpacity})`) :
          this.colors.trail.replace(/[\d\.]+\)$/g, `${trailOpacity})`);
        
        this.ctx.fillStyle = trailColor;
        this.ctx.beginPath();
        this.ctx.arc(particle.trail[i].x, particle.trail[i].y, Math.max(trailSize, 0.5), 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Enhanced particle glow for excitement particles
      const glowMultiplier = particle.isExcitement ? 2.5 : 1;
      const excitementGlow = 1 + this.excitationLevel * 0.4;
      
      // Main particle with enhanced gradient and glow
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.currentRadius * 3 * glowMultiplier
      );
      
      gradient.addColorStop(0, this.colors.glow.replace(/[\d\.]+\)$/g, `${particle.currentOpacity * 0.9 * excitementGlow})`));
      gradient.addColorStop(0.3, this.colors.primary.replace(/[\d\.]+\)$/g, `${particle.currentOpacity * 0.6 * excitementGlow})`));
      gradient.addColorStop(0.7, this.colors.secondary.replace(/[\d\.]+\)$/g, `${particle.currentOpacity * 0.3 * excitementGlow})`));
      gradient.addColorStop(1, this.colors.accent.replace(/[\d\.]+\)$/g, '0)'));
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.currentRadius * 2 * glowMultiplier, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Core particle with enhanced brightness for excitement
      const coreOpacity = particle.currentOpacity * 1.2 * excitementGlow;
      this.ctx.fillStyle = this.colors.primary.replace(/[\d\.]+\)$/g, `${coreOpacity})`);
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.currentRadius * 0.6, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Special effects for excitement particles
      if (particle.isExcitement) {
        // Pulsing ring effect
        const ringRadius = particle.currentRadius * 1.5;
        const ringOpacity = particle.currentOpacity * 0.3 * Math.sin(particle.phase * 2);
        this.ctx.strokeStyle = this.colors.glow.replace(/[\d\.]+\)$/g, `${ringOpacity})`);
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, ringRadius, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    });
  }
  
  drawGeometricPatterns() {
    if (!this.colors) this.updateThemeColors();
    
    // Only draw subtle mathematical patterns, remove heavy grid
    // Fibonacci spiral overlay with theme-aware colors
    this.ctx.strokeStyle = this.colors.secondary.replace(/[\d\.]+\)$/g, '0.04)');
    this.ctx.lineWidth = 0.3;
    
    const centerX = this.width * 0.618; // Golden ratio position
    const centerY = this.height * 0.382;
    const spiral = this.time * 0.002; // Slower rotation
    
    this.ctx.beginPath();
    for (let i = 0; i < 89; i++) { // Fibonacci number, reduced count
      const angle = i * 0.137508 + spiral; // Golden angle in radians
      const radius = Math.sqrt(i) * 4; // Smaller spiral
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();
    
    // Minimal golden ratio guides instead of heavy grid
    this.ctx.strokeStyle = this.colors.accent.replace(/[\d\.]+\)$/g, '0.02)');
    this.ctx.lineWidth = 0.2;
    
    // Horizontal golden ratio line
    const goldenY = this.height * 0.618;
    this.ctx.beginPath();
    this.ctx.moveTo(0, goldenY);
    this.ctx.lineTo(this.width, goldenY);
    this.ctx.stroke();
    
    // Vertical golden ratio line  
    const goldenX = this.width * 0.618;
    this.ctx.beginPath();
    this.ctx.moveTo(goldenX, 0);
    this.ctx.lineTo(goldenX, this.height);
    this.ctx.stroke();
  }
  
  animate() {
    this.time += 1;
    
    // Clear canvas with theme-aware background
    const isDark = document.documentElement.classList.contains('dark');
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Apply subtle background fill
    if (this.colors) {
      this.ctx.fillStyle = this.colors.background;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    // Update system state
    this.updateParticles();
    
    // Smooth mouse influence decay
    if (this.mouse.influence > 0) {
      this.mouse.influence = Math.max(this.mouse.influence - 0.008, 0);
    }
    
    // Excitement level decay with smooth falloff
    if (this.excitationLevel > 0) {
      this.excitationLevel = Math.max(this.excitationLevel - 0.02, 0);
    }
    
    // Update stochastic potentials phase
    this.stochasticPotentials.forEach(potential => {
      potential.phase += potential.frequency * (1 + this.excitationLevel * 0.1);
    });
    
    // Render layers in optimal order for performance
    this.drawGeometricPatterns();
    this.drawConnections();
    this.drawParticles();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('mathematical-bg');
  if (canvas) {
    new ElegantBackground(canvas);
  }
});
