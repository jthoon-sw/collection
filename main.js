/* ════════════════════════════════════════
   NHIS AI 혁신 랜딩페이지 — 메인 스크립트
════════════════════════════════════════ */


/* ──────────────────────────
   1. SPLASH SCREEN
────────────────────────── */

let splashReady = false;
let canvasAnim = null;

/* ── AI 네트워크 라인 애니메이션 ── */
function initAICanvas() {
  const canvas = document.getElementById('aiCanvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  // 노드(점) 생성
  const nodes = [];
  const NODE_COUNT = 35;
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    });
  }

  const MAX_DIST = 120;

  function draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    // 노드 이동
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    // 연결선
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // 점
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.fill();
    });

    canvasAnim = requestAnimationFrame(draw);
  }

  draw();
  setTimeout(() => canvas.classList.add('on'), 200);
}

function stopAICanvas() {
  if (canvasAnim) { cancelAnimationFrame(canvasAnim); canvasAnim = null; }
}

function initSplash() {
  // 타이밍 설정 (ms) — 원하는 속도로 조절하세요
  const TIMINGS = {
    amb:   200,    // 배경 글로우 등장
    logo:  700,    // 로고 마크 등장
    line1: 1600,   // "현장에서"
    line2: 2500,   // "시작한"
    line3: 3400,   // "AI 혁신이"
    line4: 4300,   // "공단을 바꿉니다"
    bar:   5300,   // 프로그레스바 + 힌트
    ready: 5500,   // 탭 가능 시점
    auto:  9000,   // 자동 전환 시점 (ms)
  };

  const on = (id, delay) =>
    setTimeout(() => document.getElementById(id)?.classList.add('on'), delay);

  initAICanvas();
  on('spAmb',   TIMINGS.amb);
  on('spLogo',  TIMINGS.logo);
  on('sl1',     TIMINGS.line1);
  on('sl2',     TIMINGS.line2);
  on('sl3',     TIMINGS.line3);
  on('sl4',     TIMINGS.line4);

  setTimeout(() => {
    document.getElementById('spTrack')?.classList.add('on');
    document.getElementById('spHint')?.classList.add('on');
    setTimeout(() => document.getElementById('spFill')?.classList.add('on'), 60);
  }, TIMINGS.bar);

  setTimeout(() => { splashReady = true; }, TIMINGS.ready);
  setTimeout(() => { if (splashReady) exitSplash(); }, TIMINGS.auto);
}

// 탭으로 스플래시 건너뛰기
function tapSplash() {
  if (splashReady) exitSplash();
}

// 스플래시 퇴장 + 메인 진입
function exitSplash() {
  splashReady = false;
  stopAICanvas();
  const sp = document.getElementById('splash');
  sp.classList.add('exit');
  document.getElementById('main').classList.add('visible');
  setTimeout(() => sp.classList.add('gone'), 650);

  // 순차 등장
  const steps = [
    { id: 'introNav', delay: 200 },
    { id: 'introEyebrow', delay: 600 },
    { id: 'introTitle', delay: 1100 },
    { id: 'introRest', delay: 1600 },
    { id: 'slider', delay: 1600 },
  ];
  steps.forEach(({ id, delay }) => {
    setTimeout(() => document.getElementById(id)?.classList.add('show'), delay);
  });

  setTimeout(() => initMainObservers(), 1700);
}


/* ──────────────────────────
   2. 메인 인터랙션 초기화
   (스플래시 퇴장 후 실행)
────────────────────────── */

function initMainObservers() {
  initSlider();
  initReveal();
}


/* ──────────────────────────
   3. 슬라이더 + 도트 인디케이터
────────────────────────── */

function initSlider() {
  const slider = document.getElementById('slider');
  const dotsEl = document.getElementById('dots');
  const cards  = Array.from(slider.querySelectorAll('.pc'));
  let currentIdx = 0;
  let autoTimer = null;
  let userTouched = false;

  // 도트 생성
  cards.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' on' : '');
    d.onclick = () => goTo(i);
    dotsEl.appendChild(d);
  });

  function goTo(idx) {
    if (idx < 0 || idx >= cards.length) return;
    const targetLeft = cards[idx].offsetLeft;
    const isLoop = idx === 0 && currentIdx === cards.length - 1;
    slider.scrollTo({ left: targetLeft, behavior: isLoop ? 'instant' : 'smooth' });
    currentIdx = idx;
  }

  const counterEl = document.getElementById('slideCounter');
  let prevIdx = -1;

  function setActiveCard(idx) {
    cards.forEach((c, i) => c.classList.toggle('active', i === idx));
  }

  function resetDotProgress() {
    const dots = dotsEl.querySelectorAll('.dot');
    dots.forEach(d => d.classList.remove('filling'));
    // reflow 후 활성 도트에 filling 추가
    const activeDot = dots[currentIdx];
    if (activeDot) {
      activeDot.offsetWidth;
      activeDot.classList.add('filling');
    }
  }

  // 스크롤 시 도트 + 카운터 + 페이드업 동기화
  function syncDots() {
    const cardWidth = cards[0].offsetWidth;
    const idx = Math.round(slider.scrollLeft / cardWidth);
    currentIdx = idx;
    dotsEl.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('on', i === idx)
    );
    if (counterEl) counterEl.textContent = (idx + 1) + ' / ' + cards.length;
    if (idx !== prevIdx) {
      prevIdx = idx;
      setActiveCard(idx);
      resetDotProgress();
    }
  }
  slider.addEventListener('scroll', syncDots, { passive: true });

  // 5초마다 자동 슬라이드
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      const next = (currentIdx + 1) % cards.length;
      goTo(next);
    }, 5000);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  slider.addEventListener('touchstart', () => {
    userTouched = true;
    stopAuto();
  }, { passive: true });

  slider.addEventListener('touchend', () => {
    setTimeout(() => { userTouched = false; startAuto(); }, 3000);
  }, { passive: true });

  // iOS 초기 위치 리셋
  slider.scrollTo({ left: 0, behavior: 'instant' });
  setActiveCard(0);
  setTimeout(() => resetDotProgress(), 50);
  startAuto();

}


/* ──────────────────────────
   4. 스크롤 reveal 애니메이션
────────────────────────── */

function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .vi').forEach(el => obs.observe(el));
}


/* ──────────────────────────
   6. 페이지 로드 시 실행
────────────────────────── */

document.addEventListener('DOMContentLoaded', initSplash);
