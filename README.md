# LOOP AI - Website

🚀 **Stay in the Loop** - AI-powered note-taking Chrome extension website

## Overview

This is the official website for LOOP (Learn Organize Outline Plan), a state-of-the-art AI-powered note-taking Chrome extension that transforms scattered thoughts into organized knowledge.

## Features

- **Dark Theme by Default** - Modern, professional appearance
- **Interactive Particle Demo** - Showcases AI organization capabilities
- **Responsive Design** - Works seamlessly across all devices
- **7-Day Free Trial** - Prominent call-to-action throughout
- **No Emojis** - Clean, professional design with symbolic characters
- **Modern CSS Architecture** - Modular, maintainable stylesheets

## Pages

- `index.html` - Homepage with hero section and particle demo
- `features.html` - Comprehensive feature showcase
- `demo.html` - Interactive demonstrations of AI capabilities
- `pricing.html` - Pricing plans with 7-day free trial emphasis
- `contact.html` - Contact form and information

## Development

### Theme System
- Dark theme by default with light theme toggle
- CSS custom properties for consistent theming
- Smooth transitions between themes

### Interactive Elements
- Particle animation demonstrating AI organization
- Mouse parallax effects for geometric shapes
- Interactive demos for AI features

### Design Principles
- No emojis (replaced with symbolic characters: ◉, ⧈, ◎, ◈, ◐, @, #, ⟲)
- "Stay in the Loop" as primary tagline
- Appeals to vast audience without cliché language
- Professional, modern aesthetic

## Deployment

The website is automatically deployed to GitHub Pages via GitHub Actions. Any push to the `master` branch triggers a new deployment.

**Live Website:** [https://joel-saucedo.github.io/loop-website/](https://joel-saucedo.github.io/loop-website/)

## Technologies

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript
- GitHub Pages for hosting
- GitHub Actions for CI/CD

## File Structure

```
├── index.html              # Homepage
├── features.html           # Features page  
├── demo.html              # Interactive demos
├── pricing.html           # Pricing plans
├── contact.html           # Contact form
├── assets/
│   ├── css/
│   │   ├── reset.css      # CSS reset
│   │   ├── vars.css       # CSS custom properties
│   │   ├── base.css       # Base styles
│   │   ├── header.css     # Header component
│   │   └── hero.css       # Hero section
│   ├── js/
│   │   ├── theme-toggle.js    # Dark/light theme
│   │   ├── mouse-parallax.js  # Parallax effects
│   │   └── particle-demo.js   # Particle animation
│   └── images/
│       └── logo.png       # LOOP logo
├── .nojekyll             # GitHub Pages config
└── README.md             # This file
```

## Contributing

1. Make changes to the appropriate files
2. Test locally by opening `index.html` in a browser
3. Commit changes with descriptive messages
4. Push to `master` branch for automatic deployment

---

**LOOP** - Learn • Organize • Outline • Plan