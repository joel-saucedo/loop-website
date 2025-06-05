// Enhanced header scroll effects
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  let isScrollingDown = false;
  
  function updateHeader() {
    const scrollY = window.scrollY;
    
    // Add scrolled class for styling
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header based on scroll direction (optional)
    if (scrollY > lastScrollY && scrollY > 100) {
      // Scrolling down
      if (!isScrollingDown) {
        isScrollingDown = true;
        header.style.transform = 'translateY(-100%)';
      }
    } else {
      // Scrolling up
      if (isScrollingDown) {
        isScrollingDown = false;
        header.style.transform = 'translateY(0)';
      }
    }
    
    lastScrollY = scrollY;
  }
  
  // Throttle scroll events for performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Active nav link highlighting
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], .hero');
    const navLinks = document.querySelectorAll('.site-nav a');
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id') || 'home';
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}` || 
          (current === 'home' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Initial call
});
