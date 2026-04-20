/* DREK IT — Main JavaScript */
document.addEventListener('DOMContentLoaded', () => {

  /* ===== Futuristic Loading Screen ===== */
  const loader = document.getElementById('loader');
  if (loader) {
    const percentEl = loader.querySelector('.loader__percent');
    let count = 0;
    const counterInterval = setInterval(() => {
      count += Math.floor(Math.random() * 8) + 2;
      if (count > 100) count = 100;
      if (percentEl) percentEl.textContent = count + '%';
      if (count >= 100) clearInterval(counterInterval);
    }, 60);
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 800);
    }, 2200);
  }

  /* ===== Dark Mode Toggle (Default: Dark) ===== */
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('drek-theme');
  document.documentElement.setAttribute('data-theme', savedTheme || 'dark');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('drek-theme', next);
    });
  }

  /* ===== Smooth Scroll ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ===== Navbar scroll effect ===== */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ===== Active nav link ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a');
  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) current = s.id;
      });
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
      });
    });
  }

  /* ===== Scroll reveal ===== */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));

  /* ===== Counter animation ===== */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll('[data-target]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  /* ===== Menu overlay ===== */
  const menuBtn = document.querySelector('.menu-btn');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuClose = document.querySelector('.menu-overlay__close');
  if (menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => { menuOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; });
    menuClose.addEventListener('click', () => { menuOverlay.classList.remove('active'); document.body.style.overflow = ''; });
    menuOverlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { menuOverlay.classList.remove('active'); document.body.style.overflow = ''; });
    });
  }

  /* ===== Card carousel scroll ===== */
  function setupCarousel(containerSel, prevSel, nextSel) {
    const container = document.querySelector(containerSel);
    const prev = document.querySelector(prevSel);
    const next = document.querySelector(nextSel);
    if (!container) return;
    const scrollAmt = 320;
    if (prev) prev.addEventListener('click', () => container.scrollBy({ left: -scrollAmt, behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => container.scrollBy({ left: scrollAmt, behavior: 'smooth' }));
  }
  setupCarousel('.about__cards', '.about-prev', '.about-next');
  setupCarousel('.portfolio__cards', '.portfolio-prev', '.portfolio-next');

  /* ===== Services accordion ===== */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-item__header');
    if (header) {
      header.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    }
  });

  /* ===== Scroll down button ===== */
  const scrollBtn = document.querySelector('.hero__scroll-btn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      const stats = document.getElementById('stats');
      if (stats) stats.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ===== Parallax on hero placeholder ===== */
  const placeholder = document.querySelector('.hero__3d-placeholder');
  if (placeholder && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      placeholder.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
    });
  }

  /* ===== Portfolio filter ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('hidden');
            card.style.display = '';
          } else {
            card.classList.add('hidden');
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ===== Magnetic hover on buttons ===== */
  document.querySelectorAll('.btn-primary, .about__nav button, .portfolio__nav button').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ===== Current year in footer ===== */
  const footerYear = document.querySelector('.footer__bottom p');
  if (footerYear) footerYear.innerHTML = footerYear.innerHTML.replace('2025', new Date().getFullYear());

  /* ===== Soft Neon Blue Cursor Glow ===== */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.innerWidth > 768) {
    let cx = -100, cy = -100, tx = -100, ty = -100;
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    document.addEventListener('mouseleave', () => cursorGlow.classList.add('hidden'));
    document.addEventListener('mouseenter', () => cursorGlow.classList.remove('hidden'));
    (function animate() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursorGlow.style.transform = `translate3d(${cx - 14}px, ${cy - 14}px, 0)`;
      requestAnimationFrame(animate);
    })();
  }
});
