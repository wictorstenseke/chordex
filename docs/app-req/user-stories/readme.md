# SongBook (Chordex) – User Stories

## Structure

- **Architecture**: `architecture/` (data-model, firebase-setup, offline-pwa)
- **Song**: `song/` (create, edit, delete, duplicate, search, tag, live-preview)
- **Setlist**: `setlist/` (create, add-songs, reorder, notes, player-mode)
- **Player**: `player/` (player-mode)
- **Sharing**: `sharing/` (share-song-link, share-setlist-link, shared-song-open, shared-song-save, shared-song-duplicate-prevention)
- **Export**: `export/` (export-library)
- **Security**: `security/` (security-rules)

---

## Completed

1. **Data model** (`architecture/data-model.md`) – TypeScript types in `src/types/songbook.ts` for User, Song, Setlist matching the Firestore schema
2. **Firebase setup** (`architecture/firebase-setup.md`) – Firestore + Auth initialized in `src/lib/firebase.ts`, config via `VITE_FIREBASE_*` env vars (see `.env.example`)
3. **Offline PWA** (`architecture/offline-pwa.md`) – vite-plugin-pwa configured (manifest, service worker, app shell caching), Firestore IndexedDB persistence enabled

---

## What to Do Next

### 1. Create Firebase project (manual)

1. [Firebase Console](https://console.firebase.google.com/) → Create project  
2. Enable **Firestore**  
3. Enable **Authentication** (e.g. Email/Password, Google)  
4. Copy config into `.env` (use `.env.example` as template)

### 2. Firestore security rules

Implement rules per `security/security-rules.md`:
- Users read/write only their own songs and setlists (`ownerId` match)
- Shared links allow read-only access for unlisted documents

### 3. Song management

Start with:
- **Create Song** (`song/song-create.md`) – UI + Firestore write, redirect to edit
- **Edit Song** (`song/song-edit.md`) – ChordPro editor + metadata form, persist changes

Then:
- Search, tag, delete, duplicate, live preview (see `song/`)

### 4. Setlist management

- **Create Setlist** (`setlist/setlist-create.md`) – UI + Firestore write, navigate to detail
- Add songs, reorder, notes (`setlist/`)

### 5. Player mode

- Large typography, swipe/buttons for navigation, optional autoscroll (`player/player-mode.md`)

### 6. Sharing

- Share song/setlist links, open shared song, save to My Songs, duplicate prevention (`sharing/`)

### 7. Export

- Export library as ZIP (`export/export-library.md`)

---

## Suggested order

1. Firebase project + security rules  
2. Create Song → Edit Song → Song list/library view  
3. Create Setlist → Add songs → Reorder  
4. Player mode (single song, then setlist)  
5. Sharing flows  
6. Export library  
