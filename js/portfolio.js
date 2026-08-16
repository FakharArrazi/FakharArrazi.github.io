/* portfolio.js — powers the photography gallery on portfolio.html.
   ------------------------------------------------------------------
   HOW TO ADD A PHOTOGRAPH
   1. Put the image file in  assets/images/photography/
   2. Add one object to the PHOTOS array below:
        {
          src: "assets/images/photography/your-file.jpg",
          category: "street" | "landscape" | "portrait",
          caption: "Short caption for the photo",
          ref: "01"   // any short mono label — index, location, roll number...
        }
   3. Commit and push. The photo will appear in the gallery and in the
      filter for its category automatically.

   Until src points to a real file, the entry renders as a clearly
   marked placeholder so the layout can be reviewed before photos
   are added.
   ------------------------------------------------------------------ */

var PHOTOS = [
  { src: null, category: "street",    caption: "Add caption", ref: "01" },
  { src: null, category: "landscape", caption: "Add caption", ref: "02" },
  { src: null, category: "portrait",  caption: "Add caption", ref: "03" },
  { src: null, category: "street",    caption: "Add caption", ref: "04" },
  { src: null, category: "landscape", caption: "Add caption", ref: "05" },
  { src: null, category: "street",    caption: "Add caption", ref: "06" },
  { src: null, category: "portrait",  caption: "Add caption", ref: "07" },
  { src: null, category: "landscape", caption: "Add caption", ref: "08" }
];

(function () {
  "use strict";

  var gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  var filterBar = document.querySelector("[data-filter-bar]");
  var lightbox = document.querySelector("[data-lightbox]");
  var lbImg = lightbox.querySelector("[data-lightbox-img]");
  var lbCaption = lightbox.querySelector("[data-lightbox-caption]");
  var lbCounter = lightbox.querySelector("[data-lightbox-counter]");
  var currentFilter = "all";
  var currentIndex = 0;
  var lastFocused = null;

  function itemMarkup(photo, index) {
    var item = document.createElement("figure");
    item.className = "gallery__item";
    item.setAttribute("data-category", photo.category);
    item.setAttribute("data-index", String(index));
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "Open photograph: " + photo.caption);

    var frame = document.createElement("div");
    frame.className = "gallery__frame";

    if (photo.src) {
      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption;
      img.loading = "lazy";
      frame.appendChild(img);
    } else {
      var ph = document.createElement("div");
      ph.className = "media-placeholder";
      var label = document.createElement("span");
      label.className = "media-placeholder__label";
      label.textContent = "assets/images/photography/…";
      ph.appendChild(label);
      frame.appendChild(ph);
    }

    var caption = document.createElement("figcaption");
    caption.className = "gallery__caption";
    caption.innerHTML =
      '<span>' + photo.caption + '</span><span class="mono">' + photo.ref + '</span>';

    item.appendChild(frame);
    item.appendChild(caption);

    var open = function () { openLightbox(index); };
    item.addEventListener("click", open);
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    return item;
  }

  function render() {
    gallery.innerHTML = "";
    PHOTOS.forEach(function (photo, index) {
      gallery.appendChild(itemMarkup(photo, index));
    });
    applyFilter(currentFilter);
  }

  function applyFilter(category) {
    currentFilter = category;
    gallery.querySelectorAll(".gallery__item").forEach(function (item) {
      var match = category === "all" || item.getAttribute("data-category") === category;
      item.classList.toggle("is-hidden", !match);
    });
  }

  if (filterBar) {
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.setAttribute("aria-pressed", "false");
      });
      btn.setAttribute("aria-pressed", "true");
      applyFilter(btn.getAttribute("data-category"));
    });
  }

  /* ---------- Lightbox ---------- */

  function visibleIndices() {
    return PHOTOS.map(function (_, i) { return i; }).filter(function (i) {
      return currentFilter === "all" || PHOTOS[i].category === currentFilter;
    });
  }

  function showPhoto(index) {
    var photo = PHOTOS[index];
    currentIndex = index;
    lbImg.innerHTML = "";
    if (photo.src) {
      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption;
      lbImg.appendChild(img);
    } else {
      var ph = document.createElement("div");
      ph.className = "media-placeholder";
      ph.style.setProperty("--ph-ratio", "3/2");
      ph.style.width = "60vw";
      ph.style.maxWidth = "700px";
      var label = document.createElement("span");
      label.className = "media-placeholder__label";
      label.textContent = "assets/images/photography/…";
      ph.appendChild(label);
      lbImg.appendChild(ph);
    }
    lbCaption.textContent = photo.caption + "  —  " + photo.ref;

    if (lbCounter) {
      var indices = visibleIndices();
      var pos = indices.indexOf(index);
      lbCounter.textContent = (pos + 1) + " / " + indices.length;
    }
  }

  function openLightbox(index) {
    lastFocused = document.activeElement;
    showPhoto(index);
    lightbox.classList.add("is-open");
    lightbox.removeAttribute("hidden");
    document.body.classList.add("nav-open");
    lightbox.querySelector(".lightbox__close").focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    setTimeout(function () { lightbox.setAttribute("hidden", ""); }, 220);
    if (lastFocused) lastFocused.focus();
  }

  function step(delta) {
    var indices = visibleIndices();
    var pos = indices.indexOf(currentIndex);
    if (pos === -1) pos = 0;
    var next = (pos + delta + indices.length) % indices.length;
    showPhoto(indices[next]);
  }

  lightbox.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
  lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", function () { step(-1); });
  lightbox.querySelector("[data-lightbox-next]").addEventListener("click", function () { step(1); });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  render();
})();
