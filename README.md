# Tanzim Ikram Sheikh — Personal Academic Website

This repository contains the source code for my personal academic portfolio website. It features a minimal, modern, and highly responsive design tailored for research work and academic accomplishments.

Live Site: [tanzim-ikram.github.io](https://tanzim-ikram.github.io/)

## ✨ Key Features & Redesigns

- **Glassmorphism Navigation:** A horizontal sticky navbar on desktop and tablet with a frosted-glass blur background (`backdrop-filter`) that smoothly slides down on scroll.
- **Mobile Friendly Hamburger Menu:** Collapses into a sleek hamburger menu on mobile screens (`<= 768px`) with an overlay dropdown that auto-closes upon navigation.
- **Dynamic Publication Viewer:** Integrates with `publications.json` to dynamically render research papers, including thumbnail previews, co-authors, publisher venues, external links (PDF, code, etc.), and image viewer modal overlays.
- **Redesigned IELTS Scorecard:** Features a clean, horizontal scorecard layout matching the site's typography, presenting the overall CEFR level alongside segmented subscores.
- **Extra-Curricular Activities Section:** Minimal, modern list items with dotted role/organization split and a left-border accent hover glow effect.
- **Social Headers & Integrated CV:** Seamlessly balances social icons (ORCID, Google Scholar, LinkedIn, GitHub, Email) with a matching pill link to download the CV.

## 🛠️ File Structure

```
.
├── index.html          # Main webpage layout & content
├── styles.css          # Core CSS variables, glassmorphism, and responsive breakpoints
├── scripts.js          # JavaScript for publications loading, scrollspy, and mobile menu toggles
├── publications.json   # JSON database of publications, abstracts, and media paths
├── cv.md               # Markdown copy of the CV
└── images/             # Visual assets
    ├── publications/   # Research paper thumbnails (AirTune, Dementia, ReedMap, etc.)
    └── Tanzim_Formal_DP.png  # Profile photo
```

## 🚀 Running Locally

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/tanzim-ikram/tanzim-ikram.github.io.git
   cd tanzim-ikram.github.io
   ```
2. Start a local development server:
   - Using Python 3: `python -m http.server 8000`
   - Using Node (npx): `npx serve`
3. Open `http://localhost:8000` in your web browser.

## 📝 Modifying Publications

To add or update publications:
1. Open `publications.json`.
2. Add your publication object into the `publications` array following the structure:
   ```json
   {
     "title": "Paper Title",
     "authors": "Authors list",
     "venue": "Conference/Journal venue",
     "links": {
       "Paper": "URL",
       "Website": "URL"
     },
     "image": "images/publications/image-name.png",
     "selected": true
   }
   ```
   The site will dynamically parse, order, and display them.

## 📄 License

MIT License. Feel free to use this as a reference or template for your own academic website!
