/* lightbox.js: accessible image viewer for <a data-lightbox="group" href="full.webp"
   data-caption="..." data-category="...">. Works as a plain link without JavaScript. */
(function () {
  "use strict";

  var triggers = Array.prototype.slice.call(document.querySelectorAll("a[data-lightbox]"));
  if (!triggers.length) return;

  var ARROW = function (d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="' + d + '"/></svg>';
  };

  var root = document.createElement("div");
  root.className = "lb";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Image viewer");
  root.setAttribute("aria-hidden", "true");
  root.setAttribute("inert", "");
  root.innerHTML =
    '<div class="lb__bar"><span class="lb__count" aria-live="polite"></span>' +
    '<button type="button" class="lb__btn lb__close" aria-label="Close viewer">Close</button></div>' +
    '<div class="lb__stage">' +
    '<button type="button" class="lb__nav lb__nav--prev" aria-label="Previous image">' + ARROW("M15 5l-7 7 7 7") + "</button>" +
    '<img class="lb__img" alt="" decoding="async">' +
    '<button type="button" class="lb__nav lb__nav--next" aria-label="Next image">' + ARROW("M9 5l7 7-7 7") + "</button></div>" +
    '<div class="lb__cap"><p class="lb__cat"></p><p class="lb__text"></p></div>';
  document.body.appendChild(root);

  var img = root.querySelector(".lb__img");
  var count = root.querySelector(".lb__count");
  var cat = root.querySelector(".lb__cat");
  var text = root.querySelector(".lb__text");
  var prev = root.querySelector(".lb__nav--prev");
  var next = root.querySelector(".lb__nav--next");
  var close = root.querySelector(".lb__close");

  var group = [];
  var index = 0;
  var opener = null;
  var token = 0;

  function show(i) {
    index = (i + group.length) % group.length;
    var a = group[index];
    var mine = ++token;
    img.classList.remove("is-ready");
    var src = a.getAttribute("href");
    var loader = new Image();
    loader.onload = loader.onerror = function () {
      if (mine !== token) return;
      img.src = src;
      img.alt = a.getAttribute("data-alt") || a.getAttribute("data-caption") || "";
      requestAnimationFrame(function () { img.classList.add("is-ready"); });
    };
    loader.src = src;
    count.textContent = (index + 1) + " / " + group.length;
    cat.textContent = a.getAttribute("data-category") || "";
    text.textContent = a.getAttribute("data-caption") || "";
    var single = group.length < 2;
    prev.hidden = next.hidden = single;
    [1, -1].forEach(function (d) {
      var n = group[(index + d + group.length) % group.length];
      if (n && n !== a) new Image().src = n.getAttribute("href");
    });
  }

  function open(a) {
    var name = a.getAttribute("data-lightbox");
    group = triggers.filter(function (t) { return t.getAttribute("data-lightbox") === name; });
    opener = a;
    root.removeAttribute("inert");
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    show(group.indexOf(a));
    requestAnimationFrame(function () { root.classList.add("is-open"); close.focus(); });
  }

  function shut() {
    token++;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    root.setAttribute("inert", "");
    document.body.classList.remove("is-locked");
    if (opener) opener.focus({ preventScroll: true });
  }

  triggers.forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      open(a);
    });
  });

  prev.addEventListener("click", function () { show(index - 1); });
  next.addEventListener("click", function () { show(index + 1); });
  close.addEventListener("click", shut);
  root.querySelector(".lb__stage").addEventListener("click", function (e) { if (e.target === this) shut(); });

  document.addEventListener("keydown", function (e) {
    if (!root.classList.contains("is-open")) return;
    if (e.key === "Escape") { shut(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
    else if (e.key === "Tab") {
      var f = Array.prototype.slice.call(root.querySelectorAll("button:not([hidden]):not([disabled])"));
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Swipe */
  var sx = 0, sy = 0, tracking = false;
  root.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) return;
    tracking = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  root.addEventListener("touchend", function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
