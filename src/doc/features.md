# 🎯 Features & Modules Overview

This document breaks down the major functional areas (features) of the Spotify Clone project, mapping them to their respective directories in `src/features/`.

## 1. Player (`src/features/player`)

The core of the application.

- **PlayerBar.tsx:** The bottom navigation bar handling audio playback, volume control, progress seeking, shuffling, repeating, and queue management.
- **State (`store/playerStore.ts`):** Manages the current track, queue history, playback status (playing/paused), volume levels, and external playback context (e.g., playing from an album vs. playing a single song).

## 2. Library & Layout (`src/app/layout` & `src/store/libraryStore.ts`)

- **WorkspaceLayout.tsx / AppLayout.tsx:** The foundational skeleton containing the Left Menu (Library), the Main Content Area, and the Right Panel (Now Playing details).
- **Library Store:** Manages user's saved/liked songs, custom created playlists, and quick-access pinned items.
- Features dynamic resizing (draggable gutters) between panels, which saves state across sessions using LocalStorage.

## 3. Exploring Content (`src/features/album`, `artist`, `playlist`, `podcast`, `track`)

Detailed views for different entities:

- **ArtistDetailView.tsx:** Displays artist banner, monthly listeners, top tracks, and discography.
- **AlbumDetailView.tsx:** Lists tracks within an album, computes total playtime, and displays the album cover prominently.
- **PlaylistDetailView.tsx:** Handles rendering custom user playlists or liked songs, allowing users to play the entire list sequentially.

## 4. Search (`src/features/search`)

- Integrates with the Header search bar.
- Filters local data (artists, songs, albums) with debounce.
- Displays "Recent Searches" and categorized browse cards.

## 5. Internationalization (i18n)

Full dual-language support (English `en` and Turkish `tr`).

- Located in `src/i18n/`.
- Dynamically switches all text strings, including pluralization (e.g., "1 song" vs. "5 songs") via `react-i18next`.

## 6. Shared Components (`src/shared/components`)

Highly reusable atomic and molecular components used across various features:

- `NowPlayingEqualizer.tsx`: The green animated bars indicating the currently active track.
- `GlobalToast.tsx`: System-wide toast notifications for actions like "Added to Liked Songs" or "Link Copied".
- Badges, Buttons, and customized scrollbars.
