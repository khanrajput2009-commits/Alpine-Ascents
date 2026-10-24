/* ============================================================
   ALPINE ASCENTS — HISTORY PAGE JAVASCRIPT
   Loaded only on html/history.html (after js/main.js)
   ============================================================ */

(function ($) {
  'use strict';

  /* ============================================================
     1. TIMELINE ANIMATION
     ============================================================ */
  function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    // Fallback — if IntersectionObserver not supported
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('active'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });

    items.forEach(function (el) { observer.observe(el); });
  }


  /* ============================================================
     2. PARALLAX QUOTE — subtle float on scroll
     ============================================================ */
  function initParallaxQuote() {
    const quote = document.querySelector('.parallax-quote');
    if (!quote) return;

    const text = quote.querySelector('.quote-text');
    if (!text) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        const rect = quote.getBoundingClientRect();
        const winH = window.innerHeight;

        if (rect.top < winH && rect.bottom > 0) {
          const progress = (winH - rect.top) / (winH + rect.height);
          const translate = (progress - 0.5) * 30;
          text.style.transform = 'translateY(' + translate + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  }


  /* ============================================================
     3. INIT ALL ON DOM READY
     ============================================================ */
  $(function () {
    initTimeline();
    initParallaxQuote();
  });

})(jQuery);