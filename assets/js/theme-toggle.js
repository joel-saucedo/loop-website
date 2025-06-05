document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  
  // Set default to dark theme
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "dark");
    html.classList.add("dark");
    html.classList.remove("light");
  } else {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      html.classList.add("light");
      html.classList.remove("dark");
      toggle.textContent = "◑";
    } else {
      html.classList.add("dark");
      html.classList.remove("light");
      toggle.textContent = "◐";
    }
  }
  
  toggle.addEventListener("click", () => {
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
      toggle.textContent = "◑";
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      toggle.textContent = "◐";
    }
  });
});