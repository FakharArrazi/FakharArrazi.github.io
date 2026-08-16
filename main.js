/* main.js — shared behavior across every page:
   mobile navigation toggle, an intelligent sticky header (hides on
   scroll-down, reappears on scroll-up), and a lightweight scroll-reveal
   for [data-reveal] elements. */

(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ---------- Intelligent sticky header ----------
     Adds a hairline + shadow once scrolled, and slides the header out
     of view while scrolling down (past its own height) then brings it
     back the moment the person scrolls up — same behavior as a native
     app chrome bar, so it never blocks content but is always reachable. */
  var header = document.querySelector(".site-header");
  if (header) {
    var lastY = window.scrollY;
    var headerH = header.offsetHeight;
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 8);

      if (links && links.classList.contains("is-open")) {
        header.classList.remove("is-hidden");
        lastY = y;
        return;
      }

      if (y > lastY && y > headerH * 1.5) {
        header.classList.add("is-hidden");
      } else if (y < lastY) {
        header.classList.remove("is-hidden");
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ---------- Auto-detecting media placeholders ----------
     Every .media-placeholder that carries a data-src quietly checks
     whether that file actually exists. If it loads, the placeholder
     swaps itself for the real image automatically — no HTML edit
     required. Drop a file at the path named in data-src, refresh, and
     it appears. If the file isn't there (yet), the placeholder just
     stays exactly as it was, so nothing ever shows broken. This is why
     adding an image should never again need a follow-up code change:
     every placeholder on the site now self-updates the same way. */
  document.querySelectorAll(".media-placeholder[data-src]").forEach(function (el) {
    var src = el.getAttribute("data-src");
    var alt = el.getAttribute("data-alt") || "";
    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      img.loading = el.hasAttribute("data-eager") ? "eager" : "lazy";
      el.innerHTML = "";
      el.appendChild(img);
      requestAnimationFrame(function () { el.classList.add("has-image"); });
    };
    probe.onerror = function () { /* leave the placeholder as-is */ };
    probe.src = src;
  });
})();
