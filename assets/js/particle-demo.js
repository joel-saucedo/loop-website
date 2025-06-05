document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  const demoStatus = document.getElementById("demoStatus");
  
  if (!canvas) return;

  // Set canvas size
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Particle system
  const particles = [];
  const topics = [
    { name: "Quantum Mechanics", color: "#353FE0", level: 1 },
    { name: "Wave Functions", color: "#DEA635", level: 2 },
    { name: "Schrödinger Eq.", color: "#DFC0A5", level: 2 },
    { name: "Particle Physics", color: "#353FE0", level: 1 },
    { name: "Thermodynamics", color: "#353FE0", level: 1 },
    { name: "Statistical Mechanics", color: "#DEA635", level: 2 },
    { name: "Heat Transfer", color: "#DFC0A5", level: 2 },
    { name: "Entropy", color: "#DFC0A5", level: 2 }
  ];

  let animationPhase = "scatter"; // scatter -> organize -> structured
  let phaseTimer = 0;
  let mouse = { x: 0, y: 0, down: false };

  class Particle {
    constructor(topic, index) {
      this.topic = topic;
      this.targetX = 0;
      this.targetY = 0;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = 0;
      this.vy = 0;
      this.radius = topic.level === 1 ? 8 : 6;
      this.color = topic.color;
      this.index = index;
      this.isDragging = false;
      this.calculateTarget();
    }

    calculateTarget() {
      if (animationPhase === "scatter") {
        this.targetX = Math.random() * (canvas.width - 100) + 50;
        this.targetY = Math.random() * (canvas.height - 100) + 50;
      } else if (animationPhase === "organize") {
        // Group by level - level 1 topics at top, level 2 below
        const level1Topics = topics.filter(t => t.level === 1);
        const level2Topics = topics.filter(t => t.level === 2);
        
        if (this.topic.level === 1) {
          const index = level1Topics.findIndex(t => t.name === this.topic.name);
          this.targetX = (canvas.width / (level1Topics.length + 1)) * (index + 1);
          this.targetY = canvas.height * 0.25;
        } else {
          const index = level2Topics.findIndex(t => t.name === this.topic.name);
          this.targetX = (canvas.width / (level2Topics.length + 1)) * (index + 1);
          this.targetY = canvas.height * 0.65;
        }
      } else if (animationPhase === "structured") {
        // Hierarchical tree structure
        if (this.topic.level === 1) {
          const index = topics.filter(t => t.level === 1).findIndex(t => t.name === this.topic.name);
          this.targetX = (canvas.width / 4) * (index + 1);
          this.targetY = canvas.height * 0.2;
        } else {
          const index = topics.filter(t => t.level === 2).findIndex(t => t.name === this.topic.name);
          this.targetX = (canvas.width / 5) * (index + 1);
          this.targetY = canvas.height * 0.7;
        }
      }
    }

    update() {
      if (!this.isDragging) {
        // Move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.vx += dx * 0.02;
        this.vy += dy * 0.02;
        this.vx *= 0.85;
        this.vy *= 0.85;
        this.x += this.vx;
        this.y += this.vy;
      }

      // Mouse interaction
      const dist = Math.sqrt((mouse.x - this.x) ** 2 + (mouse.y - this.y) ** 2);
      if (dist < this.radius + 10 && mouse.down) {
        this.isDragging = true;
        this.x = mouse.x;
        this.y = mouse.y;
      } else if (!mouse.down) {
        this.isDragging = false;
      }
    }

    draw() {
      // Draw connections for structured phase
      if (animationPhase === "structured" && this.topic.level === 2) {
        const parentParticles = particles.filter(p => p.topic.level === 1);
        parentParticles.forEach(parent => {
          ctx.strokeStyle = this.color + "40";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(parent.x, parent.y);
          ctx.stroke();
        });
      }

      // Draw particle
      const glow = this.isDragging ? 20 : 10;
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius + glow);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, this.color + "00");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + glow, 0, Math.PI * 2);
      ctx.fill();

      // Draw solid particle
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw label
      ctx.fillStyle = "#DFDFDF";
      ctx.font = "12px Inter";
      ctx.textAlign = "center";
      ctx.fillText(this.topic.name, this.x, this.y + this.radius + 15);
    }
  }

  // Initialize particles
  topics.forEach((topic, index) => {
    particles.push(new Particle(topic, index));
  });

  // Mouse events
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.down = true;
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseup", () => {
    mouse.down = false;
    particles.forEach(p => p.isDragging = false);
  });

  // Animation phases
  function updatePhase() {
    phaseTimer++;
    
    if (phaseTimer > 300 && animationPhase === "scatter") {
      animationPhase = "organize";
      demoStatus.textContent = "AI organizing topics by hierarchy...";
      particles.forEach(p => p.calculateTarget());
      phaseTimer = 0;
    } else if (phaseTimer > 200 && animationPhase === "organize") {
      animationPhase = "structured";
      demoStatus.textContent = "Creating structured notebook layout • Click and drag particles!";
      particles.forEach(p => p.calculateTarget());
      phaseTimer = 0;
    } else if (phaseTimer > 400 && animationPhase === "structured") {
      animationPhase = "scatter";
      demoStatus.textContent = "Restarting demo • AI structuring in progress";
      particles.forEach(p => p.calculateTarget());
      phaseTimer = 0;
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updatePhase();
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    requestAnimationFrame(animate);
  }

  animate();
});