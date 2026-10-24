/* ============================================================
   ALPINE ASCENTS — CONTACT PAGE JAVASCRIPT
   Loaded only on html/contact.html (after js/main.js)
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
     2. CONTACT FORM + VALIDATION + LOCALSTORAGE
     ============================================================ */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    /* ---------- Show error ---------- */
    function showError(fieldName, message) {
      const input = form.querySelector('[name="' + fieldName + '"]');
      const errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');
      if (input) input.classList.add('is-invalid');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
      }
    }

    /* ---------- Clear error ---------- */
    function clearError(fieldName) {
      const input = form.querySelector('[name="' + fieldName + '"]');
      const errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');
      if (input) input.classList.remove('is-invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
      }
    }

    /* ---------- Validate single field ---------- */
    function validateField(fieldName) {
      const input = form.querySelector('[name="' + fieldName + '"]');
      if (!input) return true;

      const value = (input.value || '').trim();

      if (!value) {
        showError(fieldName, 'This field is required.');
        return false;
      }

      if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          showError(fieldName, 'Please enter a valid email.');
          return false;
        }
      }

      clearError(fieldName);
      return true;
    }

    /* ---------- Clear error on typing ---------- */
    const fieldsToValidate = ['name', 'email', 'subject', 'message'];

    fieldsToValidate.forEach(function (field) {
      const input = form.querySelector('[name="' + field + '"]');
      if (input) {
        input.addEventListener('input', function () { clearError(field); });
        input.addEventListener('change', function () { clearError(field); });
      }
    });

    /* ---------- Submit handler ---------- */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      fieldsToValidate.forEach(function (field) {
        if (!validateField(field)) isValid = false;
      });

      if (!isValid) {
        const firstError = form.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus({ preventScroll: true });
        }
        return;
      }

      /* Show loading */
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      if (btnText) btnText.classList.add('d-none');
      if (btnLoading) btnLoading.classList.remove('d-none');
      submitBtn.disabled = true;

      /* Simulate API call */
      setTimeout(function () {

        /* ==========================================
           SAVE TO LOCALSTORAGE (before form.reset!)
           ========================================== */
        const contactData = {
          id: 'CT' + Date.now(),
          name: form.querySelector('[name="name"]').value.trim(),
          email: form.querySelector('[name="email"]').value.trim(),
          phone: form.querySelector('[name="phone"]').value.trim(),
          subject: form.querySelector('[name="subject"]').value,
          message: form.querySelector('[name="message"]').value.trim(),
          submittedAt: new Date().toISOString()
        };

        try {
          let contacts = JSON.parse(localStorage.getItem('alpineContacts') || '[]');
          if (!Array.isArray(contacts)) contacts = [];
          contacts.push(contactData);
          localStorage.setItem('alpineContacts', JSON.stringify(contacts));
          console.log('✅ Contact saved to localStorage:', contactData);
        } catch (err) {
          console.warn('⚠️ localStorage not available:', err);
        }

        /* Hide loading */
        if (btnText) btnText.classList.remove('d-none');
        if (btnLoading) btnLoading.classList.add('d-none');
        submitBtn.disabled = false;

        /* Show success message */
        if (successMessage) {
          successMessage.classList.add('show');
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        /* Reset form — LAST step */
        form.reset();

        /* Hide success after 8 seconds */
        setTimeout(function () {
          if (successMessage) successMessage.classList.remove('show');
        }, 8000);

      }, 2000);
    });
  }


  /* ============================================================
     3. INIT ALL ON DOM READY
     ============================================================ */
  $(function () {
    initParallaxQuote();
    initContactForm();
  });

})(jQuery);