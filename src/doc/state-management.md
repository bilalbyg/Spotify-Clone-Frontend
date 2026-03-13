# 🔄 State Management Strategy

This document explains the unified state management architecture used throughout the Spotify Clone application. To minimize prop-drilling and maintain a predictable application lifecycle, the project relies heavily on **Zustand**.

## 1. Why Zustand?

Zustand provides a minimalistic, hook-based API that eliminates boilerplates compared to Redux while offering superior performance by preventing unnecessary re-renders. It perfectly maps to our feature-based architecture.

## 2. Store Definitions (`src/store/`)

### 2.1 Player Store (`playerStore.ts`)

The most complex and frequently updated global state machine.

- **State Properties:**
  - `currentTrack`: The currently loaded `PlayerTrack` object.
  - `queue`: Upcoming array of `PlayerTrack`s.
  - `isPlaying`: Boolean reflecting the HTML5 Audio `paused` status.
  - `volume` & `progress`: Number values representing audio playback metrics.
  - `repeatMode` ('off', 'all', 'one') and `shuffle` (boolean).
  - `playbackContext`: Keeps track of whether the user is listening to an album, an artist mix, or a custom playlist.
- **Actions:**
  - `playNextInQueue()`, `playPreviousInQueue()`, `setTrack()`, `setQueue()`.

### 2.2 Layout UI Store (`layoutUiStore.ts`)

Controls the structural UI elements, persisting user preferences using `localStorage`.

- **State Properties:**
  - `isRightPanelCollapsed`: Boolean indicating if the "Now Playing" sidebar is hidden.
  - `isPlayingModeIdle`: Boolean tracking mouse-idle state to enter "Fullscreen Playing/Immersive Mode".
- **Actions:**
  - `setRightPanelCollapsed(state)`, `setPlayingModeIdle(state)`.

### 2.3 Library Store (`libraryStore.ts`)

Handles the user's localized content.

- **State Properties:**
  - `likedSongs`: Array of Track IDs the user has saved.
  - `customPlaylists`: Array of user-created playlists (with name, owner, and `trackIds`).
- **Actions:**
  - `toggleLikedSong(trackId)`, `createPlaylist()`.

### 2.4 Toast Store (`toastStore.ts`)

Manages ephemeral cross-app notifications.

- **State Properties:**
  - `toasts`: Array of active messages.
- **Actions:**
  - `addToast(message, action?)`, `removeToast()`.

## 3. Separation of Concerns

Currently, all data (like `spotifyData` from `src/shared/data/`) is synchronously imported as Mock data. In the future:

1. **Zustand** will handle strict Client-Side interaction states (Audio status, toggles, volumes).
2. **React Query** (or SWR) will be introduced to handle Server State, caching, and background refetching of the music library catalogs and search results from the backend API (`services/api.ts`).

## 4. Subscribing to State

Instead of passing props down 5 levels:

```tsx
// Inside any child component
const isPlaying = usePlayerStore((state) => state.isPlaying);
const togglePlay = usePlayerStore((state) => state.togglePlay);

return <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>;
```

This guarantees atomic re-renders only when `isPlaying` naturally changes.
