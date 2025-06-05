// filepath: /home/joelasaucedo/loop/website/assets/js/lightbox.js
// Enhanced lightbox functionality for demo images
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <img src="" alt="" class="lightbox-image">
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <div class="lightbox-caption"></div>
    </div>
    <div class="lightbox-overlay"></div>
  `;
  document.body.appendChild(lightbox);
  
  // Add lightbox styles
  const style = document.createElement('style');
  style.textContent = `
    .lightbox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }
    
    .lightbox.active {
      opacity: 1;
      visibility: visible;
    }
    
    .lightbox-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-2xl);
      transform: scale(0.8);
      transition: transform 0.3s ease;
    }
    
    .lightbox.active .lightbox-content {
      transform: scale(1);
    }
    
    .lightbox-image {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .lightbox-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .lightbox-close:hover {
      background: rgba(0, 0, 0, 0.9);
      transform: scale(1.1);
    }
    
    .lightbox-caption {
      padding: 1rem;
      color: var(--color-text);
      text-align: center;
      font-size: var(--font-size-sm);
      background: var(--color-surface);
    }
    
    .lightbox-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
  
  // Lightbox functionality
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
  
  function openLightbox(imageSrc, caption = '') {
    lightboxImage.src = imageSrc;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImage.src = '';
    }, 300);
  }
  
  // Event listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
  
  // Auto-attach to demo images
  setTimeout(() => {
    const demoImages = document.querySelectorAll('.demo-image, .screenshot');
    demoImages.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        const caption = img.getAttribute('alt') || img.getAttribute('data-caption') || '';
        openLightbox(img.src, caption);
      });
    });
  }, 100);
  
  // Expose global function
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
});