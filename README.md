# Aidoudi El Fakhar Arrazi — Portfolio

A static, multi-page personal website. Plain HTML/CSS/JS, no build step,
no framework — deploys as-is to GitHub Pages.

## What replaced what

This is a full replacement of the previous single-page design with a
four-page site (`index.html`, `portfolio.html`, `about.html`, `cv.html`),
each with its own stylesheet on top of a shared base (`css/style.css`).
Nothing from the old page was carried over structurally; the identity,
project, and experience facts you provided were used throughout, and
everything not yet provided (education dates, contact details, real
imagery) is left as a clearly labeled placeholder rather than invented.

## Folder structure

```
index.html          Home — who you are
portfolio.html       Technology projects + photography gallery
about.html            Background, education, experience, contact
cv.html                  CV, with a "Download CV" button

css/
  style.css      Design tokens, reset, nav, footer, shared components
  home.css        index.html only
  portfolio.css  portfolio.html only
  about.css      about.html only
  cv.css            cv.html only

js/
  main.js         Shared: mobile nav, sticky header, scroll reveal
  portfolio.js  Photography data + gallery rendering + lightbox

assets/
  images/portrait/       your portrait photo(s)
  images/photography/   your photography portfolio images
  images/projects/         preview images for Playnck / FANET-NS-3
  cv/cv.pdf                    your downloadable CV
```

## Adding a photograph

1. Put the image file in `assets/images/photography/`.
2. Open `js/portfolio.js` and add one entry to the `PHOTOS` array:
   ```js
   {
     src: "assets/images/photography/your-file.jpg",
     category: "street", // or "landscape" / "portrait"
     caption: "Short caption",
     ref: "09"            // any short label — index, place, roll number
   }
   ```
3. Commit and push. It appears in the gallery and its category filter
   automatically. Until `src` is set, an entry renders as a labeled
   placeholder block so you can preview the layout before adding photos.

## Adding a future project

Open `portfolio.html`, find the `#technology` section, and copy one
`<article class="project">…</article>` block. Update the index, title,
description, metadata tags, media placeholder path, and GitHub link.

## Adding the CV

Export your CV as a PDF and save it at `assets/cv/cv.pdf`. The
"Download CV" button on `cv.html` already points at that path — no
code changes needed. Update the text content on `cv.html` to match.

## Filling in placeholders

Search the project for the word `Placeholder` to find every spot that
still needs real information: education, role descriptions at El Fadjer
and SARL Screen Star, skills/languages, and contact details (email,
LinkedIn, Instagram — only add what you actually want public).

## Testing locally

Any static server works, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening the HTML files directly in a browser also works for a quick
look, though a local server is closer to how GitHub Pages will serve it.

## Publishing

```bash
git add .
git commit -m "Redesign portfolio"
git push
```

If this repo is already configured for GitHub Pages (as
`fakhararrazi.github.io` implies), the push is all that's needed.

## Design system, briefly

- Type: `Fraunces` (display/serif headlines), `Inter` (body/UI),
  `IBM Plex Mono` (labels, metadata, captions) — loaded via Google Fonts.
- Color: off-white background, near-black ink, one restrained blue
  accent used only for focus states and hover — see the CSS variables
  at the top of `css/style.css`.
- Motion: a small scroll-reveal on `[data-reveal]` elements, subtle
  hover scale on imagery, and a smooth mobile nav — all respect
  `prefers-reduced-motion`.
