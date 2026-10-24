/* ============================================================
   ALPINE ASCENTS — GLOBAL JAVASCRIPT
   Used by ALL pages: navbar, dropdown, footer, stats, reveal
   ============================================================ */

(function ($) {
  'use strict';

  /* ============================================================
     1. NAVBAR SCROLL STATE
     ============================================================ */
  function initNavbarScroll() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ============================================================
     2. DROPDOWN HOVER (desktop only)
     ============================================================ */
  function initDropdownHover() {
    if (window.innerWidth < 992) return;

    const dropdowns = document.querySelectorAll('.navbar .nav-item.dropdown');

    dropdowns.forEach(function (dd) {
      const toggle = dd.querySelector('.dropdown-toggle');
      const menu = dd.querySelector('.dropdown-menu');
      if (!toggle || !menu) return;

      let hideTimer;

      dd.addEventListener('mouseenter', function () {
        clearTimeout(hideTimer);
        toggle.setAttribute('aria-expanded', 'true');
        menu.classList.add('show');
      });

      dd.addEventListener('mouseleave', function () {
        hideTimer = setTimeout(function () {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('show');
        }, 180);
      });
    });
  }


  /* ============================================================
     3. ACTIVE NAV LINK (auto-highlight current page)
     ============================================================ */
  function initActiveNavLink() {
    let path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === '' || path === '/') path = 'index.html';

    document.querySelectorAll('.navbar .nav-link, .navbar .dropdown-item').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      // Compare only the last part (filename) to handle folder prefixes
      const hrefFile = href.split('/').pop();

      if (hrefFile === path) {
        link.classList.add('active');

        // Also highlight parent dropdown toggle
        const parentDropdown = link.closest('.nav-item.dropdown');
        if (parentDropdown) {
          const toggle = parentDropdown.querySelector('.dropdown-toggle');
          if (toggle) toggle.classList.add('active');
        }
      } else {
        link.classList.remove('active');
      }
    });

    // Home page fallback
    if (path === 'index.html') {
      const homeLink = document.querySelector('.nav-link[href="index.html"]');
      if (homeLink) homeLink.classList.add('active');
    }
  }


  /* ============================================================
     4. CLOSE MOBILE MENU ON LINK CLICK
     ============================================================ */
  function initMobileMenuClose() {
    const navCollapse = document.getElementById('navMenu');
    if (!navCollapse) return;

    document.querySelectorAll('#navMenu .nav-link:not(.dropdown-toggle), #navMenu .dropdown-item').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 992) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }


  /* ============================================================
     5. FOOTER YEAR (auto-update)
     ============================================================ */
  function initFooterYear() {
    const footerBottom = document.querySelector('.footer-bottom');
    if (!footerBottom) return;

    const year = new Date().getFullYear();
    footerBottom.innerHTML = footerBottom.innerHTML.replace(
      /&copy;\s*\d{4}/,
      '&copy; ' + year
    );
  }


  /* ============================================================
     6. SMOOTH SCROLL FOR INTERNAL LINKS
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }


  /* ============================================================
     7. REVEAL ON SCROLL (global — sab pages)
     ============================================================ */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

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
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    items.forEach(function (el) { observer.observe(el); });
  }


  /* ============================================================
     8. STATS COUNTER (global — sab pages)
     ============================================================ */
  function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-num');
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 2000;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (c) {
        c.textContent = c.getAttribute('data-count');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { observer.observe(c); });
  }


  /* ============================================================
     9. INIT ALL ON DOM READY
     ============================================================ */
  $(function () {
    initNavbarScroll();
    initDropdownHover();
    initActiveNavLink();
    initMobileMenuClose();
    initFooterYear();
    initSmoothScroll();
    initReveal();
    initStatsCounter();
  });

})(jQuery);