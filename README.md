# UX Research Tool — Poker Platform

A fully client-side UX research tool for conducting user testing sessions and visualising insights.

## Getting Started

```bash
npm install
npm run dev
```

App runs at **http://localhost:5173**

## Notes

- All session data persists in **localStorage**
- To reset all data: open browser DevTools → Application → Local Storage → clear all keys starting with `ux-research-`
- No backend required

## Tech Stack

- React 18 + Vite
- Tailwind CSS (dark poker theme)
- Recharts
- Zustand (state + localStorage persistence)
- React Router v6
- react-hot-toast
