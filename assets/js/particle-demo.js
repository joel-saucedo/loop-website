document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  const demoStatus = document.getElementById("demoStatus");
  
  if (!canvas) return;

  // Enhanced canvas setup with high DPI support
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Enhanced particle system with better topics
  const particles = [];
  const connections = [];
  const topics = [
    { name: "Machine Learning", color: "#4C63D2", level: 1, category: "AI" },
    { name: "Neural Networks", color: "#5A73E0", level: 2, category: "AI" },
    { name: "Deep Learning", color: "#6B82F0", level: 2, category: "AI" },
    { name: "Natural Language", color: "#7C91FF", level: 3, category: "AI" },
    
    { name: "Quantum Computing", color: "#F7931E", level: 1, category: "Physics" },
    { name: "Quantum Gates", color: "#FF9F2A", level: 2, category: "Physics" },
    { name: "Superposition", color: "#FFAB36", level: 3, category: "Physics" },
    
    { name: "Data Science", color: "#FF6B6B", level: 1, category: "Data" },
    { name: "Statistics", color: "#FF7878", level: 2, category: "Data" },
    { name: "Visualization", color: "#FF8585", level: 3, category: "Data" },
    
    { name: "Web Development", color: "#10B981", level: 1, category: "Tech" },
    { name: "React.js", color: "#1DD1A1", level: 2, category: "Tech" },
    { name: "Node.js", color: "#2AE2B2", level: 2, category: "Tech" }
  ];

  let animationPhase = "scatter"; // scatter -> grouping -> organizing -> structured
  let phaseTimer = 0;
  let mouse = { x: 0, y: 0, down: false, hover: null };
  let connectionOpacity = 0;

  class Particle {
    constructor(topic, index) {
      this.topic = topic;
      this.targetX = 0;
      this.targetY = 0;
      this.x = Math.random() * (canvas.offsetWidth - 100) + 50;
      this.y = Math.random() * (canvas.offsetHeight - 100) + 50;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.radius = this.getRadius();
      this.color = topic.color;
      this.glowColor = this.lightenColor(topic.color, 40);
      this.index = index;
      this.isDragging = false;
      this.isHovered = false;
      this.opacity = 0.8;
      this.pulse = 0;
      this.trail = [];
      this.energy = Math.random() * 0.5 + 0.5;
      this.calculateTarget();
    }

    getRadius() {
      switch(this.topic.level) {
        case 1: return 12;
        case 2: return 9;
        case 3: return 6;
        default: return 8;
      }
    }

    lightenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    calculateTarget() {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const categories = [...new Set(topics.map(t => t.category))];
      
      if (animationPhase === "scatter") {
        this.targetX = Math.random() * (width - 100) + 50;
        this.targetY = Math.random() * (height - 100) + 50;
      } else if (animationPhase === "grouping") {
        // Group by category first
        const categoryIndex = categories.indexOf(this.topic.category);
        const categoryParticles = topics.filter(t => t.category === this.topic.category);
        const particleIndex = categoryParticles.findIndex(t => t.name === this.topic.name);
        
        const cols = Math.ceil(Math.sqrt(categories.length));
        const row = Math.floor(categoryIndex / cols);
        const col = categoryIndex % cols;
        
        const baseX = (width / cols) * col + (width / cols) * 0.5;
        const baseY = (height / 2) * row + (height / 4);
        
        const angle = (particleIndex / categoryParticles.length) * Math.PI * 2;
        const radius = 40 + (categoryParticles.length * 3);
        
        this.targetX = baseX + Math.cos(angle) * radius;
        this.targetY = baseY + Math.sin(angle) * radius;
      } else if (animationPhase === "organizing") {
        // Organize by level within categories
        const categoryIndex = categories.indexOf(this.topic.category);
        const levelParticles = topics.filter(t => t.category === this.topic.category && t.level === this.topic.level);
        const particleIndex = levelParticles.findIndex(t => t.name === this.topic.name);
        
        const cols = categories.length;
        const baseX = (width / cols) * categoryIndex + (width / cols) * 0.5;
        const levelY = height * (0.2 + (this.topic.level - 1) * 0.25);
        
        this.targetX = baseX + (particleIndex - levelParticles.length/2) * 60;
        this.targetY = levelY;
      } else if (animationPhase === "structured") {
        // Final hierarchical structure
        const categoryIndex = categories.indexOf(this.topic.category);
        const cols = categories.length;
        const baseX = (width / cols) * categoryIndex + (width / cols) * 0.5;
        
        if (this.topic.level === 1) {
          this.targetX = baseX;
          this.targetY = height * 0.15;
        } else {
          const levelParticles = topics.filter(t => t.category === this.topic.category && t.level === this.topic.level);
          const particleIndex = levelParticles.findIndex(t => t.name === this.topic.name);
          this.targetX = baseX + (particleIndex - levelParticles.length/2) * 50;
          this.targetY = height * (0.25 + (this.topic.level - 2) * 0.2);
        }
      }
    }

    update() {
      this.pulse += 0.02;
      
      // Add to trail
      this.trail.push({ x: this.x, y: this.y, opacity: 0.5 });
      if (this.trail.length > 8) this.trail.shift();
      
      // Update trail opacity
      this.trail.forEach((point, index) => {
        point.opacity *= 0.85;
      });

      if (!this.isDragging) {
        // Enhanced movement with energy
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Adaptive movement speed based on distance
        const moveStrength = Math.min(distance * 0.0001, 0.03) * this.energy;
        
        this.vx += dx * moveStrength;
        this.vy += dy * moveStrength;
        this.vx *= 0.88;
        this.vy *= 0.88;
        
        // Add subtle floating motion
        this.x += this.vx + Math.sin(this.pulse * this.energy) * 0.3;
        this.y += this.vy + Math.cos(this.pulse * this.energy * 1.1) * 0.2;
      }

      // Enhanced mouse interaction
      const dist = Math.sqrt((mouse.x - this.x) ** 2 + (mouse.y - this.y) ** 2);
      this.isHovered = dist < this.radius + 15;
      
      if (dist < this.radius + 10 && mouse.down) {
        this.isDragging = true;
        this.x = mouse.x;
        this.y = mouse.y;
      } else if (!mouse.down) {
        this.isDragging = false;
      }
      
      // Repulsion from other particles
      particles.forEach(other => {
        if (other !== this) {
          const dx = other.x - this.x;
          const dy = other.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = this.radius + other.radius + 5;
          
          if (distance < minDistance && distance > 0) {
            const force = (minDistance - distance) * 0.01;
            const angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * force;
            this.vy -= Math.sin(angle) * force;
          }
        }
      });
    }

    draw() {
      // Draw trail
      this.trail.forEach((point, index) => {
        const trailRadius = (this.radius * 0.5) * (index / this.trail.length);
        const trailAlpha = point.opacity * (index / this.trail.length);
        
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, trailRadius + 5
        );
        gradient.addColorStop(0, this.color + Math.floor(trailAlpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, this.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, trailRadius + 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections for structured phase
      if (animationPhase === "structured" && this.topic.level === 2) {
        const parentParticles = particles.filter(p => 
          p.topic.level === 1 && p.topic.category === this.topic.category
        );
        parentParticles.forEach(parent => {
          const distance = Math.sqrt((parent.x - this.x) ** 2 + (parent.y - this.y) ** 2);
          const opacity = Math.max(0, 1 - distance / 150) * connectionOpacity;
          
          ctx.strokeStyle = this.color + Math.floor(opacity * 100).toString(16).padStart(2, '0');
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(parent.x, parent.y);
          ctx.stroke();
        });
      }

      // Enhanced particle glow
      const pulseSize = Math.sin(this.pulse) * 2;
      const glowSize = this.isDragging ? 25 : (this.isHovered ? 18 : 12);
      const baseRadius = this.radius + pulseSize;
      
      // Outer glow
      const outerGradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, baseRadius + glowSize
      );
      outerGradient.addColorStop(0, this.color + '80');
      outerGradient.addColorStop(0.7, this.color + '20');
      outerGradient.addColorStop(1, this.color + '00');
      
      ctx.fillStyle = outerGradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, baseRadius + glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Main particle with enhanced gradient
      const mainGradient = ctx.createRadialGradient(
        this.x - baseRadius * 0.3, this.y - baseRadius * 0.3, 0,
        this.x, this.y, baseRadius
      );
      mainGradient.addColorStop(0, this.lightenColor(this.color, 30));
      mainGradient.addColorStop(0.7, this.color);
      mainGradient.addColorStop(1, this.lightenColor(this.color, -20));
      
      ctx.fillStyle = mainGradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, baseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Highlight for interactivity
      if (this.isHovered || this.isDragging) {
        ctx.fillStyle = this.lightenColor(this.color, 50) + '40';
        ctx.beginPath();
        ctx.arc(this.x - baseRadius * 0.4, this.y - baseRadius * 0.4, baseRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw label for level 1 particles
      if (this.topic.level === 1 && animationPhase === "structured") {
        ctx.fillStyle = this.color;
        ctx.font = `600 ${Math.max(10, baseRadius * 0.7)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Text shadow
        ctx.fillStyle = '#00000080';
        ctx.fillText(this.topic.name, this.x + 1, this.y + 1);
        
        ctx.fillStyle = this.color;
        ctx.fillText(this.topic.name, this.x, this.y);
      }
    }
  }

  // Initialize particles
  topics.forEach((topic, index) => {
    particles.push(new Particle(topic, index));
  });

  // Enhanced mouse and touch events
  function getEventPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  // Mouse events
  canvas.addEventListener("mousedown", (e) => {
    const pos = getEventPos(e);
    mouse.x = pos.x;
    mouse.y = pos.y;
    mouse.down = true;
  });

  canvas.addEventListener("mousemove", (e) => {
    const pos = getEventPos(e);
    mouse.x = pos.x;
    mouse.y = pos.y;
  });

  canvas.addEventListener("mouseup", () => {
    mouse.down = false;
    particles.forEach(p => p.isDragging = false);
  });

  // Touch events for mobile
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const pos = getEventPos(e);
    mouse.x = pos.x;
    mouse.y = pos.y;
    mouse.down = true;
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const pos = getEventPos(e);
    mouse.x = pos.x;
    mouse.y = pos.y;
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    mouse.down = false;
    particles.forEach(p => p.isDragging = false);
  });

  // Enhanced animation phases with better timing
  function updatePhase() {
    phaseTimer++;
    
    if (phaseTimer > 180 && animationPhase === "scatter") {
      animationPhase = "grouping";
      demoStatus.textContent = "AI identifying topic relationships...";
      particles.forEach(p => p.calculateTarget());
      connectionOpacity = 0.3;
      phaseTimer = 0;
    } else if (phaseTimer > 150 && animationPhase === "grouping") {
      animationPhase = "organizing";
      demoStatus.textContent = "Organizing by hierarchy and connections...";
      particles.forEach(p => p.calculateTarget());
      connectionOpacity = 0.6;
      phaseTimer = 0;
    } else if (phaseTimer > 180 && animationPhase === "organizing") {
      animationPhase = "structured";
      demoStatus.textContent = "✨ Perfect structure achieved! Drag particles to interact";
      particles.forEach(p => p.calculateTarget());
      connectionOpacity = 1;
      phaseTimer = 0;
    } else if (phaseTimer > 240 && animationPhase === "structured") {
      animationPhase = "scatter";
      demoStatus.textContent = "🔄 Restarting demo - Watch AI organize your notes";
      particles.forEach(p => p.calculateTarget());
      connectionOpacity = 0;
      phaseTimer = 0;
    }
  }

  // Theme update function for theme toggle integration
  window.updateParticleTheme = function(theme) {
    // Update particle colors based on theme
    particles.forEach(particle => {
      if (theme === 'light') {
        // Adjust colors for light theme
        particle.color = particle.topic.color;
      } else {
        // Adjust colors for dark theme
        particle.color = particle.topic.color;
      }
    });
  };

  // Enhanced animation loop with performance optimization
  let lastTime = 0;
  function animate(currentTime) {
    const deltaTime = currentTime - lastTime;
    
    // Limit to 60fps for performance
    if (deltaTime > 16.67) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      updatePhase();
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      lastTime = currentTime;
    }
    
    requestAnimationFrame(animate);
  }

  // Start animation
  animate(0);

  // Performance monitoring
  let frameCount = 0;
  let lastFpsTime = performance.now();
  
  function updateFPS() {
    frameCount++;
    const now = performance.now();
    
    if (now - lastFpsTime >= 1000) {
      const fps = Math.round(frameCount * 1000 / (now - lastFpsTime));
      frameCount = 0;
      lastFpsTime = now;
      
      // Adjust quality based on performance
      if (fps < 30) {
        ctx.imageSmoothingEnabled = false;
      } else {
        ctx.imageSmoothingEnabled = true;
      }
    }
  }

  // Update FPS in animation loop
  setInterval(updateFPS, 100);
});