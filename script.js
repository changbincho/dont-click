/* =========================================================
   PART 0. articles.js에 붙여 넣은 본문을 문단으로 나눠서 넣기
   ========================================================= */
function fillArticle(container, rawText, subheads, opts) {
  const subs = subheads.map(s => s.trim().toLowerCase());
  rawText.split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .forEach(line => {
      const isSub = subs.includes(line.toLowerCase());
      const el = document.createElement(isSub ? opts.subTag : 'p');
      el.className = isSub ? opts.subClass : opts.pClass;
      el.textContent = line;
      container.appendChild(el);
    });
}

fillArticle(document.getElementById('fence-body'), FENCE_TEXT, FENCE_SUBHEADS,
  { subTag: 'h2', subClass: 'sub', pClass: 't' });

fillArticle(document.getElementById('touch-body'), TOUCH_TEXT, TOUCH_SUBHEADS,
  { subTag: 'h3', subClass: 'ta-sub braille-me', pClass: 'ta-p braille-me' });


/* =========================================================
   PART 1. 울타리 기사: 블록
   ========================================================= */

// ===== 블록 설정: 여기를 고치면 블록이 바뀜 =====
// label  : 블록에 적힌 금지 문구
// photo  : images 폴더 안 사진 파일 이름 (없으면 빈 테두리로 바뀜)
// at     : 기사 어디쯤을 가릴지 (0 = 제목, 1 = 마지막 문단). 문단 수가 바뀌어도 알아서 맞춰짐
// x, w   : 가로 시작 위치와 너비 (글 칸 너비 대비 비율, 0~1)
// y      : 그 문단 안에서 세로로 얼마나 내려올지 (비율, 0~1)
// h      : 블록 높이 (px)
const BLOCKS = [
  { label: 'Keep out',            photo: 'images/lock-01.jpg', at: 0.00, x: 0.10, w: 0.34, y: 0.10, h: 44 },
  { label: 'Members only',        photo: 'images/lock-02.jpg', at: 0.15, x: 0.48, w: 0.36, y: 0.20, h: 44 },
  { label: 'Do not move',         photo: 'images/lock-03.jpg', at: 0.38, x: 0.06, w: 0.38, y: 0.30, h: 48 },
  { label: 'Restricted',          photo: 'images/lock-04.jpg', at: 0.60, x: 0.50, w: 0.34, y: 0.35, h: 48 },
  { label: 'Permission required', photo: 'images/lock-05.jpg', at: 0.82, x: 0.14, w: 0.42, y: 0.30, h: 48 },
  { label: 'Authorized only',     photo: 'images/lock-06.jpg', at: 1.00, x: 0.44, w: 0.40, y: 0.25, h: 48 },
];

// 글 밖으로 빼면 사진이 커지는 크기
const PHOTO_MAX_WIDTH = 280;   // px, 최대 너비
const PHOTO_RATIO     = 1.25;  // 세로 / 가로 (1.25 = 4:5 세로 사진)

// 한 번 사진으로 바뀐 블록을 다시 글 위로 올리면?
// false = 계속 사진으로 남음 (한 번 넘어가 보면 다시는 모르는 척 못 한다)
// true  = 다시 작은 회색 판으로 돌아감
const REVERT_ON_RETURN = false;

// ===== 요소 찾기 =====
const home    = document.getElementById('home');
const gate    = document.getElementById('gate');
const reader  = document.getElementById('reader');
const col     = document.getElementById('col');
const end     = document.getElementById('end');
const relock  = document.getElementById('relock');
const back    = document.getElementById('back');
const getTexts = () => Array.from(col.querySelectorAll('.t'));

let slabs = [];
let moved = false;

// ===== 블록 만들기 =====
function build() {
  slabs.forEach(s => s.el.remove());
  slabs = [];
  moved = false;

  const texts = getTexts();
  const W = col.clientWidth;

  BLOCKS.forEach(b => {
    const target = texts[Math.round(b.at * (texts.length - 1))];
    if (!target) return;

    const el = document.createElement('div');
    el.className = 'slab';
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', b.label + '. Drag or use arrow keys to move it.');

    // 사진: 처음엔 숨겨두고, 블록이 글 밖으로 나가면 보임
    if (b.photo) {
      const img = document.createElement('img');
      img.alt = '';
      img.draggable = false;
      img.onerror = () => { img.remove(); el.classList.add('no-photo'); };
      img.src = b.photo;
      el.appendChild(img);
    } else {
      el.classList.add('no-photo');
    }

    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = b.label;
    el.appendChild(tag);

    const w = Math.round(b.w * W);
    const s = {
      el,
      x: b.x * W,
      y: target.offsetTop + b.y * target.offsetHeight,
      w, h: b.h,
      w0: w, h0: b.h,   // 원래 크기 (되돌릴 때 사용)
      big: false,
      drag: null,
    };

    col.appendChild(el);
    place(s);
    makeDraggable(s);
    slabs.push(s);
  });

  update();
}

// 화면 밖으로 못 나가게 붙잡기
function clamp(s) {
  const r = col.getBoundingClientRect();
  const minX = -r.left + 8;
  const maxX = window.innerWidth - r.left - s.w - 8;
  s.x = Math.min(Math.max(s.x, minX), Math.max(minX, maxX));
  s.y = Math.max(s.y, -20);
}

function place(s) {
  clamp(s);
  s.el.style.left   = s.x + 'px';
  s.el.style.top    = s.y + 'px';
  s.el.style.width  = s.w + 'px';
  s.el.style.height = s.h + 'px';
}

// ===== 크기 바꾸기: 글에서 먼 쪽으로 커지게 =====
function resize(s, newW, newH) {
  const r = s.el.getBoundingClientRect();
  const c = col.getBoundingClientRect();

  let nx;
  if (r.right <= c.left)      nx = s.x + s.w - newW;       // 글 왼쪽에 있으면 왼쪽으로 커짐
  else if (r.left >= c.right) nx = s.x;                    // 글 오른쪽에 있으면 오른쪽으로 커짐
  else                        nx = s.x + (s.w - newW) / 2; // 위아래에 있으면 가운데 기준

  const dx = nx - s.x;
  s.x = nx; s.w = newW; s.h = newH;
  if (s.drag) s.drag.ox += dx;   // 끌고 있는 중이면 손가락 위치가 어긋나지 않게 보정

  s.el.classList.add('growing');
  place(s);
  clearTimeout(s.growTimer);
  s.growTimer = setTimeout(() => s.el.classList.remove('growing'), 480);
}

function grow(s) {
  if (s.big || s.el.classList.contains('no-photo')) return;
  const pw = Math.round(Math.min(PHOTO_MAX_WIDTH, window.innerWidth * 0.55));
  s.big = true;
  resize(s, pw, Math.round(pw * PHOTO_RATIO));
}

function shrink(s) {
  if (!s.big) return;
  s.big = false;
  resize(s, s.w0, s.h0);
}

// ===== 드래그 (마우스, 터치 둘 다) + 키보드 화살표 =====
function makeDraggable(s) {
  s.el.addEventListener('pointerdown', e => {
    s.el.setPointerCapture(e.pointerId);
    s.el.classList.add('lift');
    s.el.style.zIndex = 4;
    s.drag = { sx: e.clientX, sy: e.clientY, ox: s.x, oy: s.y };
  });

  s.el.addEventListener('pointermove', e => {
    if (!s.drag || !s.el.hasPointerCapture(e.pointerId)) return;
    s.x = s.drag.ox + (e.clientX - s.drag.sx);
    s.y = s.drag.oy + (e.clientY - s.drag.sy);
    moved = true;
    place(s);
    update();   // 끄는 도중에 글 밖으로 빠지는 순간 바로 사진으로 바뀌게
  });

  const drop = () => {
    s.drag = null;
    s.el.classList.remove('lift');
    s.el.style.zIndex = 3;
    update();
  };
  s.el.addEventListener('pointerup', drop);
  s.el.addEventListener('pointercancel', drop);

  s.el.addEventListener('keydown', e => {
    const step = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[e.key];
    if (!step) return;
    e.preventDefault();
    s.x += step[0]; s.y += step[1];
    moved = true;
    place(s);
    update();
  });
}

// ===== 블록마다: 글을 가리고 있으면 '규칙', 비켜나면 '사물(사진)' =====
function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function isBlocking(s, textRects) {
  const r = s.el.getBoundingClientRect();
  return textRects.some(t => overlaps(r, t));
}

function update() {
  const textRects = getTexts().map(t => t.getBoundingClientRect());

  // 1) 글에서 빠진 블록은 사진으로 바꾸고 키우기
  slabs.forEach(s => {
    const blocking = isBlocking(s, textRects);
    if (!blocking && !s.el.classList.contains('revealed')) {
      s.el.classList.add('revealed');
      grow(s);
    } else if (blocking && REVERT_ON_RETURN && s.el.classList.contains('revealed')) {
      s.el.classList.remove('revealed');
      shrink(s);
    }
  });

  // 2) 아직 글을 가리는 블록 수 세기 (커진 사진이 글을 덮으면 그것도 셈)
  const left = slabs.filter(s => isBlocking(s, textRects)).length;


  end.hidden = left !== 0;   // 0개가 되면 엔딩 등장
}

// ===== 화면 전환 =====
function openFence() {
  document.documentElement.classList.remove('paged');
  home.hidden = true;
  reader.hidden = false;
  window.scrollTo(0, 0);
  requestAnimationFrame(build);
}

function goHome() {
  end.hidden = true;
  reader.hidden = true;
  home.hidden = false;
  window.scrollTo(0, 0);
  enterHome();
  gate.focus({ preventScroll: true });
}

gate.addEventListener('click', openFence);
relock.addEventListener('click', goHome);
back.addEventListener('click', goHome);


/* =========================================================
   PART 2. 점자 기사
   기사의 모든 단어를 점자로 바꿔 찍음. 손(마우스, 손가락)이 지나간 단어만
   잠깐 영어 글자로 바뀌었다가 다시 점자로 돌아감.
   ========================================================= */

const REVEAL_MS = 1400;   // 손이 지나간 단어가 글자로 남아 있는 시간 (ms)

// 점자 1급(풀어쓰기) 표: 숫자는 점 번호
const BRAILLE_LETTERS = {
  a:'1', b:'12', c:'14', d:'145', e:'15', f:'124', g:'1245', h:'125', i:'24', j:'245',
  k:'13', l:'123', m:'134', n:'1345', o:'135', p:'1234', q:'12345', r:'1235', s:'234', t:'2345',
  u:'136', v:'1236', w:'2456', x:'1346', y:'13456', z:'1356',
};
const BRAILLE_PUNCT = {
  ',':'2', ';':'23', ':':'25', '.':'256', '!':'235', '?':'236', "'":'3', '’':'3', '‘':'3',
  '-':'36', '–':'36', '—':'36', '"':'356', '“':'236', '”':'356', '(':'2356', ')':'2356', '/':'34',
};
const CAPITAL = '6', NUMBER = '3456';
const DIGIT_AS_LETTER = { '1':'a','2':'b','3':'c','4':'d','5':'e','6':'f','7':'g','8':'h','9':'i','0':'j' };

const cell = dots => String.fromCharCode(0x2800 + [...dots].reduce((n, d) => n | (1 << (d - 1)), 0));

function toBraille(word) {
  let out = '', inNumber = false;
  for (const raw of word.normalize('NFD').replace(/[̀-ͯ]/g, '')) {
    if (DIGIT_AS_LETTER[raw]) {
      if (!inNumber) { out += cell(NUMBER); inNumber = true; }
      out += cell(BRAILLE_LETTERS[DIGIT_AS_LETTER[raw]]);
      continue;
    }
    inNumber = false;
    const lower = raw.toLowerCase();
    if (BRAILLE_LETTERS[lower]) {
      if (raw !== lower) out += cell(CAPITAL);
      out += cell(BRAILLE_LETTERS[lower]);
    } else if (BRAILLE_PUNCT[raw]) {
      out += cell(BRAILLE_PUNCT[raw]);
    }
  }
  return out;
}

// 이미지 넣기: TOUCH_IMAGES의 after번째 문단 뒤에
(function insertFigures() {
  const body = document.getElementById('touch-body');
  const paras = Array.from(body.querySelectorAll('p'));
  (typeof TOUCH_IMAGES !== 'undefined' ? TOUCH_IMAGES : []).forEach(img => {
    const after = paras[Math.min(img.after, paras.length) - 1];
    if (!after) return;
    const fig = document.createElement('figure');
    fig.className = 'ta-fig';
    fig.innerHTML = `<div class="frame"><img alt=""><canvas aria-hidden="true"></canvas></div>`;
    const el = fig.querySelector('img');
    el.addEventListener('error', () => fig.remove());   // 사진 파일이 없으면 자리째 빠짐
    el.src = img.src;
    after.after(fig);
  });
})();

// 글을 단어 단위로 쪼개서 [점자 | 글자] 두 겹으로 만들기
let wordCount = 0;
document.querySelectorAll('.braille-me').forEach(el => {
  const words = el.textContent.split(/\s+/).filter(Boolean);
  el.textContent = '';
  words.forEach((wd, i) => {
    const w = document.createElement('span');
    w.className = 'w';
    const b = document.createElement('span'); b.className = 'b'; b.textContent = toBraille(wd); b.setAttribute('aria-hidden', 'true');
    const l = document.createElement('span'); l.className = 'l'; l.textContent = wd;
    w.append(b, l);
    el.appendChild(w);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    wordCount++;
  });
});

// ===== 이미지 위 점자 판 =====
// 사진 위를 종이색 판으로 덮고, 칸(점자 한 글자 크기)마다 본문 점자처럼 검은 점을 찍음.
// 만진 칸은 판이 통째로 사라져 사진이 보이고, REVEAL_MS 뒤에 다시 덮임
const DOT_R = 1.7, CELL_W = 16, CELL_H = 30, DOT_GAP_X = 5.5, DOT_GAP_Y = 5.5;
const IMG_REVEAL_R = 46;   // 한 번 만질 때 드러나는 범위 (px)
const paperColour = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() || '#EEF0F2';
const inkColour   = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#111315';
const figures = [];

function setupFigure(fig) {
  const img = fig.querySelector('img');
  const canvas = fig.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const f = { fig, img, canvas, ctx, cols: 0, rows: 0, until: null, alpha: null, pattern: null };

  function layout() {
    const w = img.clientWidth, h = img.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    f.cols = Math.ceil(w / CELL_W); f.rows = Math.ceil(h / CELL_H);
    const n = f.cols * f.rows;
    f.until = new Float64Array(n);
    f.alpha = new Float32Array(n).fill(1);
    f.pattern = new Uint8Array(n);
    for (let i = 0; i < n; i++) f.pattern[i] = 1 + Math.floor(Math.random() * 63);   // 6비트 = 점 6개 중 켜진 것
    for (let i = 0; i < n; i++) drawCell(f, i);
  }
  img.complete ? layout() : img.addEventListener('load', layout);
  f.layout = layout;
  figures.push(f);
}

function drawCell(f, i) {
  const { ctx } = f;
  const cx = (i % f.cols) * CELL_W, cy = Math.floor(i / f.cols) * CELL_H;
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(cx, cy, CELL_W, CELL_H);
  if (f.alpha[i] <= 0) return;
  ctx.globalAlpha = f.alpha[i];
  ctx.fillStyle = paperColour;
  ctx.fillRect(cx, cy, CELL_W, CELL_H);
  // 점 찍기: 본문 점자처럼 검은 점 (왼쪽 1-2-3, 오른쪽 4-5-6)
  ctx.fillStyle = inkColour;
  const ox = cx + (CELL_W - DOT_GAP_X) / 2, oy = cy + (CELL_H - DOT_GAP_Y * 2) / 2;
  for (let d = 0; d < 6; d++) {
    if (!(f.pattern[i] & (1 << d))) continue;
    const x = ox + (d < 3 ? 0 : DOT_GAP_X), y = oy + (d % 3) * DOT_GAP_Y;
    ctx.beginPath(); ctx.arc(x, y, DOT_R, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
}

function revealImage(f, clientX, clientY) {
  if (!f.until) return;
  const r = f.canvas.getBoundingClientRect();
  const x = clientX - r.left, y = clientY - r.top, now = performance.now();
  const c0 = Math.max(0, Math.floor((x - IMG_REVEAL_R) / CELL_W)), c1 = Math.min(f.cols - 1, Math.floor((x + IMG_REVEAL_R) / CELL_W));
  const r0 = Math.max(0, Math.floor((y - IMG_REVEAL_R) / CELL_H)), r1 = Math.min(f.rows - 1, Math.floor((y + IMG_REVEAL_R) / CELL_H));
  for (let row = r0; row <= r1; row++) for (let col = c0; col <= c1; col++) {
    const dx = col * CELL_W + CELL_W / 2 - x, dy = row * CELL_H + CELL_H / 2 - y;
    if (dx * dx + dy * dy > IMG_REVEAL_R * IMG_REVEAL_R) continue;
    f.until[row * f.cols + col] = now + REVEAL_MS;
  }
}

// 매 프레임: 만진 칸은 판을 걷어내고, 시간이 지난 칸은 다시 덮음
(function animateFigures() {
  const now = performance.now();
  figures.forEach(f => {
    if (!f.until) return;
    for (let i = 0; i < f.until.length; i++) {
      const target = f.until[i] > now ? 0 : 1;
      if (f.alpha[i] === target) continue;
      f.alpha[i] = target === 0 ? Math.max(0, f.alpha[i] - 0.2) : Math.min(1, f.alpha[i] + 0.06);
      drawCell(f, i);
    }
  });
  requestAnimationFrame(animateFigures);
})();

document.querySelectorAll('.ta-fig').forEach(setupFigure);
window.addEventListener('resize', () => figures.forEach(f => f.layout()));

// 손이 닿은 단어 보여주기
const touchArticle = document.getElementById('touch-article');
const timers = new WeakMap();

function reveal(w) {
  w.classList.add('on');
  clearTimeout(timers.get(w));
  timers.set(w, setTimeout(() => w.classList.remove('on'), REVEAL_MS));
}

function revealAt(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return;
  const fig = el.closest('.ta-fig');
  if (fig && el.tagName === 'CANVAS') {
    const f = figures.find(f => f.fig === fig);
    if (f) revealImage(f, x, y);
    return;
  }
  const w = el.closest('.w');
  if (w && touchArticle.contains(w)) reveal(w);
}

touchArticle.addEventListener('pointermove', e => {
  // 마우스는 올리기만 해도, 손가락은 화면에 댄 채로 좌우로 쓸면
  revealAt(e.clientX, e.clientY);
});
touchArticle.addEventListener('pointerdown', e => revealAt(e.clientX, e.clientY));


/* =========================================================
   PART 3. 홈 카드 넘기기
   조금 스크롤하면 카드가 살짝 끌려오다 제자리로 돌아오고,
   화면 높이의 THRESHOLD 이상 넘기면 다음(이전) 카드로 넘어감.
   긴 기사 카드는 안에서 끝까지 스크롤한 다음부터 넘기기가 시작됨.
   ========================================================= */

const THRESHOLD = 0.6;    // 화면 높이의 몇 % 이상 넘겨야 넘어가는지
const RESIST    = 0.35;   // 버티는 정도 (작을수록 덜 끌려옴)

const track = document.getElementById('track');
const cards = Array.from(track.querySelectorAll('.card'));
let page = 0;
let pull = 0;             // 지금까지 넘긴 양 (px, +는 아래로)
let locked = false;       // 카드가 넘어가는 중
let wheelIdle = null;

const vh = () => window.innerHeight;
const baseY = i => cards[i].offsetTop;

function setTrack(offset, animate) {
  track.classList.toggle('snapping', animate);
  track.style.transform = `translateY(${-(baseY(page)) - offset}px)`;
}

function goTo(i, animate = true) {
  page = Math.max(0, Math.min(cards.length - 1, i));
  pull = 0;
  setTrack(0, animate);
  if (animate) {
    locked = true;
    setTimeout(() => { locked = false; }, 700);
  }
}

// 카드 안에서 아직 더 스크롤할 수 있는지
function canScrollInside(dir) {
  const el = cards[page];
  if (el.scrollHeight <= el.clientHeight + 1) return false;
  return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0;
}

function dragTo(amount) {
  // 맨 처음 카드에서 위로, 맨 끝 카드에서 아래로는 더 끌리지 않게
  if ((page === 0 && amount < 0) || (page === cards.length - 1 && amount > 0)) amount *= 0.25;
  pull = amount;
  setTrack(pull * RESIST, false);
}

function release() {
  const need = vh() * THRESHOLD;
  if (pull > need && page < cards.length - 1) goTo(page + 1);
  else if (pull < -need && page > 0) goTo(page - 1);
  else goTo(page);   // 덜 넘겼으면 제자리로 탁
}

// 마우스 휠, 트랙패드
window.addEventListener('wheel', e => {
  if (home.hidden) return;
  const dir = Math.sign(e.deltaY);
  if (!dir) return;
  if (pull === 0 && canScrollInside(dir)) return;   // 카드 안 스크롤 먼저
  e.preventDefault();
  if (locked) return;
  const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
  dragTo(pull + dy);
  clearTimeout(wheelIdle);
  wheelIdle = setTimeout(release, 160);   // 휠을 멈추면 판정
  if (Math.abs(pull) > vh() * THRESHOLD) { clearTimeout(wheelIdle); release(); }
}, { passive: false });

// 터치 (폰)
let touchY = null, touchStartPull = 0, touchInside = false;
window.addEventListener('touchstart', e => {
  if (home.hidden || locked) return;
  touchY = e.touches[0].clientY;
  touchStartPull = pull;
  touchInside = true;
}, { passive: true });

window.addEventListener('touchmove', e => {
  if (home.hidden || touchY === null || locked) return;
  const dy = touchY - e.touches[0].clientY;   // +는 아래로 넘김
  const dir = Math.sign(dy);
  if (touchInside && pull === 0 && canScrollInside(dir)) { touchY = e.touches[0].clientY; return; }
  touchInside = false;
  e.preventDefault();
  dragTo(touchStartPull + dy);
}, { passive: false });

window.addEventListener('touchend', () => {
  if (home.hidden || touchY === null) return;
  touchY = null;
  if (pull !== 0) release();
});

// 키보드: 페이지다운/업, 스페이스
window.addEventListener('keydown', e => {
  if (home.hidden || locked) return;
  const down = ['PageDown', ' '].includes(e.key);
  const up = e.key === 'PageUp';
  if (!down && !up) return;
  if (canScrollInside(down ? 1 : -1)) return;
  e.preventDefault();
  goTo(page + (down ? 1 : -1));
});

function enterHome() {
  document.documentElement.classList.add('paged');
  goTo(0, false);
}
enterHome();


/* =========================================================
   창 크기 변경, 웹폰트 로딩
   ========================================================= */
window.addEventListener('resize', () => {
  if (!home.hidden) goTo(page, false);

  // 울타리: 아직 아무것도 안 옮겼으면 다시 배치, 옮겼으면 화면 안으로만 붙잡기
  if (!reader.hidden && !moved) build();
  else slabs.forEach(place);
});

// 웹폰트가 늦게 뜨면 글 높이가 바뀌니까 한 번 더 배치
if (document.fonts) {
  document.fonts.ready.then(() => {
    if (!reader.hidden && !moved) build();
  });
}
