# Summer Review (Static Grade 2 Math App)

## Pass 1 stabilization highlights
- Fixed homepage summary hooks and defensive rendering for `done count`, `active day`, and `total time`.
- Simplified day entry flow so session choices are visible immediately.
- Added a consistent button/layout helper system (`.button-row`, `.button-group`, split/stack variants).
- Improved touch targets and spacing for tracker dots, pills, nav controls, and action rows.
- Preserved parent flow with a working `parent.html` route and resilient rendering in `parent.js`.
- Added lightweight Playwright E2E coverage for home, day, parent, and responsive checks.

## Storage model
Saved in `localStorage` key `g2-math-progress-v4`.

## Run locally
Open `index.html` directly in browser or serve statically.

Example static server:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/index.html`.

## Run tests

```bash
npm install
npx playwright install --with-deps chromium
npm run test:e2e
```

## Container
Build and run:

```bash
docker build -t summer-review .
docker run --rm -p 8080:8080 summer-review
```

Then open `http://localhost:8080`.
