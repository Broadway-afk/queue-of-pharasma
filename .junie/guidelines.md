# Agent Guidelines for Pathfinder Tracker

## Project Overview
This is a small utility for tracking initiative of players and monsters in Pathfinder 2e roleplaying games. The goal is to provide a smooth, low-contrast, and eye-friendly interface for GMs during sessions.

## Tech Stack
- **Framework**: Vue 3.5+ (Composition API, `<script setup>`)
- **UI Library**: Nuxt UI v4 (Vite version)
- **Styling**: Tailwind CSS 4
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite

## Coding Standards

### 1. UI Components (Nuxt UI)
- **Always prefer Nuxt UI components** over raw HTML or custom components.
- Use `UApp` as the root wrapper (already in `App.vue`).
- Use `UButton`, `UCard`, `UInput`, `UIcon`, `UBadge`, etc., for all UI elements.
- Customization should be done via Nuxt UI component props (`color`, `variant`, `size`) first, then via Tailwind utility classes in `class` attribute.

### 2. Styling (Tailwind CSS 4)
- **Use Theme Variables**: Always use the semantic colors `primary` and `neutral`.
  - `primary` is mapped to **Teal** (soft and pleasant).
  - `neutral` is mapped to **Stone** (warm and low-contrast).
- **Avoid High Contrast**: 
  - Do not use absolute white (`#fff`) or absolute black (`#000`) for backgrounds.
  - Use `bg-neutral-50` for light mode and `bg-neutral-900` for dark mode.
  - Text should be `text-neutral-800` (light) or `text-neutral-200` (dark).
- **Responsive Design**: Use Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`) to ensure the tracker works well on tablets and laptops.

### 3. Icons
- Use the `UIcon` component with Heroicons (e.g., `i-heroicons-bolt`) or Simple Icons (e.g., `i-simple-icons-vuedotjs`).

### 4. State Management
- Use Pinia stores located in `src/stores/`.
- Logic for initiative tracking, turn order, and status effects should reside in stores.

### 5. Color Mode
- The project supports light and dark modes.
- Logic is managed in `App.vue`. Always ensure new components look good in both modes using `dark:` prefix where manual overrides are needed.

## Initiative Tracking Logic (Upcoming)
- Players and monsters should have `name`, `initiative` (total), and `perception/stealth` base.
- The list should be sortable by initiative value.
- Support for "Delayed" or "Readied" actions by moving units in the initiative order.
