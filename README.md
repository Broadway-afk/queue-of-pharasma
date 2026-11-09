# Pharasma's Queue

Pathfinder 2e session helper for GMs and players: an initiative tracker with conditions and pawns, plus an editable character sheet.

**Live:** [queue-of-pharasma.grik-nota2.workers.dev](https://queue-of-pharasma.grik-nota2.workers.dev/tracker)

## Features

### Tracker (`/tracker`)

- Initiative order with active-turn highlight, next turn, sort, and reroll
- HP / AC on characters
- Pawn library (bundled + custom); drag pawns onto the table
- Optional monster statblock paste when creating a custom pawn
- Conditions library with drag-and-drop onto characters (including valued conditions)
- Persists in `localStorage` (`initiative-characters`, `initiative-active-id`, `active-conditions`, `custom_pawns`)

### Charsheet (`/charsheet`)

- Editable PF2e-style blocks (abilities, AC, HP, saves, skills, strikes, and more)
- Auto-save to `localStorage` (`charsheet-pf2e`)
- JSON import / export and reset

## Requirements

- Node.js `^22.18.0` or `>=24.12.0`

## Setup

```sh
npm install
npm run dev
```

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview the production build |
| `npm run test` | Run Vitest unit tests |
| `npm run type-check` | `vue-tsc` only |

Recommended editor: VS Code / Cursor with [Vue - Official (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Vue DevTools in the browser is helpful for debugging.

## Tech stack

- Vue 3.5 (Composition API, `<script setup>`)
- Vite 8
- Vue Router
- Pinia
- Nuxt UI 4 (Vite)
- Tailwind CSS 4
- Vitest

## Project structure

```text
src/
  views/           TrackerView, CharsheetView
  stores/          initiative, pawns, conditions, charsheet
  components/      tracker UI + components/charsheet/
  data/            conditions.json, pawns.json, charsheetMeta.ts
  utils/           dice, avatar, monsterParser, pf2e, charsheet Io
```

## Contributing

Coding conventions for agents and contributors are in [`AGENTS.md`](AGENTS.md).
