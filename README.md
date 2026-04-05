<h1 align="center">
  <img src="https://i.ibb.co/2WvVqHnG/Screenshot-2026-04-05-at-1-18-20-AM.png" alt="RoboRecruit" height="40">
</h1>
<p align="center">
  <i>The only on-demand driver platform built exclusively for FedEx Ground ISPs.</i>
</p>

---

## ⚡ Overview
**RoboRecruit®** is a high-performance, serverless single-page application (SPA) designed to showcase a live, animated logistics network. It serves as a visual dispatch terminal simulating a "Cyber-Dispatch" aesthetic with deep glassmorphism, dynamic data ingestion, and cinematic scroll animations.

## 🚀 Features
- **Serverless Architecture**: 100% Netlify-ready. Bypasses standard backend requirements by natively scraping and parsing a static 10,000+ driver dataset (`.csv`) via client-side D3.js.
- **Cinematic Interactivity**: Powered by GSAP and Lenis for ultra-smooth scroll-jacking, horizontal pipeline stacks, and fluid reveal physics.
- **Interactive Data Maps**: A geo-mapped visualization of 28 major logistics hubs using TopoJSON and D3.js, featuring animated transit routes and live hover states.
- **Deep Glassmorphism**: High-fidelity CSS using dynamic drop-shadows, holographic text gradients, and backdrop filters for a premium "neon dispatch" aesthetic.

## 🛠️ Technology Stack
- **Core**: HTML5, Vanilla JavaScript, CSS3
- **Data Layers**: D3.js v7 (CSV parsing, SVG mapping), TopoJSON
- **Physics**: GSAP v3.12 (ScrollTrigger), Lenis
- **Deployment**: Netlify (Static Hosting)

## 📦 Local Development

To run this project locally on your machine:

1. Clone this repository:
```bash
git clone https://github.com/Zaheer2801/roborecruit.git
cd roborecruit
```

2. Start a local Python server (to bypass strict local browser CORS policies):
```bash
python3 -m http.server 3000
```
*(Optionally, you can run the included `server.py` script: `python3 server.py`)*

3. Open your browser and navigate to:
```text
http://localhost:3000
```

## 🌐 Netlify Deployment
RoboRecruit is engineered to be globally served via Edge CDNs.

1. Connect this GitHub repository to your [Netlify account](https://app.netlify.com/).
2. In the deployment settings, configure the following:
   - **Publish directory:** `public`
   - **Build command:** *(Leave empty)*
3. Trigger the deploy. Netlify will automatically extract the static CSS, JS, HTML, and CSV payload inside the `public/` directory and serve it live!

---
<p align="center">
  <i>© 2026 RoboRecruit®. All rights reserved. Drivers On Demand. Cleared to Go.®</i>
</p>
