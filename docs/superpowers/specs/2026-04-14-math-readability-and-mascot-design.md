# Design Spec: Math Readability & Mascot Animation System

**Date:** 2026-04-14
**Status:** Approved

---

## Overview

Two connected improvements to the Grade 2 Math Adventure app:

1. **Math readability** — color-coded bold operators, larger question text, better spacing
2. **Mascot animation system** — a persistent SVG character with day-themed costumes that reacts to student interactions (Duolingo-style)

Both are fully compatible with the existing static GitHub Pages deployment. No build step, no CDN dependencies added.

---

## 1. Math Readability

### Operator Rendering

A new utility `assets/js/ui/math-renderer.js` exports one function:

```js
renderMath(str) → HTMLstring
```

It takes a raw question string (e.g. `"24 + 13"`) and returns HTML with operators wrapped in styled spans:

```html
24 <span class="op op--plus">+</span> 13
```

**Operator classes (in `assets/css/components.css`):**

| Class | Symbol | Color | Weight |
|---|---|---|---|
| `.op--plus` | `+` | `#20a84a` (green) | 900 |
| `.op--minus` | `-` | `#e05c00` (orange-red) | 900 |
| `.op--times` | `×` | `#7e44c0` (purple) | 900 |

All `.op` elements also get `font-size: 1.2em` relative to surrounding text so operators visually pop without disrupting line height.

### Question Text Size and Spacing

The `<ol>` inside each section card gets:
- `font-size: 1.25rem`
- `line-height: 2`
- `letter-spacing: 0.01em`

Each `<li>` gets:
- `margin-bottom: 0.5rem`
- `padding: 4px 0`

### Integration Point

`renderMath()` is called in `render-day.js` when building the `<li>` list — replacing the current plain `${q}` string interpolation with `renderMath(q)`.

---

## 2. Mascot System

### Character Design

A single friendly SVG animal (round-faced cat/bear style) built entirely from SVG primitives (circles, paths, ellipses). No external image assets. Fully self-hosted.

### Costume System

Each of the 15 day themes maps to a small SVG `<g>` overlay (hat, accessory) that sits on top of the base character. Examples:

| Day | Theme | Costume |
|---|---|---|
| 1 | Nature Forest | Leaf crown |
| 2 | Safari Animals | Safari hat |
| 3 | Ocean Friends | Snorkel mask |
| 4 | Dinosaur Land | Dino horn headband |
| 5 | Splash Coast | Sun hat |
| 6 | Sky Aircraft | Pilot goggles |
| 7 | Jungle Adventure | Vine headband |
| 8 | Farm Day | Straw hat |
| 9 | Arctic Animals | Earmuffs |
| 10 | Puzzle Planet | Jigsaw-piece hat |
| 11 | Castle Quest | Crown |
| 12 | Robot Lab | Antenna headband |
| 13 | Pirate Bay | Pirate hat |
| 14 | Superhero City | Cape + mask |
| 15 | Math Champions | Trophy hat |

`setCostume(day)` swaps the overlay `<g>` element.

### Reaction API

`createMascot(day)` is called once at page load and returns a mascot controller object.

| Method | Trigger | Animation |
|---|---|---|
| `mascot.react('wave')` | Morning/Afternoon session button clicked | Arm waves up once |
| `mascot.react('bounce')` | "Next Section" or "Get 5 More" clicked | Character bounces up and lands |
| `mascot.react('cheer')` | Section completed | Jumps with arms up, confetti contained in card area |
| `mascot.celebrate()` | Day marked complete | Full-screen overlay: large mascot + falling confetti + "Amazing job!" + dismiss button |

### Layout

The mascot wrapper is `position: fixed; bottom: 16px; right: 16px` — stays visible while scrolling. Scales to 64px width on mobile.

---

## 3. Architecture

### New Files

| File | Purpose |
|---|---|
| `assets/js/ui/math-renderer.js` | `renderMath(str)` — wraps operators in styled spans |
| `assets/js/ui/mascot.js` | SVG character, costume system, reaction + celebrate API |
| `assets/css/mascot.css` | All mascot keyframes and layout rules |

### Modified Files

| File | Change |
|---|---|
| `assets/js/ui/render-day.js` | Import `createMascot`, call on load; import `renderMath`, use in `<li>` rendering; add `mascot.react()` to button handlers |
| `assets/css/components.css` | Add `.op`, `.op--plus`, `.op--minus`, `.op--times` rules; increase `ol li` font size and spacing |
| `day.html` | Add `<link>` for `mascot.css`; add `<div id="mascot-wrap">` to body |

### Unchanged Files

`index.html`, `parent.html`, `question-bank.js`, `config.js`, `state.js`, `storage.js`, `storage.js`, `bonus-generators.js`, `generators.js`, `progress.js`, `timer.js`, `router.js`, `render-index.js`, `render-parent.js`

---

## 4. GitHub Pages Compatibility

- All additions are static files — no server, no build step required
- No new CDN dependencies introduced
- ES module imports follow the existing `type="module"` pattern already in use
- Inline SVG means zero external image requests
- `mascot.css` is a standard `<link>` stylesheet

---

## 5. Out of Scope

- `index.html` and `parent.html` do not get the mascot (student-facing only)
- No changes to question generation logic or scoring
- No animation on the parent dashboard
