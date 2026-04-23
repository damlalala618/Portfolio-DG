/* ============================================================
   DAMLA GEDIKLI – PORTFOLIO
   script.js

   MODULES
   ─────────────────────────────────────────────────────────────
   1. initNavScroll   – sticky navbar background on scroll
   2. initMobileNav   – hamburger menu toggle
   3. initSmoothScroll – anchor link smooth scrolling
   4. initScrollReveal – Intersection Observer reveal animations
   5. initProjectCards – card click / keyboard navigation
   6. initSlider      – hero image slider with dots + swipe
   7. initActiveNav   – highlight active nav link on scroll
   ============================================================ */

/* ── 1. NAVBAR BACKGROUND ON SCROLL ───────────────────────── */
function initNavScroll() {
  // Nav background is always visible — no scroll toggle needed
}

/* ── 2. MOBILE HAMBURGER MENU ──────────────────────────────── */
function initMobileNav() {
  const hamburger  = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (!hamburger || !mobileMenu) return;

  const open  = () => {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () =>
    hamburger.classList.contains('is-open') ? close() : open()
  );

  // Close when a mobile link is tapped
  mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

/* ── 3. SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id     = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      // Read nav height from CSS variable for accuracy
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10
      ) || 72;

      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── 4. SCROLL REVEAL (IntersectionObserver) ───────────────── */
function initScrollReveal() {
  const selectors = '.reveal, .reveal-left, .reveal-right, .stagger';
  const elements  = document.querySelectorAll(selectors);
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold:  0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ── 5. PROJECT CARD CLICK + KEYBOARD ─────────────────────── */
function initProjectCards() {
  document.querySelectorAll('.project-card[data-href]').forEach(card => {
    const href = card.dataset.href;

    card.addEventListener('click', () => {
      window.location.href = href;
    });

    // Make card keyboard-navigable
    card.setAttribute('role',     'link');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = href;
      }
    });
  });
}

/* ── 6. IMAGE SLIDER ───────────────────────────────────────── */
function initSlider() {
  const slider = document.querySelector('.project-slider');
  if (!slider) return;

  const track = slider.querySelector('.project-slider__track');
  const slides = slider.querySelectorAll('.project-slider__slide');
  const dotsWrap = slider.querySelector('.project-slider__dots');
  if (!track || slides.length === 0) return;

  let current   = 0;
  const total   = slides.length;

  // Build navigation dots
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className  = 'project-slider__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Bild ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(index) {
    current = ((index % total) + total) % total; // wrap-around
    track.style.transform = `translateX(-${current * 100}%)`;

    if (dotsWrap) {
      dotsWrap.querySelectorAll('.project-slider__dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === current);
      });
    }
  }

  // Auto-advance every 4 s
  let autoplay = setInterval(() => goTo(current + 1), 4000);

  slider.addEventListener('mouseenter', () => clearInterval(autoplay));
  slider.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 4000);
  });

  // Touch / swipe support
  let startX = 0;
  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  slider.addEventListener('touchend', e => {
    const delta = startX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goTo(current + (delta > 0 ? 1 : -1));
  });
}

/* ── 7. ACTIVE NAV LINK ON SCROLL ─────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'is-active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}

/* ── INIT ALL ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initProjectCards();
  initSlider();
  initActiveNav();
  initCustomCursor();
});

/* ── 8. CUSTOM CURSOR + SHOOTING STAR TRAIL ────────────────── */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  // Canvas overlay for the continuous trail
  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-trail-canvas';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const CURSOR_H  = 44;   // px size of cursor icon
  const MAX_AGE   = 150;  // ms before a point fully fades
  const points    = [];   // { x, y, time }

  document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    cursor.style.left = x + 'px';
    cursor.style.top  = y + 'px';

    // Anchor trail to the centre of the cursor icon
    points.push({ x: x + CURSOR_H * 0.5, y: y + CURSOR_H * 0.5, time: Date.now() });
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

  // Click state — swap cursor image via class (CSS handles path, works on all pages)
  document.addEventListener('mousedown', () => { cursor.classList.add('is-clicked'); });
  document.addEventListener('mouseup',   () => { cursor.classList.remove('is-clicked'); });

  (function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();
    // Expire old points
    while (points.length && now - points[0].time > MAX_AGE) points.shift();
    if (points.length < 2) return;

    // Draw each segment with opacity + width based on age
    for (let i = 1; i < points.length; i++) {
      const age   = now - points[i].time;
      const alpha = Math.max(0, 1 - age / MAX_AGE);
      const width = Math.max(1, 12 * alpha);

      ctx.beginPath();
      ctx.moveTo(points[i - 1].x, points[i - 1].y);
      ctx.lineTo(points[i].x,     points[i].y);
      ctx.strokeStyle = `rgba(45, 66, 160, ${alpha * 0.85})`;
      ctx.lineWidth   = width;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();
    }
  })();
}
