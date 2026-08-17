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
index.html          Home — hero, editorial intro (with portrait), what I do, selected work CTA
portfolio.html       Playnck, FANET/NS-3, Photography, Design — each with a swipeable gallery
about.html            Background, education, experience, contact
cv.html                  CV, with a "Download CV" button

css/
  style.css      Design tokens, reset, nav, footer, shared components
                        (buttons, media placeholder, reveal system)
  home.css        index.html only
  portfolio.css  portfolio.html only — project blocks + carousel component
  about.css      about.html only
  cv.css            cv.html only

js/
  main.js         Shared: mobile nav, sticky header, media-placeholder
                        auto-detection, scroll reveal
  portfolio.js  Carousel behavior (drag/swipe, buttons, dots, keyboard)
                       for the galleries on portfolio.html

assets/
  images/portrait/       your portrait photo
  playnck/                    Playnck screenshots (screenshot-01.jpg, -02, -03…)
  fanet/                        FANET/NS-3 images (image-01.jpg, -02…)
  photography/            photography gallery (photo-01.jpg, -02, -03…)
  design/                      design work gallery (design-01.jpg, -02, -03…)
  cv/cv.pdf                    your downloadable CV
```

## Adding images

Every gallery slot on `portfolio.html` (Playnck, FANET/NS-3, Photography,
Design) is a `.media-placeholder` that watches for its own file, same as
the homepage portrait. Drop a correctly-named file at the path already
shown on the placeholder box, commit, push — it appears automatically.
No HTML editing required.

| Section | Folder | Expected filenames |
|---|---|---|
| Hero portrait (index.html) | `assets/images/portrait/` | `portrait.jpg` |
| Playnck | `assets/playnck/` | `screenshot-01.jpg`, `screenshot-02.jpg`, `screenshot-03.jpg` |
| FANET / NS-3 | `assets/fanet/` | `image-01.jpg`, `image-02.jpg` |
| Photography | `assets/photography/` | `photo-01.jpg` … `photo-04.jpg` |
| Design | `assets/design/` | `design-01.jpg` … `design-03.jpg` |

Each gallery is a small drag/swipe carousel (mouse, touch, prev/next
buttons, dots, and left/right arrow keys all work). The first image in
each gallery loads immediately; the rest load lazily once the gallery
scrolls near the viewport — this is handled in `js/portfolio.js` and
doesn't need any changes when you add photos.

### Adding more images to a gallery than the slots above

Each gallery is a static list of slides in `portfolio.html`, so to add
a 4th Playnck screenshot (for example), copy one `.carousel__slide`
block within that project's `.carousel__track` and update its image
path — the carousel JS picks up any number of slides automatically.

### Renaming or reordering assets

Just make sure the filename in `portfolio.html`'s `src`/`data-src`
matches the actual file in the matching `assets/…` folder — the first
slide in each carousel uses `src` (loads immediately), every other
slide uses `data-src` (loads lazily).

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

- Type: `Fraunces` (headlines, logo mark), `Inter` (body), and
  `IBM Plex Mono` (labels, tags, buttons, captions) — loaded via Google
  Fonts.
- The Playnck "Download latest version" button links to
  `.../releases/latest` on GitHub rather than a specific file, so it
  always points at whatever you publish most recently — no need to
  update the link when you cut a new release.
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
