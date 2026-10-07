# Aidoudi El Fakhar Arrazi

Software developer & designer based in Sétif, Algeria. This repo is my personal portfolio site.

## Other repos

- [Project-Playnck](https://github.com/FakharArrazi/Project-Playnck) — Electron music player
- [Project-FANET-NS3-Simulation](https://github.com/FakharArrazi/Project-FANET-NS3-Simulation) — FANET simulation research (NS-3)

## Structure

- `index.html`, `portfolio.html`, `about.html`, `cv.html`: static pages, no build step required.
- `css/style.css` holds the shared foundation; each page has its own stylesheet.
- `js/main.js` is shared; `js/lightbox.js` and `js/portfolio.js` load only where needed.
- `assets/web/` contains the optimized, responsive WebP images the pages use, and `assets/fonts/` the self-hosted fonts.
- The original full resolution images in the other `assets/` folders are the sources for `assets/web/` and are not loaded by the site.
