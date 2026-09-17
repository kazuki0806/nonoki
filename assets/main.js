/* Shared by the three plans: same motion rules, only the markup differs.
   - first view: fade in + small upward move (.js-intro), hero heading opens left to right (.js-wipe)
   - scroll: each [data-reveal-group] shows its .js-wipe / .js-reveal children one after another
   - prefers-reduced-motion: nothing is hidden or moved, final state is shown */
(function () {
  window.initSite = function () {
    if (window.__siteInited) { return; }
    var root = document.querySelector('[data-site]');
    if (!root || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { return; }
    window.__siteInited = true;
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    var css = getComputedStyle(document.documentElement);
    var dist = parseFloat(css.getPropertyValue('--reveal-distance')) || 30;
    // headings open left to right; vertical headings (data-dir="down") open top to bottom
    var isDown = function (el) { return el.getAttribute('data-dir') === 'down'; };
    var OPEN = function (i, el) { return isDown(el) ? 'inset(0% -10% 0% -10%)' : 'inset(-10% 0% -10% 0%)'; };
    var SHUT = function (i, el) { return isDown(el) ? 'inset(0% -10% 100% -10%)' : 'inset(-10% 100% -10% 0%)'; };

    var mm = gsap.matchMedia();
    mm.add({ reduce: '(prefers-reduced-motion: reduce)', ok: '(prefers-reduced-motion: no-preference)' }, function (ctx) {
      var reduce = !!(ctx.conditions && ctx.conditions.reduce);

      // state switches (no tween): header after the hero, darker mask over the pinned photo
      var hero = root.querySelector('[data-hero]');
      if (hero) {
        ScrollTrigger.create({
          trigger: hero, start: 'top top-=120',
          onEnter: function () { root.classList.add('is-past-hero'); },
          onLeaveBack: function () { root.classList.remove('is-past-hero'); }
        });
      }
      gsap.utils.toArray('[data-deepen]').forEach(function (el) {
        ScrollTrigger.create({
          trigger: el, start: 'top 70%',
          onEnter: function () { root.classList.add('is-deep'); },
          onLeaveBack: function () { root.classList.remove('is-deep'); }
        });
      });

      // fixed buttons: white menu button over dark surfaces, no floating reserve button where a section has its own
      [['[data-dark]', 'is-on-dark'], ['[data-cta-off]', 'is-cta-off']].forEach(function (pair) {
        gsap.utils.toArray(pair[0]).forEach(function (el) {
          ScrollTrigger.create({
            trigger: el, start: 'top 70px', end: 'bottom 70px',
            onToggle: function (self) { root.classList.toggle(pair[1], self.isActive); }
          });
        });
      });

      if (reduce) {
        gsap.set('.js-intro, .js-reveal, .js-wipe', { clearProps: 'all' });
        return;
      }

      gsap.set('.js-intro, .js-reveal', { opacity: 0, y: dist });
      gsap.set('.js-wipe', { clipPath: SHUT });

      if (hero) {
        var tl = gsap.timeline({ delay: 0.2 });
        var heroWipes = hero.querySelectorAll('.js-wipe');
        var heroItems = hero.querySelectorAll('.js-intro');
        if (heroWipes.length) { tl.to(heroWipes, { clipPath: OPEN, duration: 0.9, ease: 'power3.inOut', stagger: 0.12 }, 0); }
        if (heroItems.length) { tl.to(heroItems, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, heroWipes.length ? 0.35 : 0); }
      }

      gsap.utils.toArray('[data-reveal-group]').forEach(function (group) {
        var wipes = group.querySelectorAll('.js-wipe');
        var items = group.querySelectorAll('.js-reveal:not([data-reveal-self])');
        if (!wipes.length && !items.length) { return; }
        var gtl = gsap.timeline({ scrollTrigger: { trigger: group, start: 'top 80%', toggleActions: 'play none none none' } });
        if (wipes.length) { gtl.to(wipes, { clipPath: OPEN, duration: 0.9, ease: 'power3.inOut', stagger: 0.1 }, 0); }
        if (items.length) { gtl.to(items, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, wipes.length ? 0.2 : 0); }
      });
      // tall groups: items marked data-reveal-self wait until they reach the viewport themselves
      gsap.utils.toArray('.js-reveal[data-reveal-self]').forEach(function (el) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } });
      });
    });

    // menu (works for both header types). Key handling stays on the header / menu, not on document.
    var btn = root.querySelector('[data-menu-btn]');
    var menu = root.querySelector('[data-menu]');
    if (btn && menu) {
      var isOpen = function () { return root.classList.contains('is-menu-open'); };
      var setMenu = function (open, keepFocus) {
        root.classList.toggle('is-menu-open', open);
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
        menu.setAttribute('aria-hidden', String(!open));
        document.documentElement.style.overflow = open ? 'hidden' : '';
        if (open) { var first = menu.querySelector('a'); if (first) { window.setTimeout(function () { first.focus(); }, 60); } }
        else if (!keepFocus) { btn.focus(); }
      };
      btn.addEventListener('click', function () { setMenu(!isOpen()); });
      menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false, true); }); });
      var onKey = function (e) {
        if (!isOpen()) { return; }
        if (e.key === 'Escape') { e.preventDefault(); setMenu(false); return; }
        if (e.key === 'Tab') {
          var f = Array.prototype.slice.call(menu.querySelectorAll('a, button'));
          f.push(btn);
          var i = f.indexOf(document.activeElement);
          if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        }
      };
      menu.addEventListener('keydown', onKey);
      btn.addEventListener('keydown', onKey);
      window.matchMedia('(min-width: 1024px)').addEventListener('change', function () { if (isOpen()) { setMenu(false, true); } });
    }

    // before / after: the range input covers the photo, its value moves the boundary
    root.querySelectorAll('[data-ba]').forEach(function (ba) {
      var range = ba.querySelector('.ba__range');
      if (!range) { return; }
      var sync = function () { ba.style.setProperty('--pos', range.value + '%'); };
      range.addEventListener('input', sync);
      range.addEventListener('change', sync);
      sync();
    });

    // works filter: buttons with aria-pressed, items with data-type
    var filterBtns = Array.prototype.slice.call(root.querySelectorAll('[data-filter]'));
    if (filterBtns.length) {
      var cases = Array.prototype.slice.call(root.querySelectorAll('[data-type]'));
      var status = root.querySelector('[data-filter-status]');
      var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
      filterBtns.forEach(function (b) {
        b.addEventListener('click', function () {
          var key = b.getAttribute('data-filter');
          filterBtns.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
          var shown = [];
          cases.forEach(function (c) {
            var on = key === 'all' || c.getAttribute('data-type') === key;
            c.hidden = !on;
            if (on) { shown.push(c); }
          });
          if (status) { status.textContent = (key === 'all' ? '' : b.firstChild.textContent + 'の事例、') + shown.length + '件を表示しています'; }
          if (!calm.matches) {
            // items that were never revealed by scrolling are shown now, then the visible set fades in together
            shown.forEach(function (c) { gsap.set(c.querySelectorAll('.js-reveal'), { opacity: 1, y: 0 }); });
            gsap.fromTo(shown, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, clearProps: 'opacity,transform' });
          }
          ScrollTrigger.refresh();
        });
      });
    }

    window.__revealReady = true;

    // smooth scrolling is switched on only after load; a #hash in the URL is honoured once
    var settle = function () {
      ScrollTrigger.refresh();
      if (location.hash.length > 1) {
        var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) { window.scrollTo(0, target.getBoundingClientRect().top + window.pageYOffset); }
      }
      document.documentElement.classList.add('is-smooth');
    };
    if (document.readyState === 'complete') { window.setTimeout(settle, 0); }
    else { window.addEventListener('load', settle, { once: true }); }
    // a refresh resets the scroll position for a moment, so only do it while the page is still at the top
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { if (window.pageYOffset < 4) { ScrollTrigger.refresh(); } }); }
  };

  var timer = window.setInterval(function () {
    if (window.__siteInited) { window.clearInterval(timer); return; }
    window.initSite();
  }, 100);
  window.setTimeout(function () { window.clearInterval(timer); }, 20000);
})();
