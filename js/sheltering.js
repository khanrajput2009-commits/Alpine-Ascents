/* ============================================================
   ALPINE ASCENTS — SHELTERING PAGE JAVASCRIPT
   Loaded only on html/sheltering.html (after js/main.js)
   ============================================================ */

(function ($) {
  'use strict';

  /* ============================================================
     1. PARALLAX QUOTE — subtle float on scroll
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
     2. INIT ALL ON DOM READY
     ============================================================ */
  $(function () {
    initParallaxQuote();
  });

})(jQuery);