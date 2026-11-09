# Agent guidelines

Pharasma's Queue is a small Pathfinder 2e helper for tracking initiative of players and monsters, plus an editable character sheet. The goal is a smooth, low-contrast, eye-friendly UI for GMs during sessions.

Prefer the real product surfaces and stack below over inventing unfinished features.

## Product surfaces

| Route | Purpose |
|-------|---------|
| `/tracker` | Initiative queue, pawn library, conditions on characters |
| `/charsheet` | Editable PF2e character sheet with JSON import/export |

Persistence is browser `localStorage` only (no cloud sync). Tracker state is not file-exported; charsheet supports JSON import/export.

Tracker units use `name`, initiative total (modifier + roll), HP/AC, and attached conditions. The list is sortable by initiative. Do **not** add Delayed / Readied initiative modes, separate perception/stealth bases on tracker units, or other mechanics that are not already in the stores/UI unless the user asks for them.

## Tech stack

- **Framework**: Vue 3.5+ (Composition API, `<script setup>`)
- **UI library**: Nuxt UI v4 (Vite version, `@nuxt/ui/vite`)
- **Styling**: Tailwind CSS 4 (`src/assets/main.css`)
- **State**: Pinia (`src/stores/`)
- **Routing**: Vue Router (`src/router/index.ts`)
- **Build**: Vite 8
- **Tests**: Vitest

## Coding standards

### 1. UI components (Nuxt UI)

- **Always prefer Nuxt UI components** over raw HTML or custom components.
- Use `UApp` as the root wrapper (already in `App.vue`).
- Use `UButton`, `UCard`, `UInput`, `UIcon`, `UBadge`, etc., for all UI elements.
- Customize via Nuxt UI component props (`color`, `variant`, `size`) first, then via Tailwind utility classes in `class`.

### 2. Styling (Tailwind CSS 4)

- **Use theme variables**: always prefer semantic colors `primary` and `neutral`.
  - `primary` is mapped to **Teal** (soft and pleasant).
  - `neutral` is mapped to **mist/stone** (warm, low-contrast).
- **Avoid high contrast**:
  - Do not use absolute white (`#fff`) or absolute black (`#000`) for backgrounds.
  - Prefer `bg-neutral-50` (light) and `bg-neutral-900` (dark) for chrome/surfaces.
  - Text should be `text-neutral-800` (light) or `text-neutral-200` (dark).
  - Page shell in `App.vue` currently uses `bg-slate-100` / `dark:bg-stone-950`; match nearby patterns when editing layout.
- **Responsive design**: use Tailwind modifiers (`sm:`, `md:`, `lg:`) so the tracker works well on tablets and laptops.

### 3. Icons

- Use the `UIcon` component with Heroicons (e.g. `i-heroicons-bolt`) or Simple Icons (e.g. `i-simple-icons-vuedotjs`).

### 4. State management

- Use Pinia stores in `src/stores/`.
- Logic for initiative tracking, turn order, pawns, conditions/status effects, and charsheet data should reside in stores.
- Keep domain helpers in `src/utils/` (with Vitest specs where present).

### 5. Color mode

- The project supports light and dark modes.
- Logic is managed in `App.vue` (`pharasma-color-mode` in `localStorage`).
- Always ensure new components look good in both modes; use the `dark:` prefix where manual overrides are needed.

### 6. Language

- Primary user-facing copy is Russian; some chrome (nav labels like Tracker) is English.
- Match the surrounding UI language when editing strings.

## Docs

- User/setup docs: [`README.md`](README.md)
- This file is the source of truth for agent/contributor coding guidelines
- [`.junie/guidelines.md`](.junie/guidelines.md) points here for JetBrains Junie
