# SongBook – Project Idea Collection

## Vision

A clean, lightweight, offline-first web app for managing chord-based songs (ChordPro format),
creating setlists, practicing, and sharing songs with others.

Primary goals:

- Build something fun
- Build something personally useful
- Keep it simple, fast, and offline-capable
- Allow future multi-user sharing & collaboration

---

# 1. Core Architecture

## Tech Stack

- Vite + React + TypeScript
- Firebase:
  - Firestore (data)
  - Auth (users)
- PWA (offline support)
- IndexedDB via Firestore offline persistence

## Offline Strategy

- Firestore offline persistence enabled
- App shell cached (PWA)
- Full song editing available offline
- Sync automatically when connection returns

## Backup Strategy

- Export library as ZIP
  - /songs/<title>.cho (ChordPro)
  - /setlists/<name>.json
  - optional library.json index

---

# 2. Data Model (MVP)

## Users

users/{uid}

- displayName
- createdAt

## Songs

songs/{songId}

- ownerId: uid
- title: string
- artist?: string
- key?: string
- capo?: number
- tempo?: number
- tags?: string[]
- content: string (ChordPro format)
- visibility: "private" | "unlisted" | "group"
- source?: {
  songId: string
  ownerId: string
  importedAt: timestamp
  }
- createdAt
- updatedAt

## Setlists

setlists/{setlistId}

- ownerId: uid
- name: string
- songIds: string[] (ordered)
- notes?: string
- visibility: "private" | "unlisted" | "group"
- createdAt
- updatedAt

---

# 3. Core Features (MVP)

## Song Management

- Create new song
- Edit song (ChordPro editor)
- Live preview (chords rendered above lyrics)
- Search songs
- Tag songs
- Delete song
- Duplicate song

## Setlists

- Create setlist
- Add songs to setlist
- Reorder songs (drag & drop)
- Add notes (tempo/capo comments)
- Player mode for setlist

## Player Mode

- Large typography
- Swipe/next song navigation
- Optional autoscroll
- Dark/light mode

## Sharing (Phase 1)

- Share song via link (read-only)
- Share setlist via link (read-only)

---

# 4. Shared Song Flow

## Opening a Shared Song

- Display in read-only mode
- Banner: "Shared song – read-only"

Actions:

- Save to My Songs (primary)
- Sign in to save (if not authenticated)

## Save to My Songs

- Creates new song owned by current user
- Copies all metadata + content
- Adds source metadata:
  - sourceSongId
  - sourceOwnerId
  - importedAt
- Redirect to Edit mode

## Duplicate Prevention

If user already saved a copy:

- Show "Open My Copy" instead of creating duplicate

---

# 5. Future Collaboration (Phase 2)

## Groups

groups/{groupId}

- name
- members: [{ uid, role }]
  - owner
  - editor
  - viewer

Shared resources:

- Group song library
- Group setlists

## Permissions

- Owner: full control
- Editor: modify content
- Viewer: read-only

---

# 6. Export & Backup

## Export Library

- Generates downloadable ZIP
- All songs as .cho files
- Setlists as JSON or Markdown
- Optionally include metadata file

## Import (future)

- Upload ZIP
- Parse .cho files
- Recreate library

---

# 7. UX Principles

- Extremely clean interface
- Minimal distractions
- Fast load
- Clear mode separation:
  - Edit Mode
  - View Mode
  - Player Mode
- Works fully offline
- No unnecessary complexity

---

# 8. Optional Advanced Features (Later)

- Chord transpose (+/-)
- Auto-detect chords
- Nashville number system
- Lyrics-only projection mode
- Instrument-only mode (chords only)
- Backing track support
- Tempo tap detection
- Version history
- Song revision comparison
- Collaborative editing

---

# 9. Security Rules (Initial)

- Users can only read/write their own songs
- Shared links allow read-only access
- Group permissions override private ownership rules

---

# 10. Long-Term Vision

A lightweight alternative to apps like OnSong,
focused on:

- Simplicity
- Clean UX
- Offline-first design
- Personal ownership of data
- Optional collaboration
