# Summer Review (Pass 2 Architecture)

Static Grade 2 math practice app with a single day template (`day.html?day=N`) and modular JavaScript architecture.

## Project structure

- `index.html` home day picker
- `day.html` single reusable day template
- `parent.html` full parent dashboard
- `assets/css/*` token/base/layout/components/pages CSS modules
- `assets/js/content/*` config + required/bonus generation
- `assets/js/features/*` progress, timer, and parent score logic
- `assets/js/ui/*` page-specific renderers
- `assets/js/storage.js` centralized localStorage + migration
- `assets/js/router.js`, `assets/js/app.js` app entry and routing
- `tests/unit` Vitest unit tests
- `tests/e2e` Playwright E2E coverage

## Single day template

All day links use `day.html?day=N`. `parseDayFromSearch` safely parses and clamps values to day range. Add more days by increasing `TOTAL_DAYS` and adding metadata in `assets/js/content/config.js`.

## Question generation

Required questions come from `getRequiredQuestions` in `assets/js/content/question-bank.js`. Bonus practice comes from `getBonusQuestions` in `assets/js/content/bonus-generators.js` and is stored separately (`bonusAttempts`) with `source: "bonus"` compatibility.

## Parent dashboard

Parents can add/edit/delete score rows with day/session/section/source/notes, filter records, and view summary and trend chart. Scores persist in localStorage.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/index.html`.

## Run tests

```bash
npm install
npm run test
npm run test:e2e
```
