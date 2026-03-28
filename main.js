/* andresgarzon.legal — main.js */

// ── Neural Network Canvas ──────────────────────────────────
(function initNeural() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes;
  const NODE_COUNT = 60;
  const MAX_DIST = 160;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Update positions
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,119,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,170,255,0.5)';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();

// ── Cursor Glow ────────────────────────────────────────────
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// ── Navbar scroll state ────────────────────────────────────
(function initNav() {
  const nav = document.getElementById('mainNav');
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  burger.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

// ── Scroll Reveal ──────────────────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

// ── Animate metric bars on visible ────────────────────────
(function initBars() {
  const cards = document.querySelectorAll('.agent-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.metric-fill');
        if (fill) {
          const pct = fill.style.getPropertyValue('--fill') || '.9';
          fill.style.width = (parseFloat(pct) * 100) + '%';
        }
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  cards.forEach(c => obs.observe(c));
})();

// ── Horizontal parallax on hero orb ───────────────────────
(function initParallax() {
  const orb = document.querySelector('.hero-orb');
  if (!orb) return;
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    orb.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
  }, { passive: true });
})();

// ── Counter animation for stats ───────────────────────────
(function initCounters() {
  // Already static text, add typed-number animation optionally
  const section = document.querySelector('.hero-stats');
  if (!section) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  obs.observe(section);
})();

// ── Live typing effect in war room ────────────────────────
(function initWarRoom() {
  const body = document.querySelector('.war-room-body');
  if (!body) return;

  const newLogs = [
    { ts: '00:01:02', type: 'type-exec', label: 'EXEC', msg: 'DOCU-SYNT generando escrito de tutela optimizado...' },
    { ts: '00:01:45', type: 'type-ok', label: 'RESULT', msg: 'Documento listo. 98.4% de precisión jurídica.' },
    { ts: '00:02:10', type: 'type-info', label: 'INFO', msg: 'Riesgo sistémico clasificado como BAJO tras análisis.' },
  ];

  let idx = 0;
  setInterval(() => {
    if (idx >= newLogs.length) {
      // Clear and restart
      const original = body.querySelectorAll('.war-log-line');
      original.forEach(l => { l.style.opacity = '0'; l.style.transform = 'translateX(-10px)'; });
      const added = body.querySelectorAll('.war-log-extra');
      added.forEach(l => l.remove());
      setTimeout(() => {
        original.forEach((l, i) => {
          setTimeout(() => {
            l.style.transition = 'opacity .4s, transform .4s';
            l.style.opacity = '1';
            l.style.transform = 'translateX(0)';
          }, i * 300);
        });
      }, 800);
      idx = 0;
      return;
    }
    const log = newLogs[idx++];
    const div = document.createElement('div');
    div.className = 'war-log-line war-log-extra';
    div.style.opacity = '0';
    div.style.transform = 'translateX(-10px)';
    div.innerHTML = `<span class="ts">${log.ts}</span><span class="type ${log.type}">${log.label}</span><span class="msg">${log.msg}</span>`;
    body.appendChild(div);
    requestAnimationFrame(() => {
      div.style.transition = 'opacity .4s, transform .4s';
      div.style.opacity = '1';
      div.style.transform = 'translateX(0)';
    });
    // Auto-scroll
    body.scrollTop = body.scrollHeight;
  }, 4000);
})();

// ── Form submission handler ────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const nombre = document.getElementById('nombre').value.trim();

  if (!nombre) {
    alert('Por favor ingrese su nombre para activar el protocolo.');
    return;
  }

  // Loading state
  btn.innerHTML = `
    <svg class="spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,.2)" stroke-width="2"/>
      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
    Activando Protocolo...
  `;
  btn.style.opacity = '.8';
  btn.style.pointerEvents = 'none';

  const style = document.createElement('style');
  style.textContent = '.spin { animation: spin-anim 1s linear infinite; } @keyframes spin-anim { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);

  setTimeout(() => {
    btn.innerHTML = `✓ Protocolo Activado — Respuesta en < 60 min`;
    btn.style.background = '#00b844';
    btn.style.boxShadow = '0 0 30px rgba(0,184,68,.4)';
    btn.style.opacity = '1';
  }, 2200);
}

// ── Smooth anchor scroll ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Entrance animation on page load ───────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy) {
    heroCopy.style.opacity = '0';
    heroCopy.style.transform = 'translateY(24px)';
    setTimeout(() => {
      heroCopy.style.transition = 'opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)';
      heroCopy.style.opacity = '1';
      heroCopy.style.transform = 'translateY(0)';
    }, 200);
  }
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'translateY(20px) scale(.97)';
    setTimeout(() => {
      heroVisual.style.transition = 'opacity 1.1s cubic-bezier(.16,1,.3,1), transform 1.1s cubic-bezier(.16,1,.3,1)';
      heroVisual.style.opacity = '1';
      heroVisual.style.transform = 'translateY(0) scale(1)';
    }, 500);
  }
});
