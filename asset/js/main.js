  
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- mobile menu ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  /* ---------- sticky header shadow ---------- */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- animated counters ---------- */
  function animateCount(el, target, duration = 1400) {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  const statEls = document.querySelectorAll('[data-count]');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target, parseInt(entry.target.dataset.count, 10));
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statEls.forEach(el => statObserver.observe(el));

  /* ---------- skill progress bars ---------- */
  const skillBlocks = document.querySelectorAll('.skill-block');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const block = entry.target;
        const fill = block.querySelector('.progress-fill');
        const percentLabel = block.querySelector('.skill-percent');
        const target = parseInt(fill.dataset.target, 10);
        fill.style.width = target + '%';
        animateCount({ set textContent(v){ percentLabel.textContent = v + '%'; } }, target, 1400);
        skillObserver.unobserve(block);
      }
    });
  }, { threshold: 0.3 });
  skillBlocks.forEach(el => skillObserver.observe(el));

  /* ---------- language toggle (VI / EN) ---------- */
  let currentLang = 'vi';
  const langButtons = {
    vi: [document.getElementById('lang-vi'), document.getElementById('lang-vi-m')],
    en: [document.getElementById('lang-en'), document.getElementById('lang-en-m')]
  };

  function setActiveLangButton(lang) {
    langButtons.vi.forEach(b => b && b.classList.toggle('bg-[color:var(--rose)]', lang === 'vi') && b.classList.toggle('text-white', lang === 'vi'));
    langButtons.en.forEach(b => b && b.classList.toggle('bg-[color:var(--rose)]', lang === 'en') && b.classList.toggle('text-white', lang === 'en'));
  }

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-vi][data-en]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
    document.querySelectorAll('[data-vi-placeholder][data-en-placeholder]').forEach(el => {
      el.setAttribute('placeholder', lang === 'vi' ? el.dataset.viPlaceholder : el.dataset.enPlaceholder);
    });
    setActiveLangButton(lang);
  }

  [langButtons.vi[0], langButtons.vi[1]].forEach(b => b && b.addEventListener('click', () => applyLang('vi')));
  [langButtons.en[0], langButtons.en[1]].forEach(b => b && b.addEventListener('click', () => applyLang('en')));

  applyLang('vi');
  