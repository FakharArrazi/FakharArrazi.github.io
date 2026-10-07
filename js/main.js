/* main.js: header state, mobile menu, scroll reveal, footer year. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile menu */
  var btn = document.querySelector(".menu-btn");
  var menu = document.getElementById("menu");
  if (btn && menu) {
    var closeBtn = menu.querySelector(".menu__close");
    var setOpen = function (open) {
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      if (open) { menu.removeAttribute("inert"); } else { menu.setAttribute("inert", ""); }
      btn.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-locked", open);
      if (open && closeBtn) { closeBtn.focus(); } else if (!open) { btn.focus({ preventScroll: true }); }
    };
    btn.addEventListener("click", function () { setOpen(true); });
    if (closeBtn) closeBtn.addEventListener("click", function () { setOpen(false); });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        menu.setAttribute("aria-hidden", "true");
        menu.setAttribute("inert", "");
        btn.setAttribute("aria-expanded", "false");
        document.body.classList.remove("is-locked");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setOpen(false);
    });
    window.matchMedia("(min-width: 860px)").addEventListener("change", function (m) {
      if (m.matches && menu.classList.contains("is-open")) setOpen(false);
    });
  }

  /* Scroll reveal */
  var els = document.querySelectorAll("[data-reveal]");
  if (els.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
