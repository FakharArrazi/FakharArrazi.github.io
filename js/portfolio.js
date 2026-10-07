/* portfolio.js: sticky chapter index with scroll spy, and gallery expansion. */
(function () {
  "use strict";

  /* Gallery expansion */
  document.querySelectorAll("[data-expand]").forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute("data-expand"));
    if (!target) return;
    var label = btn.getAttribute("data-label-open");
    var closed = btn.textContent;
    btn.addEventListener("click", function () {
      var open = target.hasAttribute("hidden");
      if (open) { target.removeAttribute("hidden"); } else { target.setAttribute("hidden", ""); }
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? label : closed;
      if (open) {
        target.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
      }
    });
  });

  /* Scroll spy */
  var links = Array.prototype.slice.call(document.querySelectorAll(".index-bar a"));
  if (!links.length || !("IntersectionObserver" in window)) return;
  var map = {};
  links.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var sec = document.getElementById(id);
    if (sec) map[id] = { link: a, sec: sec };
  });

  function activate(id) {
    links.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      if (on) { a.setAttribute("aria-current", "true"); } else { a.removeAttribute("aria-current"); }
    });
    var cur = map[id] && map[id].link;
    var bar = document.querySelector(".index-bar__scroll");
    if (cur && bar && bar.scrollWidth > bar.clientWidth) {
      var left = cur.offsetLeft - (bar.clientWidth - cur.offsetWidth) / 2;
      bar.scrollTo({ left: left, behavior: "smooth" });
    }
  }

  var visible = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
    var best = null, bestR = 0;
    Object.keys(visible).forEach(function (id) { if (visible[id] > bestR) { best = id; bestR = visible[id]; } });
    if (best) { activate(best); } else {
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      var bar = document.querySelector(".index-bar__scroll");
      if (bar && bar.scrollLeft) bar.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.01, 0.1, 0.3, 0.6, 1] });
  Object.keys(map).forEach(function (id) { io.observe(map[id].sec); });
})();
