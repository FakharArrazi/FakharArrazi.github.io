/* portfolio.js — drag/swipe carousel for project & photo galleries.
   Works with mouse (pointer events), touch, prev/next buttons,
   dot navigation, and left/right arrow keys when a carousel is focused. */

(function () {
  "use strict";

  /* Slides beyond the first use data-src instead of src, so nothing
     downloads until the gallery is actually near the viewport. This is
     done manually (not via the native loading="lazy" attribute) because
     .media-placeholder hides its <img> with display:none until main.js
     confirms it loaded — and native lazy-loading doesn't reliably fire
     on elements with no layout box. */
  function lazyLoadSlides(root) {
    var imgs = Array.prototype.slice.call(root.querySelectorAll("img[data-src]"));
    if (!imgs.length) return;

    var load = function () {
      imgs.forEach(function (img) {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
      });
    };

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            load();
            io.disconnect();
          }
        });
      }, { rootMargin: "600px 0px" });
      io.observe(root);
    } else {
      load();
    }
  }

  function initCarousel(root) {
    var viewport = root.querySelector("[data-carousel-viewport]");
    var track = root.querySelector("[data-carousel-track]");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var dotsWrap = root.querySelector("[data-carousel-dots]");

    if (!viewport || !track || slides.length === 0) return;

    var index = 0;
    var dragging = false;
    var startX = 0;
    var dragDelta = 0;
    var viewportWidth = 0;
    var dots = [];

    if (slides.length <= 1) {
      root.setAttribute("data-single", "");
    }

    if (dotsWrap && slides.length > 1) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel__dot";
        dot.setAttribute("aria-label", "Go to image " + (i + 1) + " of " + slides.length);
        dot.addEventListener("click", function () { goTo(i); });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function render() {
      track.style.transform = "translateX(" + index * -100 + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === index); });
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === slides.length - 1;
    }

    function goTo(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      render();
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });

    viewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
    });

    if (slides.length > 1) {
      viewport.addEventListener("pointerdown", function (e) {
        if (e.target.closest(".carousel__btn")) return; // let the button handle its own click
        dragging = true;
        startX = e.clientX;
        dragDelta = 0;
        viewportWidth = viewport.getBoundingClientRect().width || 1;
        track.classList.add("is-dragging");
        try { viewport.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      });

      viewport.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        dragDelta = e.clientX - startX;
        track.style.transform = "translateX(calc(" + index * -100 + "% + " + dragDelta + "px))";
      });

      var endDrag = function () {
        if (!dragging) return;
        dragging = false;
        track.classList.remove("is-dragging");
        var threshold = viewportWidth * 0.15;
        if (dragDelta < -threshold && index < slides.length - 1) index += 1;
        else if (dragDelta > threshold && index > 0) index -= 1;
        dragDelta = 0;
        render();
      };

      viewport.addEventListener("pointerup", endDrag);
      viewport.addEventListener("pointercancel", endDrag);
      viewport.addEventListener("pointerleave", function () { if (dragging) endDrag(); });
    }

    render();
    lazyLoadSlides(root);
  }

  document.querySelectorAll(".carousel").forEach(initCarousel);
})();
