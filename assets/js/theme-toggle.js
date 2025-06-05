document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  
  // On load, apply saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
    toggle.textContent = "☀️";
  } else {
    toggle.textContent = "🌓";
  }
  
  toggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    if (document.documentElement.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      toggle.textContent = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      toggle.textContent = "🌓";
    }
  });
});