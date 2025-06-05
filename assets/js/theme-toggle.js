document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  
  // Enhanced theme system with smooth transitions and CSS variables
  function setTheme(theme, animate = true) {
    if (animate) {
      // Add transition class for smooth theme switching
      html.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      // Add a brief flash effect to indicate theme change
      toggle.style.transform = 'scale(0.9)';
      setTimeout(() => {
        toggle.style.transform = 'scale(1)';
      }, 150);
      
      setTimeout(() => {
        html.style.transition = '';
      }, 400);
    }
    
    if (theme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
      toggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      toggle.setAttribute('aria-label', 'Switch to dark theme');
      toggle.title = 'Switch to dark theme';
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
      toggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      toggle.setAttribute('aria-label', 'Switch to light theme');
      toggle.title = 'Switch to light theme';
    }
    
    localStorage.setItem("theme", theme);
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    
    // Update particle demo colors if it exists
    if (window.updateParticleTheme) {
      window.updateParticleTheme(theme);
    }
  }
  
  // Initialize theme with system preference detection
  function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme, false);
    } else if (systemPrefersDark) {
      setTheme("dark", false);
    } else {
      setTheme("dark", false); // Default to dark as requested
    }
  }
  
  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });
  
  // Enhanced toggle with animation
  toggle.addEventListener("click", () => {
    const currentTheme = html.classList.contains("dark") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    // Add visual feedback
    toggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
      toggle.style.transform = 'scale(1)';
    }, 100);
    
    setTheme(newTheme);
  });
  
  // Initialize
  initializeTheme();
});