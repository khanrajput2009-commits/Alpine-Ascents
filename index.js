/* ============================================================
   ALPINE ASCENTS — INDEX (HOME) PAGE JAVASCRIPT
   Loaded only on index.html (after js/main.js)
   ============================================================ */

(function ($) {
  'use strict';

  /* ============================================================
     1. PRELOADER / CINEMATIC VIDEO INTRO
     ============================================================ */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const video = document.getElementById('introVideo');
    const skipBtn = document.getElementById('skipBtn');
    const progressBar = document.getElementById('videoProgress');
    const mainContent = document.getElementById('mainContent');

    let finished = false;

    function finishIntro() {
      if (finished) return;
      finished = true;

      preloader.classList.add('hide');
      document.body.style.overflow = '';
      if (mainContent) mainContent.classList.add('show');

      if (video) {
        try {
          video.pause();
          video.removeAttribute('src');
          video.load();
        } catch (e) { /* silent */ }
      }

      setTimeout(function () {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 1200);
    }

    // Lock scroll during intro
    document.body.style.overflow = 'hidden';

    if (video) {
      video.addEventListener('timeupdate', function () {
        if (!video.duration) return;
        const percent = (video.currentTime / video.duration) * 100;
        if (progressBar) progressBar.style.width = percent + '%';
      });

      video.addEventListener('ended', finishIntro);
      video.addEventListener('error', function () {
        setTimeout(finishIntro, 1500);
      });

      // Fallback — max 9 seconds
      setTimeout(function () {
        if (!finished) finishIntro();
      }, 9000);

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(function () {
          setTimeout(finishIntro, 1200);
        });
      }
    } else {
      setTimeout(finishIntro, 1000);
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', function (e) {
        e.preventDefault();
        finishIntro();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !finished) finishIntro();
    });
  }


  /* ============================================================
     2. HERO VIDEO — autoplay resilience
     ============================================================ */
  function initHeroVideo() {
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo) return;

    heroVideo.muted = true;
    heroVideo.setAttribute('muted', '');

    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        const retry = function () {
          heroVideo.play().catch(function () {});
          document.removeEventListener('click', retry);
          document.removeEventListener('touchstart', retry);
        };
        document.addEventListener('click', retry, { once: true });
        document.addEventListener('touchstart', retry, { once: true });
      });
    }
  }


  /* ============================================================
     3. PARALLAX QUOTE — subtle float on scroll
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
     4. MAP IFRAME LAZY LOAD
     ============================================================ */
  function initMapLazyLoad() {
    const iframe = document.querySelector('.map-wrapper iframe');
    if (!iframe) return;

    if (!('IntersectionObserver' in window)) return;

    const src = iframe.getAttribute('src');
    if (!src) return;

    iframe.setAttribute('data-src', src);
    iframe.removeAttribute('src');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          iframe.setAttribute('src', iframe.getAttribute('data-src'));
          observer.unobserve(iframe);
        }
      });
    }, { rootMargin: '200px' });

    observer.observe(iframe);
  }


  /* ============================================================
     5. EXPEDITION CARD — full card clickable (fallback)
     ============================================================ */
  function initExpeditionCards() {
    document.querySelectorAll('.expedition-card').forEach(function (card) {
      card.addEventListener('click', function () {
        const parentLink = card.closest('a');
        if (parentLink) return;

        const href = card.getAttribute('data-href');
        if (href) window.location.href = href;
      });
    });
  }


  /* ============================================================
     6. INIT ALL ON DOM READY
     ============================================================ */
  $(function () {
    initPreloader();
    initHeroVideo();
    initParallaxQuote();
    initMapLazyLoad();
    initExpeditionCards();
  });

})(jQuery);