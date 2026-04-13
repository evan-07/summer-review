# Grade 2 Math Adventure

Static web app for Grade 2 math enrichment practice. Fifteen days of progressively harder problems across five categories, with morning and afternoon sessions per day.

## Features

- **Sequential day unlock** - Day 1 is always open; each subsequent day unlocks when the previous day is complete.
- **Two sessions per day** - Morning and afternoon, each with five categories: Easy, Intermediate, Pattern Recognition, Hard, Problem Solving.
- **Bonus practice** - Up to 3 bonus rounds per section, generated on demand.
- **Session timer** - Tracks time spent per session and day.
- **Parent dashboard** - Add, edit, delete, and filter score entries; view trend chart and summary stats.
- **Reset All Progress** - Parent can wipe child progress while keeping score history.
- **Responsive layout** - Works on desktop and mobile.

## Project structure

```
index.html              Day picker (home)
day.html                Day activity page (loaded as ?day=N)
parent.html             Parent dashboard
nginx/default.conf      Nginx config for Docker
assets/
  style.css             CSS entry point (imports all modules)
  css/
    tokens.css          Design tokens (colors, radii, spacing)
    base.css            Reset and body defaults
    layout.css          Grid and flex layouts
    components.css      Cards, buttons, pills, day cards
    pages.css           Page-specific overrides
  js/
    app.js              Entry point - loads state and routes
    router.js           Routes by data-page attribute
    state.js            State shape and getDayProgress helper
    storage.js          localStorage read/write + migration
    content/
      config.js         TOTAL_DAYS, themes, categories, day notes
      generators.js     clampDay, getDayUrl, isDayUnlocked, PRNG
      question-bank.js  getRequiredQuestions
      bonus-generators.js getBonusQuestions
    features/
      progress.js       markSectionCompleted, recalcDay
      timer.js          startTimer, stopTimer
      parent-scores.js  saveParentScore, updateParentScore, deleteParentScore
    ui/
      components.js     formatDuration, renderTracker
      render-index.js   Home page renderer
      render-day.js     Day page renderer
      render-parent.js  Parent dashboard renderer
tests/
  unit/app.unit.test.js Vitest unit tests
  e2e/app.spec.js       Playwright E2E tests
```

## Adding days

Increase `TOTAL_DAYS` in `assets/js/content/config.js` and add a matching entry to the `THEMES`, `DAY_NOTES`, and `INSPIRATION` arrays.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Run with Docker

```bash
docker build -t math-adventure .
docker run -p 8080:8080 math-adventure
```

Open `http://localhost:8080`.

## Run tests

```bash
npm install
npm test              # unit tests (vitest)
npm run test:e2e      # E2E tests (playwright)
```
