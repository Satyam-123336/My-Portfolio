'use strict';

(function initTheme() {
  const DEFAULT_THEME = 'dark';
  const stored = localStorage.getItem('portfolio-theme');
  const theme = stored || DEFAULT_THEME;
  document.documentElement.setAttribute('data-theme', theme);
  updateToggleIcon(theme);
})();

function updateToggleIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.innerHTML = theme === 'dark'
    ? '<img src="https://img.icons8.com/ios-glyphs/30/sun--v1.png" alt="sun" class="theme-sun-icon" />'
    : '<i class="fa-regular fa-moon"></i>';
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateToggleIcon(next);
}

const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const SECTIONS = ['hero', 'about', 'experience', 'projects', 'contact'];

function updateNav() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  let currentSection = SECTIONS[0];
  for (const id of SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
      currentSection = id;
    }
  }

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-scale').forEach(el => fadeObserver.observe(el));

const labelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible-label');
      labelObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.section-label').forEach(el => labelObserver.observe(el));

const mobileMenu = document.getElementById('mobile-menu');
const navToggleBtn = document.getElementById('nav-toggle');
const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
  navToggleBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  navToggleBtn.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  navToggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  navToggleBtn.setAttribute('aria-expanded', 'false');
}

if (navToggleBtn) {
  navToggleBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
}

if (mobileBackdrop) {
  mobileBackdrop.addEventListener('click', closeMobileMenu);
}

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});

function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      animateCounter(el, parseFloat(el.dataset.target));
    });
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = this.querySelector('#form-name').value.trim();
    const email   = this.querySelector('#form-email').value.trim();
    const message = this.querySelector('#form-message').value.trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      showStatus('error', 'Please fill in all fields.');
      return;
    }
    if (!emailRx.test(email)) {
      showStatus('error', 'Please enter a valid email address.');
      return;
    }

    const submitBtn = this.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      contactForm.reset();
      showStatus('success', '✓ Message sent! I\'ll get back to you within 24 hours.');
    }, 1800);
  });
}

function showStatus(type, message) {
  if (!formStatus) return;
  formStatus.className = `form-status ${type}`;
  formStatus.textContent = message;
  setTimeout(() => {
    formStatus.className = 'form-status';
  }, 6000);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar ? navbar.offsetHeight : 64;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

const firstTimelineItem = document.querySelector('.timeline-item');
if (firstTimelineItem) firstTimelineItem.classList.add('active-item');

const yearEl = document.getElementById('copyright-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const timeline = document.querySelector('.timeline');
if (timeline) {
  const lineObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => timeline.classList.add('line-drawn'), 200);
      lineObserver.disconnect();
    }
  }, { threshold: 0.05 });
  lineObserver.observe(timeline);
}

document.querySelectorAll('.skills-grid').forEach(grid => {
  const skillObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      grid.querySelectorAll('.skill-tag').forEach((tag, i) => {
        tag.style.animationDelay = `${i * 60}ms`;
        tag.style.animationPlayState = 'running';
      });
      skillObserver.disconnect();
    }
  }, { threshold: 0.3 });

  grid.querySelectorAll('.skill-tag').forEach(tag => {
    tag.style.animationPlayState = 'paused';
  });

  skillObserver.observe(grid);
});

document.querySelectorAll('.project-card').forEach(card => {
  const MAX_TILT = 8;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    card.style.transition = 'box-shadow 0.15s ease, border-color 0.15s ease';
    card.style.transform =
      `perspective(800px) rotateY(${dx * MAX_TILT}deg) rotateX(${-dy * MAX_TILT}deg) translateZ(8px)`;
    card.style.boxShadow = `
      ${-dx * 8}px ${dy * 8}px 30px rgba(30,40,80,0.15),
      0 8px 24px var(--accent-glow)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
    card.style.boxShadow = '';
  });
});

document.querySelectorAll('.btn-primary').forEach(btn => {
  const STRENGTH = 0.28;

  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * STRENGTH;
    const dy = (e.clientY - cy) * STRENGTH;
    btn.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease';
    btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease';
    btn.style.transform = '';
  });
});

const spotlight = document.getElementById('cursor-spotlight');
if (spotlight) {
  let spotX = window.innerWidth / 2;
  let spotY = window.innerHeight / 2;
  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    spotX = e.clientX;
    spotY = e.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        spotlight.style.left = spotX + 'px';
        spotlight.style.top  = spotY + 'px';
        rafId = null;
      });
    }
  });
}

const contactLinks = document.querySelector('.contact-links');
if (contactLinks) {
  const clObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      contactLinks.querySelectorAll('.contact-link-item').forEach((item, i) => {
        item.style.animation = 'none';
        void item.offsetHeight;
        item.style.animation = '';
        item.style.opacity = '0';
        item.style.transform = 'translateX(-16px)';
        item.style.transition = `opacity 0.45s ease ${i * 80}ms, transform 0.45s cubic-bezier(0.4,0,0.2,1) ${i * 80}ms`;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          });
        });
      });
      clObserver.disconnect();
    }
  }, { threshold: 0.2 });
  clObserver.observe(contactLinks);
}
