/* =========================================================================
   Trusted Care Carpet & Upholstery Cleaning — interactions
   Vanilla JS, no dependencies, no external requests.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. Mobile navigation
     --------------------------------------------------------------- */
  var nav = document.getElementById('primaryNav');
  var navToggle = document.getElementById('navToggle');
  var navScrim = document.getElementById('navScrim');

  function openNav() {
    if (!nav) return;
    nav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation menu');
    if (navScrim) navScrim.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    if (navScrim) navScrim.hidden = true;
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (navScrim) navScrim.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      closeNav();
      navToggle.focus();
    }
  });

  // Close the drawer after tapping any in-page link
  Array.prototype.forEach.call(document.querySelectorAll('#primaryNav a'), function (link) {
    link.addEventListener('click', closeNav);
  });

  // Reset drawer state when resizing back to desktop
  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (window.innerWidth > 860) closeNav();
    }, 150);
  });

  /* ---------------------------------------------------------------
     2. Sticky header shadow + back-to-top visibility
     --------------------------------------------------------------- */
  var header = document.getElementById('siteHeader');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (toTop) toTop.hidden = y < 600;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------
     3. Scroll reveal animations
     --------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || prefersReduced) {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [];
        var index = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(index, 5) * 80 + 'ms';
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    Array.prototype.forEach.call(revealEls, function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------------
     4. Scroll spy — highlight the active nav link
     --------------------------------------------------------------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav__link');

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        Array.prototype.forEach.call(navLinks, function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    Array.prototype.forEach.call(sections, function (section) { spy.observe(section); });
  }

  /* ---------------------------------------------------------------
     5. Phone number input formatting
     --------------------------------------------------------------- */
  var phoneInput = document.getElementById('phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      var formatted = digits;

      if (digits.length > 6) {
        formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
      } else if (digits.length > 3) {
        formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
      } else if (digits.length > 0) {
        formatted = '(' + digits;
      }

      phoneInput.value = formatted;
    });
  }

  /* ---------------------------------------------------------------
     6. Quote form validation (client-side only — no external calls)
     --------------------------------------------------------------- */
  var form = document.getElementById('quoteForm');
  var success = document.getElementById('formSuccess');

  var VALIDATORS = {
    name: function (value) {
      if (!value) return 'Please tell us your name.';
      if (value.length < 2) return 'Please enter your full name.';
      return '';
    },
    phone: function (value) {
      if (!value) return 'A phone number lets us confirm your appointment.';
      if (value.replace(/\D/g, '').length !== 10) return 'Please enter a 10-digit phone number.';
      return '';
    },
    email: function (value) {
      if (!value) return 'Please enter an email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'That email address looks incomplete.';
      return '';
    },
    service: function (value) {
      if (!value) return 'Please choose the service you need.';
      return '';
    }
  };

  function fieldWrapper(input) {
    return input.closest ? input.closest('.field') : null;
  }

  function setError(input, message) {
    var wrapper = fieldWrapper(input);
    var errorEl = document.getElementById(input.id + '-error');

    if (message) {
      if (wrapper) wrapper.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = message;
      input.setAttribute('aria-invalid', 'true');
      if (errorEl) input.setAttribute('aria-describedby', errorEl.id);
      return false;
    }

    if (wrapper) wrapper.classList.remove('is-invalid');
    if (errorEl) errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    return true;
  }

  function validateField(input) {
    var validator = VALIDATORS[input.id];
    if (!validator) return true;
    return setError(input, validator(input.value.trim()));
  }

  if (form) {
    Object.keys(VALIDATORS).forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;

      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        var wrapper = fieldWrapper(input);
        if (wrapper && wrapper.classList.contains('is-invalid')) validateField(input);
      });
      input.addEventListener('change', function () {
        var wrapper = fieldWrapper(input);
        if (wrapper && wrapper.classList.contains('is-invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;

      Object.keys(VALIDATORS).forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        if (success) success.hidden = true;
        firstInvalid.focus();
        return;
      }

      if (success) {
        success.hidden = false;
        success.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'center'
        });
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Request Sent ✓';
        submitBtn.disabled = true;
        window.setTimeout(function () {
          submitBtn.textContent = 'Send My Quote Request';
          submitBtn.disabled = false;
        }, 6000);
      }

      form.reset();
    });
  }

  /* ---------------------------------------------------------------
     7. Footer year
     --------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
