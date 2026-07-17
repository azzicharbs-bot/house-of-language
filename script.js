// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  // Soft page entrance and internal-link exit transition
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add('page-loaded'));
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const url = new URL(link.href, window.location.href);
    const isInternal = url.origin === window.location.origin;
    const isSamePageHash = url.pathname === window.location.pathname && url.search === window.location.search && url.hash;
    const shouldSkip = link.target === '_blank' || link.hasAttribute('download') || !isInternal || isSamePageHash || url.protocol === 'mailto:' || url.protocol === 'tel:';

    if (shouldSkip || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    event.preventDefault();
    document.body.classList.add('page-leaving');
    window.setTimeout(() => { window.location.href = url.href; }, 220);
  });

  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-leaving');
    document.body.classList.add('page-loaded');
  });
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  // Contact form — basic client-side handling (see README for form backend setup)
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.querySelector('#form-status');
      status.textContent = "Thanks for reaching out! We'll be in touch shortly.";
      status.style.color = '#1F5C57';
      form.reset();
    });
  }

  // Subtle scroll reveal animation
  const revealTargets = document.querySelectorAll('section .wrap > *, .card, .team-card, .faq-item');
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

});
