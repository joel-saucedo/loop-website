document.addEventListener("DOMContentLoaded", () => {
  const shapes = document.querySelectorAll(".shape");
  
  document.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    shapes.forEach((shape) => {
      const depth = parseFloat(shape.dataset.depth) || 0.2;
      const moveX = (centerX - clientX) * depth * 0.02;
      const moveY = (centerY - clientY) * depth * 0.02;
      const rotation = depth * 30;
      
      shape.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation}deg)`;
    });
  });
  
  // Add some floating animation when mouse isn't moving
  let timeout;
  document.addEventListener("mousemove", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      shapes.forEach((shape, index) => {
        const floatY = Math.sin(Date.now() * 0.001 + index) * 10;
        const currentTransform = shape.style.transform || '';
        if (!currentTransform.includes('translate')) {
          shape.style.transform = `translateY(${floatY}px) rotate(${index * 45}deg)`;
        }
      });
    }, 3000);
  });
});