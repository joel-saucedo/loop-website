document.addEventListener("DOMContentLoaded", () => {
  const shapes = document.querySelectorAll(".shape");
  let mouseX = 0;
  let mouseY = 0;
  let isMouseMoving = false;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    isMouseMoving = true;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    shapes.forEach((shape) => {
      const depth = parseFloat(shape.dataset.depth) || 0.1;
      const moveX = (centerX - mouseX) * depth * 0.03;
      const moveY = (centerY - mouseY) * depth * 0.03;
      const rotation = depth * 45;
      
      shape.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation}deg) scale(${1 + depth * 0.1})`;
    });
  });

  // Smooth animation when mouse stops
  setInterval(() => {
    if (isMouseMoving) {
      isMouseMoving = false;
      setTimeout(() => {
        if (!isMouseMoving) {
          shapes.forEach((shape) => {
            shape.style.transform = "translate(0px, 0px) rotate(0deg) scale(1)";
          });
        }
      }, 2000);
    }
  }, 100);
});