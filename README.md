# The Date Request™

A playful, mobile-first single-page date invitation for Nomin-Erdene from Tumendelger. It uses React, TypeScript, and Vite with no backend and no tracking.

## Run it

```bash
npm install
npm run dev
```

Open the local URL printed by the development server. For a production check:

```bash
npm run lint
npm run build
npm run start
```

## Customize it

All names, visible copy, date ideas, storage keys, and timing values are grouped in the clearly labeled `CONFIG` object at the top of `src/config.ts`.

Submitted answers are stored only in the visitor's browser using `localStorage`. Nothing is uploaded or sent anywhere. The copy and share controls use browser APIs with compatibility fallbacks.

## Accessibility notes

- The No-button joke runs only three times for pointer/touch users, never moves while keyboard-focused, stops immediately with Escape, and is skipped when reduced motion is requested.
- All form controls have explicit labels, visible focus states, validation feedback, and comfortable touch targets.
- Dynamic reactions and confirmations are announced through an ARIA live region.
