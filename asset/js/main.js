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
    if (typeof window.updateChartsLang === 'function') {
      window.updateChartsLang(lang);
    }
  }

  [langButtons.vi[0], langButtons.vi[1]].forEach(b => b && b.addEventListener('click', () => applyLang('vi')));
  [langButtons.en[0], langButtons.en[1]].forEach(b => b && b.addEventListener('click', () => applyLang('en')));

  applyLang('vi');

  /* ---------- charts (Kết quả giảng dạy) ---------- */
  let charts = {};
  if (window.Chart) {
    const rose = getComputedStyle(document.documentElement).getPropertyValue('--rose').trim() || '#D6336C';
    const roseDark = getComputedStyle(document.documentElement).getPropertyValue('--rose-dark').trim() || '#7A1E4B';
    const gold = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#D9A441';
    const plumMuted = getComputedStyle(document.documentElement).getPropertyValue('--plum-muted').trim() || '#8B5A72';

    Chart.defaults.font.family = "'Be Vietnam Pro', sans-serif";
    Chart.defaults.color = plumMuted;

    const chartLabels = {
      toeicCohorts: { vi: ['Khoá 1', 'Khoá 2', 'Khoá 3', 'Khoá 4', 'Khoá 5'], en: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Batch 5'] },
      before: { vi: 'Trước khoá học', en: 'Before' },
      after: { vi: 'Sau khoá học', en: 'After' },
      years: { vi: ['2021', '2022', '2023', '2024', '2025'], en: ['2021', '2022', '2023', '2024', '2025'] },
      studentsLabel: { vi: 'Số học viên', en: 'Students' },
      formatLabels: { vi: ['Kèm 1-1', 'Nhóm nhỏ', 'Luyện thi TOEIC', 'Online'], en: ['1-on-1', 'Small group', 'TOEIC prep', 'Online'] },
      radarLabels: { vi: ['Nghe', 'Nói', 'Đọc', 'Viết'], en: ['Listening', 'Speaking', 'Reading', 'Writing'] },
      radarLabel: { vi: 'Tiến bộ trung bình', en: 'Average improvement' }
    };

    const toeicCtx = document.getElementById('chart-toeic');
    if (toeicCtx) {
      charts.toeic = new Chart(toeicCtx, {
        type: 'bar',
        data: {
          labels: chartLabels.toeicCohorts.vi,
          datasets: [
            { label: chartLabels.before.vi, data: [520, 545, 500, 560, 530], backgroundColor: '#F1A9CC', borderRadius: 6 },
            { label: chartLabels.after.vi, data: [780, 810, 760, 830, 795], backgroundColor: rose, borderRadius: 6 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
          scales: { y: { beginAtZero: true, max: 900, grid: { color: '#FCE7F0' } }, x: { grid: { display: false } } }
        }
      });
    }

    const studentsCtx = document.getElementById('chart-students');
    if (studentsCtx) {
      charts.students = new Chart(studentsCtx, {
        type: 'line',
        data: {
          labels: chartLabels.years.vi,
          datasets: [{
            label: chartLabels.studentsLabel.vi,
            data: [38, 55, 70, 88, 105],
            borderColor: roseDark, backgroundColor: 'rgba(214,51,108,.15)',
            fill: true, tension: 0.4, pointBackgroundColor: rose, pointRadius: 5
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, grid: { color: '#FCE7F0' } }, x: { grid: { display: false } } }
        }
      });
    }

    const formatCtx = document.getElementById('chart-format');
    if (formatCtx) {
      charts.format = new Chart(formatCtx, {
        type: 'doughnut',
        data: {
          labels: chartLabels.formatLabels.vi,
          datasets: [{ data: [35, 25, 30, 10], backgroundColor: [rose, gold, roseDark, '#F1A9CC'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      });
    }

    const radarCtx = document.getElementById('chart-radar');
    if (radarCtx) {
      charts.radar = new Chart(radarCtx, {
        type: 'radar',
        data: {
          labels: chartLabels.radarLabels.vi,
          datasets: [{
            label: chartLabels.radarLabel.vi,
            data: [88, 87, 92, 85],
            backgroundColor: 'rgba(214,51,108,.2)', borderColor: rose, pointBackgroundColor: rose
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { r: { beginAtZero: true, max: 100, grid: { color: '#FCE7F0' }, angleLines: { color: '#FCE7F0' } } }
        }
      });
    }

    // cập nhật nhãn biểu đồ khi đổi ngôn ngữ
    window.updateChartsLang = function (lang) {
      if (charts.toeic) {
        charts.toeic.data.labels = chartLabels.toeicCohorts[lang];
        charts.toeic.data.datasets[0].label = chartLabels.before[lang];
        charts.toeic.data.datasets[1].label = chartLabels.after[lang];
        charts.toeic.update();
      }
      if (charts.students) {
        charts.students.data.datasets[0].label = chartLabels.studentsLabel[lang];
        charts.students.update();
      }
      if (charts.format) {
        charts.format.data.labels = chartLabels.formatLabels[lang];
        charts.format.update();
      }
      if (charts.radar) {
        charts.radar.data.labels = chartLabels.radarLabels[lang];
        charts.radar.data.datasets[0].label = chartLabels.radarLabel[lang];
        charts.radar.update();
      }
    };
  }

  /* ---------- back to top ---------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- falling petals (toàn trang) ---------- */
  (function initPetals(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const layer = document.createElement('div');
    layer.id = 'petal-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    const petalSvg = (fill) => `
      <svg width="22" height="22" viewBox="0 0 32 32">
        <path d="M16 2C22 2 27 9 27 16C27 23 22 30 16 30C10 30 5 23 5 16C5 9 10 2 16 2Z" fill="${fill}"/>
      </svg>`;
    const colors = ['#F1A9CC', '#F8C9DF', '#D6336C', '#F7B8D6'];
    const maxPetals = window.innerWidth < 640 ? 14 : 24;

    function spawnPetal() {
      const petal = document.createElement('div');
      petal.className = 'petal';
      const size = 14 + Math.random() * 14;
      const left = Math.random() * 100;
      const fallDuration = 8 + Math.random() * 7;
      const swayDuration = 2.5 + Math.random() * 2.5;
      const delay = Math.random() * 2;
      const color = colors[Math.floor(Math.random() * colors.length)];

      petal.style.left = left + 'vw';
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.animationDuration = fallDuration + 's, ' + swayDuration + 's';
      petal.style.animationDelay = delay + 's, 0s';
      petal.innerHTML = petalSvg(color);
      layer.appendChild(petal);

      setTimeout(() => petal.remove(), (fallDuration + delay) * 1000 + 200);
    }

    // seed initial petals then keep spawning
    for (let i = 0; i < maxPetals; i++) {
      setTimeout(spawnPetal, i * 400);
    }
    setInterval(spawnPetal, 900);
  })();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- testimonial carousel nav buttons ---------- */
  const testiTrack = document.getElementById('testi-track');
  const testiPrev = document.getElementById('testi-prev');
  const testiNext = document.getElementById('testi-next');
  if (testiTrack && testiPrev && testiNext) {
    const scrollAmount = () => testiTrack.querySelector('.testi-card')?.offsetWidth + 24 || 300;
    testiPrev.addEventListener('click', () => testiTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    testiNext.addEventListener('click', () => testiTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  }