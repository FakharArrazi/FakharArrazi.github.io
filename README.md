# Aidoudi El Fakhar Arrazi — Portfolio

A static, multi-page personal website. Plain HTML/CSS/JS, no build step,
no framework — deploys as-is to GitHub Pages.

## Design direction

White, minimal, Apple product-page in spirit, with Playnck's sense of
restraint and physical motion carried over in feel rather than looks:
thin borders and soft ambient shadows instead of gradients or glass,
large confident typography, and interactions that respond precisely
(image scale, arrow movement, underline reveal) without ever bouncing.

Nothing from the previous iteration was carried over structurally.
Every identity, project, and experience fact you provided was used
throughout, and everything not yet provided (education dates, contact
details, real imagery, the CV file) is left as a clearly labeled
placeholder rather than invented — search for the word `Placeholder`
to find every one of them.

## Folder structure

```
index.html          Home — hero, editorial intro, selected work, photography preview
portfolio.html       Technology case studies (Playnck, FANET/NS-3) + photography gallery
about.html            Background, education, experience, contact
cv.html                  CV, with a "Download CV" button

css/
  style.css      Design tokens, reset, nav, footer, shared components
                        (buttons, media placeholder, gallery tile, reveal system)
  home.css        index.html only
  portfolio.css  portfolio.html only
  about.css      about.html only
  cv.css            cv.html only

js/
  main.js         Shared: mobile nav, intelligent sticky header, scroll reveal
  portfolio.js  Photography data + gallery rendering + lightbox

assets/
  images/portrait/       your portrait photo(s)
  images/photography/   your photography portfolio images
  images/projects/         preview images for Playnck / FANET-NS-3
  cv/cv.pdf                    your downloadable CV
```

## Adding images (the short version)

Every image slot on the site — portrait, project previews, homepage
photography preview — is a "placeholder that watches for its own file."
Drop a file at the exact path already shown inside the placeholder
(visible in the browser, or listed below), reload the page, and it
appears automatically. No HTML editing required, ever, for these spots:

| Where | Expected path |
|---|---|
| Hero portrait | `assets/images/portrait/portrait.jpg` |
| Playnck case study + homepage preview | `assets/images/projects/playnck.jpg` |
| FANET/NS-3 homepage preview | `assets/images/projects/fanet-ns3.jpg` |
| Homepage photography preview (3 tiles) | `assets/images/photography/featured-01.jpg`, `featured-02.jpg`, `featured-03.jpg` |

This works via a small script in `js/main.js`: any `.media-placeholder`
with a `data-src="…"` attribute quietly checks whether that file loads,
and swaps itself for the real `<img>` the moment it does. If the file
isn't there yet, the placeholder just stays exactly as it was — nothing
ever shows broken. If you want the homepage's three photography tiles
to feature specific photos rather than those three filenames, edit the
`data-src` on each tile in `index.html` to point at whichever photos
you choose.

The full photography gallery on `portfolio.html` works differently and
already handled this correctly — see "Adding a photograph" below.

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
4. The same `PHOTOS` data isn't reused on the homepage preview — that's
   three static tiles in `index.html`. Update their `media-placeholder`
   blocks by hand if you want the homepage teaser to match specific shots.

## Adding a project image

Covered above in "Adding images (the short version)" — just drop the
file at the named path and reload. No HTML edit needed.

## Adding a future project

Playnck uses `.project--featured` (large, dominant, media-first) and
FANET/NS-3 uses `.project--research` (text/spec-first, with a small
inline SVG diagram instead of a photo). Copy whichever pattern fits a
new project's nature — product work reads better as `--featured`,
research/engineering work reads better as `--research` — from
`portfolio.html`, then update the index, title, description, tags or
spec rows, media, and GitHub link. Give its `.media-placeholder` a
`data-src` (and `data-alt`) pointing at wherever you'll save the image,
and it'll self-activate the same way every other image slot does.

## Adding the CV

Export your CV as a PDF and save it at `assets/cv/cv.pdf`. Every
"Download CV" button on the site (hero, CV page, footer) already points
at that path — no code changes needed. Update the text content on
`cv.html` to match.

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

- Type: `Inter` (display and body — large headlines lean on weight and
  tight tracking rather than a serif) and `IBM Plex Mono` (labels, tags,
  metadata, captions) — loaded via Google Fonts.
- Color: pure white background, near-black ink (`#1D1D1F`), a soft gray
  surface for placeholders/chips, and one restrained blue accent used
  only for links and focus states — see the CSS variables at the top of
  `css/style.css`. Body-readable text uses `--ink-soft`, not `--muted`;
  `--muted` is reserved for short decorative labels, where its lower
  contrast is intentional rather than an oversight.
- Motion: a small scroll-reveal on `[data-reveal]` elements, an
  intelligent header that hides on scroll-down and returns on scroll-up,
  subtle hover scale on imagery, and a smooth mobile nav — all respect
  `prefers-reduced-motion`.
