# Summer Review (Static Grade 2 Math App)

## What this version adds
- Section-level count-up timers with persistence.
- Per-section status tracking (`not_started`, `in_progress`, `completed`).
- Resume prompt for in-progress sessions.
- Session summary cards with section timings and totals.
- Parent snapshot panel.
- Focus mode toggle.
- Finish Day gating (unlocked only after both sessions are complete).
- Safe migration from legacy localStorage shape (`{ doneDays, soundOn }`).

## Storage model
Saved in `localStorage` key `g2-math-progress-v3`.

## Run locally
Open `index.html` directly in browser or serve statically.

## Container
Build and run:

```bash
docker build -t summer-review .
docker run --rm -p 8080:8080 summer-review
```

Then open `http://localhost:8080`.
