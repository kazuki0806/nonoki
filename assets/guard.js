/* Runs in <head> before the first paint.
   1. Loads the web fonts without holding back the first paint (text shows in the system font, then swaps).
   2. Marks the page so the motion layer may pre-hide elements it will reveal; if the motion layer never
      reports in (script blocked, network error), everything is shown after 2.5s. */
(function () {
  var root = document.documentElement;
  var here = document.currentScript;
  var href = here && here.getAttribute('data-fonts');
  if (href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('js-motion');
  }
  window.setTimeout(function () { if (!window.__revealReady) { root.classList.remove('js-motion'); } }, 2500);
})();
