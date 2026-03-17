/* ============================================
   MADMEDIA DEVELOPING — script.js
   HORIZONTAL PLANET-TO-PLANET SCROLL ENGINE
   (Fixed version)
============================================ */
(function () {
  'use strict';

  /* ================================================
     CONFIG & BODY HEIGHT SETUP
  ================================================ */
  const PANELS = 5;
  const PANEL_NAMES = ['Home', 'About', 'Services', 'Work', 'Contact'];
  const PANEL_NUMS = ['01', '02', '03', '04', '05'];

  // Dynamically computed so resize stays correct
  function getTotalHeight() { return PANELS * window.innerHeight; }
  function getMaxScroll() { return getTotalHeight() - window.innerHeight; }

  function setBodyHeight() {
    document.body.style.height = getTotalHeight() + 'px';
  }
  setBodyHeight();
  window.addEventListener('resize', () => {
    setBodyHeight();
    // Re-snap scroll position to the same logical panel after resize
    const p = currentPanel / (PANELS - 1);
    window.scrollTo({ top: p * getMaxScroll(), behavior: 'instant' });
  });

  // Set track width
  const track = document.getElementById('hTrack');
  track.style.width = (PANELS * 100) + 'vw';

  /* ================================================
     STARFIELD CANVAS
  ================================================ */
  const canvas = document.getElementById('spaceCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const stars = [];
  function mkStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random(),
      size: Math.random() * 1.6 + 0.3,
      opacity: Math.random() * 0.6 + 0.3,
      vy: Math.random() * 0.25 + 0.05,
    };
  }
  for (let i = 0; i < 300; i++) stars.push(mkStar());

  // Shooting stars
  const shooters = [];
  let shootTimer = 0;
  function spawnShooter() {
    shooters.push({
      x: Math.random() * W, y: Math.random() * H * 0.6,
      vx: 6 + Math.random() * 8, vy: 2 + Math.random() * 3,
      len: 90 + Math.random() * 90, life: 1,
    });
  }

  let scrollVel = 0;

  function drawSpace() {
    ctx.clearRect(0, 0, W, H);
    const panX = scrollVel * 0.35;
    const warp = Math.min(Math.abs(scrollVel) * 0.28, 22);

    stars.forEach(s => {
      s.x += panX * s.z;
      s.y += s.vy * (1 + s.z * 0.5) * (1 + warp * 0.05);
      if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
      if (s.x > W + 2) s.x = -2;
      if (s.x < -2) s.x = W + 2;

      const alpha = s.opacity * (0.4 + s.z * 0.6);
      const r = s.size * (0.5 + s.z * 0.5);

      ctx.save();
      if (warp > 3) {
        const hLen = warp * s.z * 3 * Math.sign(scrollVel || 1);
        const g = ctx.createLinearGradient(s.x - hLen, s.y, s.x + hLen * 0.3, s.y);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.5, `rgba(255,255,255,${(alpha * .9).toFixed(3)})`);
        g.addColorStop(1, 'rgba(180,140,255,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = r * 0.8;
        ctx.beginPath();
        ctx.moveTo(s.x - hLen, s.y);
        ctx.lineTo(s.x + hLen * 0.3, s.y);
        ctx.stroke();
      } else {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsl(${250 + s.z * 80},55%,90%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // Shooting stars
    shootTimer += 16;
    if (shootTimer > 5000 + Math.random() * 4000) { shootTimer = 0; spawnShooter(); }
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.x += s.vx; s.y += s.vy; s.life -= 0.022;
      if (s.life <= 0) { shooters.splice(i, 1); continue; }
      const g = ctx.createLinearGradient(s.x - s.vx * s.len * .1, s.y, s.x, s.y);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, `rgba(200,160,255,${(s.life * .85).toFixed(3)})`);
      ctx.save();
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.4 * s.life;
      ctx.beginPath();
      ctx.moveTo(s.x - s.vx * s.len * .1, s.y);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ================================================
     INTRO LOADER
  ================================================ */
  const loader = document.getElementById('introLoader');
  const fill = document.getElementById('introFill');
  let prog = 0;

  const loadInt = setInterval(() => {
    prog += Math.random() * 3.5 + 0.5;
    if (prog >= 100) {
      prog = 100;
      clearInterval(loadInt);
      setTimeout(() => {
        loader.classList.add('out');
        document.body.classList.remove('loading');
        startCounters();
        startRotating();
      }, 350);
    }
    fill.style.width = prog + '%';
  }, 35);

  /* ================================================
     CUSTOM CURSOR
  ================================================ */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function cursorLoop() {
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(cursorLoop);
  })();
  document.querySelectorAll('a, button, .card, .tech-tags span').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

  /* ================================================
     MOBILE NAV — declared FIRST to avoid hoisting issue
  ================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileNavEl = document.getElementById('mobileNav');
  let menuOpen = false;

  function closeMobileNav() {
    menuOpen = false;
    mobileNavEl.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; });
  }

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileNavEl.classList.toggle('open', menuOpen);
    const [s1, s2] = hamburger.querySelectorAll('span');
    s1.style.transform = menuOpen ? 'rotate(45deg) translate(4px,4px)' : '';
    s2.style.transform = menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : '';
  });

  /* ================================================
     PLANETS & UI ELEMENTS
  ================================================ */
  const planets = document.querySelectorAll('.planet');
  const dots = document.querySelectorAll('.dot');
  const navLinks = document.querySelectorAll('.nav-link');
  const mLinks = document.querySelectorAll('.m-link');
  const scrollBar = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const labelName = document.getElementById('labelName');
  const labelNum = document.querySelector('.label-num');
  const warpFlash = document.getElementById('warpFlash');
  const panels = document.querySelectorAll('.panel');

  /* ================================================
     PLANET CROSSFADE — fixed: correctly handles last panel
  ================================================ */
  function showPlanet(rawPanel) {
    const panelIdx = Math.floor(rawPanel);          // 0..3
    const subProgress = rawPanel - panelIdx;           // 0..1

    planets.forEach((pl, i) => {
      let op = 0;

      if (i === panelIdx && i < PANELS - 1) {
        // Current planet fades OUT as we leave it
        op = Math.max(0, 1 - subProgress * 2.2);
      } else if (i === panelIdx && i === PANELS - 1) {
        // Last panel: always fully visible when reached
        op = 1;
      } else if (i === panelIdx + 1) {
        // Next planet fades IN
        op = Math.min(1, subProgress * 2.2);
      }

      pl.style.opacity = op;

      // SPECTACULAR: Multi-directional transition
      const dist = i - rawPanel;
      // X drift (standard)
      const tx = dist * window.innerWidth * 0.5;
      // Y drift (new - alternate directions for chaos)
      const ty = dist * window.innerHeight * 0.35 * ((i % 2) ? 1 : -1);
      // Rotation & Scale
      const rot = dist * 30;
      const sc = Math.max(0, 1 - Math.abs(dist) * 0.4);

      pl.style.transform =
        `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${sc})`;
    });
  }

  function updateUI(panelIdx) {
    const clamped = Math.min(Math.max(panelIdx, 0), PANELS - 1);
    dots.forEach((d, i) => d.classList.toggle('active', i === clamped));
    navLinks.forEach((l, i) => l.classList.toggle('active', i === clamped));
    if (labelName) labelName.textContent = PANEL_NAMES[clamped] || '';
    if (labelNum) labelNum.textContent = PANEL_NUMS[clamped] || '';
  }

  const GRID_COLORS = [
    'rgba(124,58,237,.15)', 'rgba(6,182,212,.15)',
    'rgba(249,115,22,.15)', 'rgba(16,185,129,.15)',
    'rgba(236,72,153,.15)', // Color for the new 5th panel (Pink/Magenta)
  ];
  function updateGrid(rawPanel) {
    const next = Math.min(Math.ceil(rawPanel), PANELS - 1);
    const grid = document.getElementById('horizonGrid');
    if (!grid) return;
    const c = GRID_COLORS[next];
    grid.style.backgroundImage = [
      `linear-gradient(${c} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${c} 1px, transparent 1px)`,
    ].join(',');
  }

  /* ================================================
     INNER CONTENT PARALLAX
  ================================================ */
  function applyParallax(rawPanel) {
    panels.forEach((p, i) => {
      const inner = p.querySelector('.panel-inner');
      if (!inner) return;
      const dist = i - rawPanel;
      // Multi-directional parallax for content
      inner.style.transform =
        `translate3d(${dist * 60}px, ${dist * -40}px, 0) rotateY(${dist * 12}deg)`;
    });
  }

  /* ================================================
     SCROLL ENGINE
  ================================================ */
  let currentX = 0, targetX = 0;
  let currentPanel = 0;
  let lastScrollY = window.scrollY, lastScrollTs = performance.now();

  function onScroll() {
    const scrollY = window.scrollY;
    const maxScroll = getMaxScroll();
    const safeMax = maxScroll || 1;
    const progress = Math.min(Math.max(scrollY / safeMax, 0), 1);

    // Scroll velocity for warp effect
    const now = performance.now();
    const dt = Math.max(1, now - lastScrollTs);
    scrollVel = (scrollY - lastScrollY) / dt * 16;
    lastScrollY = scrollY; lastScrollTs = now;

    // Target horizontal position
    targetX = -progress * (PANELS - 1) * window.innerWidth;

    // Logical panel position
    const rawPanel = progress * (PANELS - 1);
    currentPanel = Math.round(rawPanel);

    updateUI(currentPanel);

    scrollBar.style.width = (progress * 100) + '%';
    navbar.classList.toggle('scrolled', scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ================================================
     ANIMATION LOOP — smooth lerp + spaceship bank
  ================================================ */
  function animLoop() {
    // Smooth lerp toward target
    currentX += (targetX - currentX) * 0.075;

    // SPECTACULAR FLIGHT PHYSICS
    const vel = targetX - currentX;

    // 1. Pitch (X) - dive/climb effect
    const tiltX = Math.max(-12, Math.min(12, vel * 0.006));
    // 2. Yaw (Y) - existing but amplified
    const tiltY = Math.max(-20, Math.min(20, vel * 0.012));
    // 3. Roll (Z) - banking effect
    const tiltZ = Math.max(-8, Math.min(8, vel * 0.005));
    // 4. Scale/Zoom - pull back effect
    const sc = Math.max(0.9, 1 - Math.abs(vel) * 0.00015);

    // 5. Vertical Arc (Movement in Y axis during transit)
    // Calculate rawPanel based on current smooth position
    const lerpProgress = -currentX / ((PANELS - 1) * window.innerWidth || 1);
    const rawPanel = lerpProgress * (PANELS - 1);
    // Sin wave that is 0 at panels and peaks in between
    const arcY = Math.sin(rawPanel * Math.PI) * (window.innerHeight * 0.2);

    track.style.transform =
      `perspective(1600px) translate3d(${currentX}px, ${arcY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) scale(${sc})`;

    // Synced effects (moved here for smoothness)
    applyParallax(rawPanel);
    showPlanet(rawPanel);
    updateGrid(rawPanel);

    drawSpace();
    requestAnimationFrame(animLoop);
  }
  animLoop();

  /* ================================================
     NAVIGATE TO PANEL
  ================================================ */
  function goToPanel(idx) {
    const clamped = Math.min(Math.max(+idx, 0), PANELS - 1);
    const target = (clamped / (PANELS - 1)) * getMaxScroll();

    // Warp flash
    warpFlash.style.opacity = '0.12';
    setTimeout(() => { warpFlash.style.opacity = '0'; }, 180);

    window.scrollTo({ top: target, behavior: 'smooth' });
  }

  dots.forEach(d => d.addEventListener('click', () => goToPanel(d.dataset.panel)));
  navLinks.forEach(l => l.addEventListener('click', () => goToPanel(l.dataset.panel)));
  mLinks.forEach(l => {
    l.addEventListener('click', () => {
      goToPanel(l.dataset.panel);
      closeMobileNav();
    });
  });
  document.getElementById('navLogoLink').addEventListener('click', () => goToPanel(0));

  /* ================================================
     "WORK WITH US" BUTTON in About panel
  ================================================ */
  const workBtn = document.getElementById('workWithUsBtn');
  if (workBtn) workBtn.addEventListener('click', () => goToPanel(4)); // Updated to point to Contact (last panel)

  /* ================================================
     ROTATING HERO TEXT
  ================================================ */
  const rotItems = document.querySelectorAll('.rot-item');
  let rotIdx = 0;

  function startRotating() {
    if (!rotItems.length) return;
    setInterval(() => {
      rotItems[rotIdx].classList.remove('active');
      rotItems[rotIdx].classList.add('exit');
      const prev = rotIdx;
      setTimeout(() => rotItems[prev].classList.remove('exit'), 700);
      rotIdx = (rotIdx + 1) % rotItems.length;
      rotItems[rotIdx].classList.add('active');
    }, 2800);
  }

  /* ================================================
     ANIMATED COUNTERS
  ================================================ */
  function startCounters() {
    document.querySelectorAll('.snum').forEach(el => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const dur = 2200, t0 = performance.now();
      (function tick(ts) {
        const t = Math.min((ts - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(ease * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      })(performance.now());
    });
  }

  /* ================================================
     3D CARD TILT
  ================================================ */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rx2 = ((y - cy) / cy) * -9;
      const ry2 = ((x - cx) / cx) * 9;
      card.style.transform =
        `perspective(900px) rotateX(${rx2}deg) rotateY(${ry2}deg) translateY(-5px) scale(1.02)`;
      card.style.setProperty('--mx', (x / rect.width * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (y / rect.height * 100).toFixed(1) + '%');
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ================================================
     EMAIL COPY — with file:// fallback
  ================================================ */
  const emailBtn = document.getElementById('emailCopyBtn');
  const emailText = document.getElementById('emailBtnText');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      const EMAIL = 'hello@madmedia.dev';
      const reset = () => {
        setTimeout(() => {
          emailText.textContent = EMAIL;
          emailBtn.style.borderColor = '';
        }, 2400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL)
          .then(() => {
            emailText.textContent = 'Copied! ✓';
            emailBtn.style.borderColor = 'var(--accent)';
            reset();
          })
          .catch(() => {
            // Fallback for file:// protocol
            emailText.textContent = EMAIL + ' (copy above)';
            reset();
          });
      } else {
        // Very old browsers — select text trick
        const ta = document.createElement('textarea');
        ta.value = EMAIL;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); emailText.textContent = 'Copied! ✓'; }
        catch { emailText.textContent = EMAIL; }
        document.body.removeChild(ta);
        emailBtn.style.borderColor = 'var(--accent)';
        reset();
      }
    });
  }

  /* ================================================
     INITIAL RENDER (run AFTER all functions defined)
  ================================================ */
  onScroll();       // sets scrollVel, targetX, planets, UI
  updateUI(0);      // makes sure panel 0 is active

})();
