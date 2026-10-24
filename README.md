# Amidakuji Ladder Game

A small, browser-based ladder lottery built with Next.js, React and TypeScript. Name your participants and outcomes, generate a ladder, then follow the paths to discover the pairings.

## Play

- Choose 2–12 participants and 1–6 minimum rungs between neighboring columns.
- Edit the start and end labels, or shuffle either list.
- Select **Generate ladder** to create a draw. Editing the form does not change that draw until you generate again.
- **Show solution** reveals the results without regenerating the ladder. Select a result to isolate its path; select it again to show all paths.
- Copy the results with **Copy results**. If clipboard permission is unavailable, the result list remains selectable.
- On small screens, the form and diagram stack vertically. Large ladders scroll within the diagram, including with the keyboard.

Each outcome is assigned exactly once. Duplicate labels are allowed; column and result numbers distinguish entries. Labels are limited to 40 characters and cannot be blank. Draws are kept in memory and reset when the page reloads.

This is a casual choice/game tool. It uses `Math.random` and does not guarantee a uniform distribution over all possible pairings; it is not a cryptographically secure lottery.

## Development

Use Node.js 20 or newer and npm (the lockfile is committed).

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

```sh
npm test            # Engine tests: limits, 2,640 seeded draws, unique outcomes, no mutation
npm run lint
npm run typecheck
npm run build
npm run start       # Serve the production build
```

Browser regression tests:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

The browser suite starts its own production server on port 3100, using the preceding build. To use an installed Microsoft Edge on Windows, set `$env:PLAYWRIGHT_CHANNEL = 'msedge'` before running it. The tests exercise stable reveal/hide, draft isolation, copied results, clipboard denial, invalid labels, maximum size/density, and mobile overflow. CI runs these checks for pull requests and pushes to `main`.

## Code map

- `src/lib/ladder.ts`: validated setup, Fisher–Yates shuffle, bounded generation and pure path tracing.
- `src/app/page.tsx`: draft configuration and the current draw snapshot. Generation is the only action that creates a random ladder.
- `src/components/AmidakujiInputForm.tsx`: labeled inputs and configuration controls.
- `src/components/Amidakuji.tsx`: scalable SVG, derived from the stored ladder.
- `src/components/DrawResults.tsx`: readable outcomes, path selection and clipboard feedback.

Each rung is a neighboring-column index in top-to-bottom order. Generation allocates distinct levels directly, without collision retries or a fixed ceiling of ten levels. Each gap gets the requested minimum plus zero or one random extra rung, avoiding a fixed permutation parity. Both the diagram and results use the same `tracePath` function.

## Deployment

The existing GitHub Pages workflow configures Next.js for static export and publishes the `out` directory. This app has no server-side data, accounts, or external game service. Next.js is pinned to the latest available 14.x patch at the time of this change (14.2.35); a future major-version upgrade remains a separate migration.
