# Math Readability & Mascot Animation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add color-coded bold math operators + readable question sizing, and a persistent SVG bear mascot with day-themed costumes and Duolingo-style reactions.

**Architecture:** Three new files (`math-renderer.js`, `mascot.js`, `mascot.css`) plus targeted edits to `render-day.js`, `components.css`, and `day.html`. All static, no build step, fully GitHub Pages compatible.

**Tech Stack:** Vanilla JS ES modules, SVG primitives, CSS `@keyframes`, Vitest for unit tests.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `assets/js/ui/math-renderer.js` | `renderMath(str)` — wraps `+` `-` `×` in colored spans |
| Create | `assets/js/ui/mascot.js` | SVG bear, 15 costumes, `createMascot(day)` → `{ react, celebrate }` |
| Create | `assets/css/mascot.css` | All mascot keyframes, wrapper positioning, overlay styles |
| Create | `tests/unit/math-renderer.test.js` | Unit tests for `renderMath` |
| Create | `tests/unit/mascot.test.js` | Unit tests for `getCostumeSVG` |
| Modify | `assets/css/components.css` | Operator CSS classes, question list font size + spacing |
| Modify | `assets/js/ui/render-day.js` | Import + wire `renderMath` and `createMascot` |
| Modify | `day.html` | Add `<link mascot.css>` and `<div id="mascot-wrap">` |

---

## Task 1: renderMath Utility (TDD)

**Files:**
- Create: `assets/js/ui/math-renderer.js`
- Create: `tests/unit/math-renderer.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/math-renderer.test.js`:

```js
import { describe, expect, test } from 'vitest';
import { renderMath } from '../../assets/js/ui/math-renderer.js';

describe('renderMath', () => {
  test('wraps + in green span', () => {
    expect(renderMath('12 + 7')).toBe('12 <span class="op op--plus">+</span> 7');
  });

  test('wraps - in orange-red span', () => {
    expect(renderMath('35 - 18')).toBe('35 <span class="op op--minus">-</span> 18');
  });

  test('wraps × in purple span', () => {
    expect(renderMath('6 × 4')).toBe('6 <span class="op op--times">×</span> 4');
  });

  test('handles multiple operators in one question', () => {
    const result = renderMath('What is 200 + 5?');
    expect(result).toContain('<span class="op op--plus">+</span>');
    expect(result).toContain('What is 200');
    expect(result).toContain('5?');
  });

  test('leaves plain text with no operators unchanged', () => {
    expect(renderMath('Expanded form of 540')).toBe('Expanded form of 540');
  });

  test('leaves word problem text without math operators unchanged', () => {
    const q = 'A class has 20 students and 5 join. How many now?';
    expect(renderMath(q)).toBe(q);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --reporter=verbose
```

Expected: 6 failures — `Cannot find module '../../assets/js/ui/math-renderer.js'`

- [ ] **Step 3: Implement renderMath**

Create `assets/js/ui/math-renderer.js`:

```js
const OPERATORS = { '+': 'plus', '-': 'minus', '×': 'times' };

export const renderMath = (str) =>
  str.replace(/[+\-×]/g, (op) => `<span class="op op--${OPERATORS[op]}">${op}</span>`);
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose
```

Expected: all 6 `renderMath` tests PASS, existing tests still PASS.

- [ ] **Step 5: Commit**

```bash
git add assets/js/ui/math-renderer.js tests/unit/math-renderer.test.js
git commit -m "feat: add renderMath utility with operator color-coding"
```

---

## Task 2: Math Readability CSS

**Files:**
- Modify: `assets/css/components.css`

- [ ] **Step 1: Add operator CSS and question list sizing**

Append to the end of `assets/css/components.css`:

```css
.op{font-weight:900;font-size:1.2em}
.op--plus{color:#20a84a}.op--minus{color:#e05c00}.op--times{color:#7e44c0}
.card ol{font-size:1.25rem;line-height:2;letter-spacing:.01em}
.card ol li{margin-bottom:.5rem;padding:4px 0}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/components.css
git commit -m "feat: add math operator color classes and question list readability styles"
```

---

## Task 3: Wire renderMath into render-day.js

**Files:**
- Modify: `assets/js/ui/render-day.js`

- [ ] **Step 1: Add import at the top of render-day.js**

In `assets/js/ui/render-day.js`, the first import block starts at line 1. Add the `renderMath` import after the existing imports (after line 9):

```js
import { renderMath } from './math-renderer.js';
```

- [ ] **Step 2: Apply renderMath to required questions**

In `renderSection()`, find this line (around line 83):

```js
sectionWrap.innerHTML = `<section class="card"><h3>${section}</h3><ol>${required.map((q) => `<li>${q}</li>`).join('')}</ol>
```

Replace `\`<li>${q}</li>\`` with `\`<li>${renderMath(q)}</li>\``:

```js
sectionWrap.innerHTML = `<section class="card"><h3>${section}</h3><ol>${required.map((q) => `<li>${renderMath(q)}</li>`).join('')}</ol>
```

- [ ] **Step 3: Apply renderMath to bonus questions**

In the same `renderSection()` function, find the bonus area template (around line 85):

```js
`<article class="bonus-panel"><h4>Bonus Round ${a.attempt}</h4><ol>${a.questions.map((q) => `<li>${q}</li>`).join('')}</ol></article>`
```

Change to:

```js
`<article class="bonus-panel"><h4>Bonus Round ${a.attempt}</h4><ol>${a.questions.map((q) => `<li>${renderMath(q)}</li>`).join('')}</ol></article>`
```

- [ ] **Step 4: Run all tests to verify nothing broke**

```bash
npm test -- --reporter=verbose
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add assets/js/ui/render-day.js
git commit -m "feat: apply renderMath to required and bonus question lists"
```

---

## Task 4: Mascot Costume Data (TDD)

**Files:**
- Create: `assets/js/ui/mascot.js` (pure data portion only)
- Create: `tests/unit/mascot.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/mascot.test.js`:

```js
import { describe, expect, test } from 'vitest';
import { getCostumeSVG } from '../../assets/js/ui/mascot.js';

describe('getCostumeSVG', () => {
  test('returns a non-empty string for each valid day 1-15', () => {
    for (let day = 1; day <= 15; day++) {
      const svg = getCostumeSVG(day);
      expect(typeof svg).toBe('string');
      expect(svg.length).toBeGreaterThan(0);
    }
  });

  test('returns day-1 costume as fallback for out-of-range days', () => {
    expect(getCostumeSVG(0)).toBe(getCostumeSVG(1));
    expect(getCostumeSVG(16)).toBe(getCostumeSVG(1));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --reporter=verbose
```

Expected: FAIL — `Cannot find module '../../assets/js/ui/mascot.js'`

- [ ] **Step 3: Create mascot.js with costume data and getCostumeSVG**

Create `assets/js/ui/mascot.js`:

```js
// ============================================================
// COSTUME DATA — pure, testable in Node
// ============================================================

const COSTUMES = [
  // Day 1 – Nature Forest: leaf crown
  `<path d="M34,20 Q50,5 66,20" stroke="#4CAF50" stroke-width="3" fill="none" stroke-linecap="round"/>
   <ellipse cx="50" cy="14" rx="7" ry="10" fill="#4CAF50"/>
   <ellipse cx="38" cy="17" rx="6" ry="9" fill="#66BB6A" transform="rotate(-20 38 17)"/>
   <ellipse cx="62" cy="17" rx="6" ry="9" fill="#66BB6A" transform="rotate(20 62 17)"/>`,

  // Day 2 – Safari Animals: safari hat
  `<ellipse cx="50" cy="16" rx="28" ry="5" fill="#8B6914"/>
   <ellipse cx="50" cy="13" rx="18" ry="9" fill="#A0792A"/>
   <ellipse cx="50" cy="8" rx="12" ry="5" fill="#C49A3C"/>`,

  // Day 3 – Ocean Friends: snorkel mask
  `<rect x="30" y="35" width="40" height="18" rx="8" fill="#1e90ff" opacity="0.7"/>
   <rect x="30" y="35" width="40" height="18" rx="8" fill="none" stroke="#0060b0" stroke-width="2"/>
   <circle cx="65" cy="10" r="4" fill="#1e90ff" stroke="#0060b0" stroke-width="1.5"/>
   <line x1="65" y1="14" x2="65" y2="28" stroke="#0060b0" stroke-width="2"/>`,

  // Day 4 – Dinosaur Land: dino spikes
  `<polygon points="35,18 38,5 41,18" fill="#4CAF50"/>
   <polygon points="44,16 48,2 52,16" fill="#66BB6A"/>
   <polygon points="55,18 58,5 61,18" fill="#4CAF50"/>
   <polygon points="64,18 67,8 70,18" fill="#66BB6A"/>`,

  // Day 5 – Splash Coast: sun hat
  `<ellipse cx="50" cy="16" rx="32" ry="6" fill="#FFD700"/>
   <ellipse cx="50" cy="12" rx="20" ry="10" fill="#FFC200"/>
   <ellipse cx="50" cy="6" rx="14" ry="6" fill="#FFB700"/>`,

  // Day 6 – Sky Aircraft: pilot goggles
  `<rect x="28" y="36" width="44" height="14" rx="6" fill="#6B3A1F"/>
   <circle cx="40" cy="43" r="8" fill="#87CEEB" stroke="#4A2810" stroke-width="2"/>
   <circle cx="60" cy="43" r="8" fill="#87CEEB" stroke="#4A2810" stroke-width="2"/>
   <line x1="48" y1="43" x2="52" y2="43" stroke="#4A2810" stroke-width="2"/>`,

  // Day 7 – Jungle Adventure: banana leaf
  `<path d="M22,24 Q50,2 78,18 Q60,12 50,15 Q40,12 22,24Z" fill="#90EE90"/>
   <path d="M50,15 L50,30" stroke="#228B22" stroke-width="1.5"/>`,

  // Day 8 – Farm Day: straw hat
  `<ellipse cx="50" cy="16" rx="30" ry="6" fill="#D4A44C"/>
   <ellipse cx="50" cy="12" rx="20" ry="10" fill="#C49030"/>
   <ellipse cx="50" cy="7" rx="13" ry="6" fill="#E0B870"/>`,

  // Day 9 – Arctic Animals: earmuffs
  `<circle cx="18" cy="46" r="10" fill="#4DC8E8"/>
   <circle cx="82" cy="46" r="10" fill="#4DC8E8"/>
   <path d="M18,40 Q50,30 82,40" stroke="#4DC8E8" stroke-width="5" fill="none"/>
   <circle cx="18" cy="46" r="6" fill="#87E0F5"/>
   <circle cx="82" cy="46" r="6" fill="#87E0F5"/>`,

  // Day 10 – Puzzle Planet: puzzle-piece hat
  `<rect x="36" y="6" width="28" height="20" rx="3" fill="#FF8C42"/>
   <circle cx="50" cy="6" r="5" fill="#FF8C42"/>
   <rect x="56" y="13" width="8" height="8" rx="2" fill="#FFB347"/>
   <rect x="44" y="24" width="12" height="4" rx="1" fill="#E67320"/>`,

  // Day 11 – Castle Quest: crown
  `<polygon points="30,24 30,8 38,16 50,4 62,16 70,8 70,24" fill="#FFD700" stroke="#DAA520" stroke-width="1.5"/>
   <circle cx="50" cy="10" r="4" fill="#FF4040"/>
   <circle cx="38" cy="17" r="3" fill="#4169E1"/>
   <circle cx="62" cy="17" r="3" fill="#4169E1"/>`,

  // Day 12 – Robot Lab: antenna
  `<line x1="50" y1="14" x2="50" y2="4" stroke="#888" stroke-width="3"/>
   <circle cx="50" cy="2" r="4" fill="#FF4040"/>
   <rect x="30" y="12" width="40" height="10" rx="3" fill="#9EA7B0" stroke="#666" stroke-width="1"/>`,

  // Day 13 – Pirate Bay: pirate hat
  `<ellipse cx="50" cy="19" rx="30" ry="6" fill="#1a1a1a"/>
   <path d="M30,19 L36,4 L50,10 L64,4 L70,19 Z" fill="#1a1a1a"/>
   <circle cx="50" cy="13" r="5" fill="white"/>
   <path d="M46,11 L54,15 M54,11 L46,15" stroke="#1a1a1a" stroke-width="1.5"/>`,

  // Day 14 – Superhero City: eye mask
  `<rect x="26" y="36" width="48" height="13" rx="6" fill="#CC0000"/>
   <ellipse cx="40" cy="42" r="7" fill="#CC0000"/>
   <ellipse cx="60" cy="42" r="7" fill="#CC0000"/>
   <ellipse cx="40" cy="42" r="4" fill="white"/>
   <ellipse cx="60" cy="42" r="4" fill="white"/>`,

  // Day 15 – Math Champions: trophy hat
  `<ellipse cx="50" cy="18" rx="22" ry="5" fill="#FFD700"/>
   <path d="M30,10 L32,20 Q50,26 68,20 L70,10 Q60,16 50,14 Q40,16 30,10Z" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>
   <text x="50" y="17" text-anchor="middle" font-size="9" fill="#7B4A00" font-weight="bold">★</text>`,
];

export const getCostumeSVG = (day) => COSTUMES[day - 1] ?? COSTUMES[0];

// ============================================================
// DOM API — implemented in Task 6
// ============================================================
export const createMascot = (_day) => ({ react: () => {}, celebrate: () => {} });
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose
```

Expected: both `getCostumeSVG` tests PASS, all prior tests still PASS.

- [ ] **Step 5: Commit**

```bash
git add assets/js/ui/mascot.js tests/unit/mascot.test.js
git commit -m "feat: add mascot costume data and getCostumeSVG (TDD)"
```

---

## Task 5: Mascot CSS

**Files:**
- Create: `assets/css/mascot.css`

- [ ] **Step 1: Create mascot.css with all keyframes and layout**

Create `assets/css/mascot.css`:

```css
/* ============================================================
   MASCOT WRAPPER & SVG
   ============================================================ */
#mascot-wrap {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 100;
  pointer-events: none;
}

.mascot-svg {
  width: 80px;
  height: 96px;
  display: block;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
}

@media (max-width: 640px) {
  .mascot-svg { width: 60px; height: 72px; }
}

/* ============================================================
   MASCOT REACTIONS
   ============================================================ */
.mascot--wave   { animation: mascot-wave   0.7s ease-out; }
.mascot--bounce { animation: mascot-bounce 0.5s ease-out; }
.mascot--cheer  { animation: mascot-cheer  0.9s ease-out; }

@keyframes mascot-wave {
  0%,100% { transform: rotate(0deg) translateY(0);    transform-origin: center bottom; }
  20%     { transform: rotate(-12deg) translateY(-4px); }
  50%     { transform: rotate(12deg)  translateY(-4px); }
  80%     { transform: rotate(-6deg)  translateY(-2px); }
}

@keyframes mascot-bounce {
  0%,100% { transform: translateY(0);    }
  30%     { transform: translateY(-20px); }
  60%     { transform: translateY(-8px);  }
}

@keyframes mascot-cheer {
  0%   { transform: translateY(0)     scale(1);    }
  20%  { transform: translateY(-24px) scale(1.1);  }
  40%  { transform: translateY(-10px) scale(1.05); }
  60%  { transform: translateY(-18px) scale(1.08); }
  80%  { transform: translateY(-5px)  scale(1.02); }
  100% { transform: translateY(0)     scale(1);    }
}

/* ============================================================
   FLOATING CONFETTI — cheer reaction (fixed position, brief)
   ============================================================ */
.mascot-float-confetti {
  position: fixed;
  pointer-events: none;
  z-index: 500;
  animation: float-confetti-fall 0.8s ease-out forwards;
}

@keyframes float-confetti-fall {
  0%   { transform: translateY(0)     rotate(0deg);   opacity: 1; }
  100% { transform: translateY(100px) rotate(180deg); opacity: 0; }
}

/* ============================================================
   CELEBRATION OVERLAY — day complete
   ============================================================ */
#mascot-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  animation: overlay-fade-in 0.3s ease-out;
}

@keyframes overlay-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.mascot-overlay__inner {
  background: white;
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: overlay-pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1);
  position: relative;
  z-index: 1;
}

@keyframes overlay-pop-in {
  from { transform: scale(0.6); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.mascot-overlay__char .mascot-svg {
  width: 140px;
  height: 168px;
  animation: mascot-cheer 0.9s ease-out 0.3s both;
}

.mascot-overlay__msg {
  font-size: 1.6rem;
  font-weight: 800;
  color: #2d6df6;
  margin: 0;
}

/* ============================================================
   FULL CONFETTI — day complete overlay
   ============================================================ */
.mascot-confetti-full {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 8999;
  overflow: hidden;
}

.mascot-confetti-piece {
  position: absolute;
  top: -20px;
  animation: full-confetti-fall linear forwards;
}

@keyframes full-confetti-fall {
  0%   { transform: translateY(0)      rotate(0deg);   opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateY(105vh)  rotate(720deg); opacity: 0; }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/mascot.css
git commit -m "feat: add mascot CSS keyframes, overlay, and confetti styles"
```

---

## Task 6: Mascot SVG Builder + DOM API

**Files:**
- Modify: `assets/js/ui/mascot.js` (replace the stub `createMascot` with full implementation)

- [ ] **Step 1: Replace createMascot stub with full implementation**

In `assets/js/ui/mascot.js`, replace everything from the `// DOM API` comment onward (the `export const createMascot` stub at the bottom) with:

```js
// ============================================================
// SVG BUILDER
// ============================================================

function buildSVG(day) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" class="mascot-svg">
  <circle cx="26" cy="22" r="12" fill="#F5C842" stroke="#D4A520" stroke-width="1.5"/>
  <circle cx="74" cy="22" r="12" fill="#F5C842" stroke="#D4A520" stroke-width="1.5"/>
  <circle cx="26" cy="22" r="6" fill="#FFAAB0"/>
  <circle cx="74" cy="22" r="6" fill="#FFAAB0"/>
  <ellipse cx="50" cy="97" rx="24" ry="20" fill="#F5C842" stroke="#D4A520" stroke-width="1.5"/>
  <ellipse cx="50" cy="99" rx="14" ry="12" fill="#FFE07A"/>
  <ellipse cx="22" cy="88" rx="7" ry="13" fill="#F5C842" stroke="#D4A520" stroke-width="1.5" transform="rotate(-20 22 88)"/>
  <ellipse cx="78" cy="88" rx="7" ry="13" fill="#F5C842" stroke="#D4A520" stroke-width="1.5" transform="rotate(20 78 88)"/>
  <circle cx="50" cy="46" r="32" fill="#F5C842" stroke="#D4A520" stroke-width="1.5"/>
  <circle cx="40" cy="42" r="5" fill="#1a1a1a"/>
  <circle cx="60" cy="42" r="5" fill="#1a1a1a"/>
  <circle cx="42" cy="40" r="1.8" fill="white"/>
  <circle cx="62" cy="40" r="1.8" fill="white"/>
  <ellipse cx="50" cy="52" rx="4" ry="3" fill="#D4735A"/>
  <path d="M42,56 Q50,64 58,56" stroke="#1a1a1a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g>${getCostumeSVG(day)}</g>
</svg>`;
}

// ============================================================
// CONFETTI HELPERS
// ============================================================

const CONFETTI_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9f43'];

function addFloatingConfetti() {
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'mascot-float-confetti';
    p.style.cssText = [
      `left:${Math.round(5 + Math.random() * 90)}%`,
      `top:${Math.round(10 + Math.random() * 50)}%`,
      `background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}`,
      `animation-delay:${(Math.random() * 0.2).toFixed(2)}s`,
      `width:${Math.round(6 + Math.random() * 6)}px`,
      `height:${Math.round(6 + Math.random() * 6)}px`,
      `border-radius:${Math.random() > 0.5 ? '50%' : '2px'}`,
    ].join(';');
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove(), { once: true });
  }
}

function makeFullConfetti() {
  const wrap = document.createElement('div');
  wrap.className = 'mascot-confetti-full';
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'mascot-confetti-piece';
    p.style.cssText = [
      `left:${(Math.random() * 100).toFixed(1)}%`,
      `background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}`,
      `animation-delay:${(Math.random() * 1).toFixed(2)}s`,
      `animation-duration:${(1.2 + Math.random() * 1.2).toFixed(2)}s`,
      `width:${Math.round(6 + Math.random() * 8)}px`,
      `height:${Math.round(6 + Math.random() * 8)}px`,
      `border-radius:${Math.random() > 0.5 ? '50%' : '2px'}`,
    ].join(';');
    wrap.appendChild(p);
  }
  return wrap;
}

// ============================================================
// DOM API
// ============================================================

export const createMascot = (day) => {
  const wrap = document.getElementById('mascot-wrap');
  if (!wrap) return { react: () => {}, celebrate: () => {} };

  wrap.innerHTML = buildSVG(day);
  const svg = wrap.querySelector('.mascot-svg');

  const react = (type) => {
    svg.classList.remove('mascot--wave', 'mascot--bounce', 'mascot--cheer');
    void svg.offsetWidth; // force reflow to restart animation
    svg.classList.add(`mascot--${type}`);
    svg.addEventListener('animationend', () => svg.classList.remove(`mascot--${type}`), { once: true });
    if (type === 'cheer') addFloatingConfetti();
  };

  const celebrate = () => {
    const overlay = document.createElement('div');
    overlay.id = 'mascot-overlay';
    overlay.innerHTML = `
      <div class="mascot-overlay__inner">
        <div class="mascot-overlay__char">${buildSVG(day)}</div>
        <p class="mascot-overlay__msg">Amazing job! ⭐</p>
        <button class="btn btn-primary mascot-overlay__dismiss">Keep going!</button>
      </div>`;
    overlay.appendChild(makeFullConfetti());
    document.body.appendChild(overlay);
    overlay.querySelector('.mascot-overlay__dismiss').onclick = () => overlay.remove();
  };

  return { react, celebrate };
};
```

- [ ] **Step 2: Run all tests to confirm getCostumeSVG tests still pass**

```bash
npm test -- --reporter=verbose
```

Expected: all tests PASS (the `createMascot` stub is replaced but `getCostumeSVG` is unchanged).

- [ ] **Step 3: Commit**

```bash
git add assets/js/ui/mascot.js
git commit -m "feat: implement mascot SVG builder, confetti helpers, and createMascot DOM API"
```

---

## Task 7: Wire mascot and renderMath into day.html + render-day.js

**Files:**
- Modify: `day.html`
- Modify: `assets/js/ui/render-day.js`

- [ ] **Step 1: Update day.html — add CSS link and mascot wrapper**

In `day.html`, add the mascot CSS link in `<head>`, directly after the existing stylesheet link:

```html
  <link rel="stylesheet" href="assets/style.css" />
  <link rel="stylesheet" href="assets/css/mascot.css" />
```

Add `<div id="mascot-wrap"></div>` just before `</body>`:

```html
  <script type="module" src="assets/js/app.js"></script>
  <div id="mascot-wrap"></div>
</body>
```

- [ ] **Step 2: Add createMascot import to render-day.js**

In `assets/js/ui/render-day.js`, add the mascot import after the existing imports (after the `renderMath` import added in Task 3):

```js
import { createMascot } from './mascot.js';
```

- [ ] **Step 3: Initialise mascot at page load**

In `renderDayPage`, add this line immediately after the `let timerInterval = null;` declaration (around line 21):

```js
const mascot = createMascot(day);
```

- [ ] **Step 4: React on session buttons**

In the `data-start-session` forEach handler, add `mascot.react('wave')` after the existing `restartTimerTicker()` call:

```js
  document.querySelectorAll('[data-start-session]').forEach((btn) => {
    btn.onclick = () => {
      session = btn.dataset.startSession;
      section = CATEGORY_ORDER[0];
      document.querySelector('[data-session-title]').textContent = `${session === SESSION_KEYS[0] ? 'Morning' : 'Afternoon'} Session`;
      startTimer(state, day, session, section);
      saveState(state);
      renderSection();
      renderPills();
      restartTimerTicker();
      mascot.react('wave');
    };
  });
```

- [ ] **Step 5: React on Get 5 More button**

In `renderSection`, in the `data-get-bonus` onclick handler, add `mascot.react('bounce')` after the `renderSection()` call:

```js
    sectionWrap.querySelector('[data-get-bonus]').onclick = () => {
      const nextAttempt = attempts.length + 1;
      if (nextAttempt > 3) return;
      const questions = getBonusQuestions({ day, session, category: section, attempt: nextAttempt });
      const entry = { day, session, section, attempt: nextAttempt, source: SCORE_SOURCE.BONUS, generatedAt: new Date().toISOString(), questions };
      state.bonusAttempts[bonusKey] = [...attempts, entry];
      saveState(state);
      renderSection();
      mascot.react('bounce');
    };
```

- [ ] **Step 6: React on Next Section / Finish Session**

In `renderSection`, in the `data-next` onclick handler, add the mascot reactions at the end of the handler (after `renderPills()`):

```js
    sectionWrap.querySelector('[data-next]').onclick = () => {
      stopTimer(state);
      markSectionCompleted(state, day, session, section);
      const idx = CATEGORY_ORDER.indexOf(section);
      if (idx < CATEGORY_ORDER.length - 1) {
        section = CATEGORY_ORDER[idx + 1];
        startTimer(state, day, session, section);
        state.activeSession = session;
        state.activeSection = section;
      }
      saveState(state);
      if (idx < CATEGORY_ORDER.length - 1) renderSection();
      else document.querySelector('[data-session-content]').innerHTML = '<section class="card"><h3>Session complete! \u2705</h3></section>';
      recalcDay(state, day);
      renderSessionTimer();
      if (dayProgress.dayCompleted) document.querySelector('[data-finish-day]').classList.remove('hidden');
      renderPills();
      if (idx < CATEGORY_ORDER.length - 1) mascot.react('bounce');
      else mascot.react('cheer');
    };
```

- [ ] **Step 7: Celebrate on day complete**

In the `data-finish-day-btn` onclick handler, add `mascot.celebrate()` after the `if (complete) saveState(state)` line:

```js
  document.querySelector('[data-finish-day-btn]').onclick = () => {
    recalcDay(state, day);
    const complete = getDayProgress(state, day).dayCompleted;
    document.querySelector('[data-finish-day-msg]').textContent = complete ? 'Day complete! Fantastic perseverance!' : 'Complete both sessions first.';
    if (complete) {
      saveState(state);
      mascot.celebrate();
    }
  };
```

- [ ] **Step 8: Run all tests to confirm nothing broke**

```bash
npm test -- --reporter=verbose
```

Expected: all tests PASS.

- [ ] **Step 9: Commit**

```bash
git add day.html assets/js/ui/render-day.js
git commit -m "feat: wire mascot and renderMath into day page — reactions and celebration complete"
```

---

## Task 8: Final Verification

- [ ] **Step 1: Run full test suite one last time**

```bash
npm test -- --reporter=verbose
```

Expected output (all PASS):
```
✓ tests/unit/math-renderer.test.js (6)
✓ tests/unit/mascot.test.js (2)
✓ tests/unit/app.unit.test.js (4)
```

- [ ] **Step 2: Open day.html in a browser and verify visually**

Open `day.html?day=2` in a browser (via a local server or directly). Verify:
- [ ] Mascot bear appears bottom-right with safari hat
- [ ] Math questions show larger text with colored operators
- [ ] Clicking "Morning Session" triggers a wave animation
- [ ] Clicking "Next Section" triggers a bounce
- [ ] Clicking "Finish Session" (last section) triggers a cheer + floating confetti
- [ ] Marking a day complete triggers the full-screen overlay

To serve locally:
```bash
npx serve . -p 3000
# Then open http://localhost:3000/day.html?day=2
```

- [ ] **Step 3: Final commit if any last tweaks were made**

```bash
git add -p  # stage only intentional changes
git commit -m "fix: visual tweaks from manual verification"
```
