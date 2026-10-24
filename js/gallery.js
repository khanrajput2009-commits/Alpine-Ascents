/* ============================================================
   ALPINE ASCENTS — GALLERY PAGE JAVASCRIPT
   Loaded only on html/gallery.html (after js/main.js)
   ============================================================ */

(function ($) {
  'use strict';

  /* ============================================================
     1. PARALLAX QUOTE
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
     2. GALLERY FILTERS
     ============================================================ */
  function initGalleryFilters() {
    const buttons = document.querySelectorAll('.gallery-filter-btn');
    const items = document.querySelectorAll('.gallery-item');
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active state
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        items.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.classList.remove('hidden');
            // Small fade-in
            item.style.opacity = '0';
            setTimeout(function () {
              item.style.opacity = '1';
            }, 30);
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }


  /* ============================================================
     3. LIGHTBOX
     ============================================================ */
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxContent = document.getElementById('lightboxContent');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (!lightbox) return;

    const cards = Array.from(document.querySelectorAll('.gallery-card'));
    let currentIndex = 0;

    // Build a list of currently visible cards
    function getVisibleCards() {
      return cards.filter(function (card) {
        return !card.closest('.gallery-item').classList.contains('hidden');
      });
    }

    function showItem(card) {
      if (!card) return;

      // Clear previous content
      lightboxContent.innerHTML = '';

      const caption = card.getAttribute('data-caption') || '';
      const videoUrl = card.getAttribute('data-video');
      const imgUrl = card.getAttribute('data-img');

      if (videoUrl) {
        // Video item
        const iframe = document.createElement('iframe');
        iframe.src = videoUrl + '?autoplay=1';
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        iframe.setAttribute('allowfullscreen', '');
        lightboxContent.appendChild(iframe);
      } else if (imgUrl) {
        // Image item
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = caption;
        lightboxContent.appendChild(img);
      }

      const capEl = document.createElement('div');
      capEl.className = 'lightbox-caption';
      capEl.textContent = caption;
      lightboxContent.appendChild(capEl);
    }

    function openLightbox(card) {
      const visible = getVisibleCards();
      currentIndex = visible.indexOf(card);
      if (currentIndex < 0) currentIndex = 0;
      showItem(card);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      // Clear iframe to stop video
      setTimeout(function () {
        lightboxContent.innerHTML = '<img src="" alt="" id="lightboxImg"><div class="lightbox-caption" id="lightboxCaption"></div>';
      }, 300);
    }

    function navigate(direction) {
      const visible = getVisibleCards();
      if (!visible.length) return;
      currentIndex = (currentIndex + direction + visible.length) % visible.length;
      showItem(visible[currentIndex]);
    }

    // Attach click to each card
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        openLightbox(card);
      });
    });

    // Controls
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { navigate(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { navigate(1); });

    // Close on backdrop click
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }


  /* ============================================================
     4. INIT ALL ON DOM READY
     ============================================================ */
  $(function () {
    initParallaxQuote();
    initGalleryFilters();
    initLightbox();
  });

})(jQuery);