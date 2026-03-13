# 🎵 Spotify Clone – Architecture Overview

## 1. Introduction

This project is a feature-rich Spotify Clone built with modern web technologies. The primary goal is to provide a highly scalable, maintainable, and fullstack-ready music player application. The frontend architecture is designed around feature-based modules, ensuring clear boundaries and easy scalability.

## 2. Technology Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** React Router DOM
- **Global State Management:** Zustand
- **Styling:** TailwindCSS
- **Internationalization:** i18next
- **Linting & Formatting:** ESLint & Prettier
- **Git Hooks:** Husky & lint-staged

## 3. High-Level Folder Structure

The `src/` directory is organized into a highly modular, domain-driven structure:

```text
src/
├── app/          # Application bootstrap, routing, and global layout components.
├── assets/       # Static assets.
├── doc/          # Project documentation (like this one).
├── features/     # Feature-based domains (Album, Artist, Player, Playlist, Search, etc.).
├── helpers/      # Utility functions and shared helper logic.
├── i18n/         # Internationalization setup and locale files (en, tr).
├── pages/        # Top-level route components that combine features.
├── services/     # API integration layer (future use).
├── shared/       # Reusable UI components, hooks, and static data.
├── store/        # Global Zustand stores (Player, UI Layout, Library, Toast).
└── utils/        # Constants and generic utilities.
```

## 4. Key Architectural Principles

### 4.1 Feature-Based Design

The `features/` directory contains isolated, self-contained modules for specific domains. For example, the `player` feature has its own components, context, and logic. This prevents the codebase from becoming an unmanageable monolith and prepares it for potential micro-frontend architectures.

### 4.2 State Management Separation

- **Component State:** React `useState` for highly localized, ephemeral UI states.
- **Global Application State:** Zustand is used for complex, shared states such as the music player queue, layout visibility (collapsing panels), and user library. Wait, what about server state? When an actual backend is connected, tools like React Query can be easily integrated alongside Zustand.

### 4.3 Responsive and Dynamic Layouts

The application features a heavily customized AppLayout with a draggable resizer (`WorkspaceLayout.tsx`) that dynamically adjusts the Left Sidebar and Right Sidebar widths, similar to the real Spotify desktop app.

## 5. Next Steps for the Architecture

- Implementation of a real backend, connecting the `services/` layer to a database.
- Transitioning static mock data (`shared/data/`) to dynamic API calls via React Query.
- Adding comprehensive Unit and Integration tests.
