/* =========================================================
   FRESHERS' FIESTA 2026 — SCRIPT.JS
   Vanilla JS only. Organized by feature.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     1. LOADING SCREEN
  --------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hide');
      launchConfetti(40); // celebratory burst once the page is ready
    }, 1200);
  });
  // Fallback in case 'load' already fired
  if (document.readyState === 'complete') {
    setTimeout(() => loader.classList.add('hide'), 1200);
  }

  /* ---------------------------------------------------
     2. NAVBAR: scroll background + active link + mobile menu
  --------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('main section[id], .hero[id]');

  function handleNavbarScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  function highlightActiveNav() {
    let currentId = 'home';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }
  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav();

  /* ---------------------------------------------------
     3. SCROLL PROGRESS BAR
  --------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ---------------------------------------------------
     4. BACK TO TOP BUTTON
  --------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------
     5. COUNTDOWN TIMER (26 July 2026)
  --------------------------------------------------- */
  const targetDate = new Date('2026-07-26T16:00:00');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  function pad(num) { return String(num).padStart(2, '0'); }

  function updateFlip(el, newVal) {
    if (el.textContent !== newVal) {
      el.textContent = newVal;
      const card = el.closest('.flip-card');
      card.classList.remove('flip');
      // Force reflow so the animation can restart
      void card.offsetWidth;
      card.classList.add('flip');
    }
  }

  function updateCountdown() {
    const now = new Date();
    let diff = targetDate - now;

    if (diff <= 0) {
      updateFlip(cdDays, '00');
      updateFlip(cdHours, '00');
      updateFlip(cdMins, '00');
      updateFlip(cdSecs, '00');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    updateFlip(cdDays, pad(days));
    updateFlip(cdHours, pad(hours));
    updateFlip(cdMins, pad(mins));
    updateFlip(cdSecs, pad(secs));
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  --------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-up');

  // Stagger index for grid children
  document.querySelectorAll('.highlight-grid .highlight-card').forEach((el, i) => el.style.setProperty('--i', i));
  document.querySelectorAll('.team-grid .team-card').forEach((el, i) => el.style.setProperty('--i', i));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------
     7. ANIMATED COUNT-UP STATS (About section)
  --------------------------------------------------- */
  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  statNums.forEach(el => statObserver.observe(el));

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------
     8. FAQ ACCORDION
  --------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------------------------------------------------
     9b. REGISTRATION MODAL (Google Form links per event)
  --------------------------------------------------- */
  const registerModal = document.getElementById('registerModal');
  const registerClose = document.getElementById('registerClose');
  const registerTriggers = [
    document.getElementById('registerBtn'),
    document.getElementById('registerBtnNav')
  ];

  function openRegisterModal() {
    registerModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeRegisterModal() {
    registerModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  registerTriggers.forEach(btn => {
    if (btn) btn.addEventListener('click', openRegisterModal);
  });
  if (registerClose) registerClose.addEventListener('click', closeRegisterModal);
  if (registerModal) {
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) closeRegisterModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeRegisterModal();
  });

  /* ---------------------------------------------------
     10. BUTTON RIPPLE EFFECT
  --------------------------------------------------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------------------------------------------
     11. CURSOR GLOW (follows mouse, desktop only)
  --------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  } else {
    cursorGlow.style.display = 'none';
  }

  /* ---------------------------------------------------
     12. TWINKLING BACKGROUND STARS
  --------------------------------------------------- */
  const bgStars = document.getElementById('bgStars');
  const starCount = window.innerWidth < 640 ? 45 : 90;
  const starsFragment = document.createDocumentFragment();
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDuration = `${2 + Math.random() * 4}s`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    starsFragment.appendChild(star);
  }
  bgStars.appendChild(starsFragment);

  /* ---------------------------------------------------
     13. FLOATING PARTICLES (canvas)
  --------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const colors = ['rgba(0,229,255,', 'rgba(106,13,173,', 'rgba(255,215,0,'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }

  function createParticles() {
    const count = window.innerWidth < 640 ? 35 : 70;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.2
    }));
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `${p.color}0.8)`;
      ctx.fill();
    });
    requestAnimationFrame(animateParticles);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    resizeCanvas();
    createParticles();
    animateParticles();
    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
  }

  /* ---------------------------------------------------
     14. CONFETTI BURST (on load)
  --------------------------------------------------- */
  function launchConfetti(count) {
    if (prefersReducedMotion) return;
    const container = document.getElementById('confettiContainer');
    const confettiColors = ['#00E5FF', '#6A0DAD', '#FFD700', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = 6 + Math.random() * 6;
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 0.4}px`;
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 5200);
    }
  }

  /* ---------------------------------------------------
     15. PARALLAX ON HERO GLOWS (subtle, desktop only)
  --------------------------------------------------- */
  if (!isTouchDevice && !prefersReducedMotion) {
    const glow1 = document.querySelector('.hero-glow-1');
    const glow2 = document.querySelector('.hero-glow-2');
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      if (glow1) glow1.style.transform = `translate(${x}px, ${y}px)`;
      if (glow2) glow2.style.transform = `translate(${-x}px, ${-y}px)`;
    });
  }

  /* ---------------------------------------------------
     16. SMOOTH SCROLL FOR ANCHOR LINKS (with navbar offset)
  --------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
