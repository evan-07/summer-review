# Plan: Fix Mojibaked Header Text and Header Structural Issues



## Context

The summer-review app ships several compounding header problems. The most urgent is visible mojibake: raw multi-byte Unicode characters (emoji, arrows, bullet, em dash) are embedded directly in HTML and JS files. If the browser or server disagrees with the declared UTF-8 charset, these appear as garbled glyphs before any interaction. Alongside that, the day-page sticky header loses page identity on scroll, the mobile header CSS override is silently broken (grid property on a flex container), and the header information architecture varies wildly across pages.



Branch: `claude/fix-mojibaked-header-text-0jINL`



---



## Changes



### 1. Fix mojibake — replace raw Unicode with safe equivalents



**`index.html` line 16**

```html

<!-- before -->

<h1>Pick Your Day 🎒</h1>

<!-- after -->

<h1>Pick Your Day &#x1F392;</h1>

```



**`day.html` lines 6, 14-16**

```html

<!-- line 6 -->

<title>Day &bull; Grade 2 Math Adventure</title>



<!-- line 14 -->

<a class="btn" href="index.html">&#x1F3E0; Home</a>



<!-- line 15 -->

<a class="btn" data-prev-day href="#">&larr; Prev</a>



<!-- line 16 -->

<a class="btn" data-next-day href="#">Next &rarr;</a>

```



**`parent.html` line 10** — fixed in §4 (IA restructure) below



**`assets/js/ui/render-day.js` line 20** — replace raw em dash with `\u2014`

```js

document.querySelector('[data-day-title]').textContent = `Day ${day} ${cfg.theme.icon} \u2014 ${cfg.theme.name}`;

```



---



### 2. Sticky header preserves day identity (High)



Add a `data-header-day-title` span inside `nav-left` in **`day.html`**:

```html

<div class="nav-left">

  <strong>Grade 2 Math Adventure</strong>

  <span data-header-day-title></span>

</div>

```



In **`render-day.js`** (after line 20), populate it:

```js

document.querySelector('[data-header-day-title]').textContent = `Day ${day} \u2014 ${cfg.theme.name}`;

```



Add a CSS rule in **`assets/css/layout.css`**:

```css

[data-header-day-title]{font-size:.85rem;color:#555;padding-left:4px}

```



---



### 3. Fix broken mobile header layout (Medium)



**`assets/css/layout.css` line 9** — current `grid-template-columns:1fr` applied to a flex container (`.session-buttons`) is silently ignored. Fix:

```css

/* before */

@media (max-width:900px){.day-grid,.parent-layout,.parent-form-grid,.session-buttons{grid-template-columns:1fr}.progress-tracker{grid-template-columns:repeat(5,minmax(0,1fr))}}



/* after */

@media (max-width:900px){.day-grid,.parent-layout,.parent-form-grid{grid-template-columns:1fr}.progress-tracker{grid-template-columns:repeat(5,minmax(0,1fr))}.session-buttons{flex-direction:column;align-items:stretch}}

```



Additionally, the `flex:1 1 220px` on `.button-group--stack-mobile > *` (line 6) forces header nav buttons to a minimum 220px width, causing them to wrap into a ragged multi-row block on smaller screens. This is addressed by the IA restructure in §4 (which removes the `button-group--stack-mobile` class from the header). The CSS rule on line 6 can remain for any other non-header use, but can be tightened to `flex:1 1 auto` to be safer:

```css

.button-group--stack-mobile > *{flex:1 1 auto}

```



---



### 4. Consistent header IA across pages (Medium)



**Pattern: brand/identity on the left, context/actions on the right.**



**`day.html` header** — move navigation controls from `nav-left` to `nav-right`, keep brand + day-label in `nav-left`. This also eliminates `button-group--stack-mobile` from the header (fixing the 220px wrapping bug):

```html

<header class="top-nav">

  <div class="nav-left">

    <strong>Grade 2 Math Adventure</strong>

    <span data-header-day-title></span>

  </div>

  <div class="nav-right">

    <a class="btn" href="index.html">&#x1F3E0; Home</a>

    <a class="btn" data-prev-day href="#">&larr; Prev</a>

    <a class="btn" data-next-day href="#">Next &rarr;</a>

    <label>Go to Day: <select data-day-jump></select></label>

    <a class="btn" data-parent-link href="parent.html">Parent Dashboard</a>

  </div>

</header>

```



**`parent.html` line 10** — split single inline row into `nav-left` (brand) and `nav-right` (home action), replace raw emoji:

```html

<header class="top-nav">

  <div class="nav-left"><strong>Parent Dashboard</strong></div>

  <div class="nav-right"><a class="btn" href="index.html">&#x1F3E0; Home</a></div>

</header>

```



---



## Critical Files

- `index.html` — line 16

- `day.html` — lines 6, 10-23 (header restructure)

- `parent.html` — line 10

- `assets/js/ui/render-day.js` — lines 20-21 (mojibake fix + header day-title update)

- `assets/css/layout.css` — lines 6 and 9



## Verification

1. Open `index.html` in a browser (file:// or local server); `<h1>` should show backpack emoji without any garbled chars

2. Open `day.html?day=3`; header should show "Grade 2 Math Adventure · Day 3 — [theme]" before scrolling; after scrolling past the hero card the sticky header should still show the day label

3. On `parent.html`, brand should appear left, Home button right

4. Resize browser to 390px width; session-start buttons should stack vertically without overflow; header controls should wrap but remain readable

5. Run `npx playwright test` once Playwright browsers are installed (existing responsive no-overflow tests should still pass; header content assertions will need to be added separately)

