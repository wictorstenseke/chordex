# Chordex Implementation Plan

Implementation plan for Chordex MVP features. Firestore integration is intentionally deferred during early development; data uses localStorage.

**After each item is completed:** Update the corresponding user story file (change `Status: TODO` → `Status: DONE`, check off acceptance criteria) and update the status in [docs/app-req/user-stories/README.md](./app-req/user-stories/README.md).

---

## Phase 1: Song Editing & Discovery

### 1.1 Complete Edit Song

**Story:** [song/song-edit.md](./app-req/user-stories/song/song-edit.md)

**Tasks:**
- Add form fields to `SongEdit.tsx`: key (string), capo (number), tempo (number), tags (string array)
- Wire fields to `SongInput` and `useUpdateSongMutation`
- Ensure `updatedAt` is updated on save (lib already handles this)

**Files:** `src/pages/SongEdit.tsx`, `src/lib/songs.ts` (verify), `src/types/songbook.ts` (verify)

**Story update:** Mark DONE; check ChordPro editor, metadata fields, Firestore persist, updatedAt, offline (note: offline via localStorage for now).

---

### 1.2 Live Preview in Edit Mode

**Story:** [song/song-live-preview.md](./app-req/user-stories/song/song-live-preview.md)

**Tasks:**
- Add `ChordProPreview` to `SongEdit.tsx` (side-by-side pane or toggle)
- Pass `content` state to preview so it updates as user types
- Ensure preview matches view/player display (ChordProPreview already does this)

**Files:** `src/pages/SongEdit.tsx`

**Story update:** Mark DONE; check live preview pane/toggle, preview updates on edit, rendered format.

---

### 1.3 Tag Songs

**Story:** [song/song-tag.md](./app-req/user-stories/song/song-tag.md)

**Tasks:**
- Add tag UI in `SongEdit.tsx` (chip-style add/remove or comma-separated input)
- Store tags as `string[]` in song data (lib already supports)
- Tags editable from song edit view

**Files:** `src/pages/SongEdit.tsx`, `src/pages/SongNew.tsx` (optional: add tags on create)

**Story update:** Mark DONE; check UI, storage, search/filter usage (partial until 1.4), edit view.

---

### 1.4 Search Songs

**Story:** [song/song-search.md](./app-req/user-stories/song/song-search.md)

**Tasks:**
- Add search input to `SongsList.tsx`
- Filter `songs` by title, artist, and tags (case-insensitive, substring match)
- Update results as user types (controlled input)

**Files:** `src/pages/SongsList.tsx`

**Story update:** Mark DONE; check search input, match title/artist/tags, live update, works on cached data.

---

### 1.5 Delete Song (Confirmation)

**Story:** [song/song-delete.md](./app-req/user-stories/song/song-delete.md)

**Tasks:**
- Add confirmation dialog before delete (e.g. AlertDialog from Radix/shadcn)
- Delete action already exists in song detail; ensure it’s available from list if needed
- Handle setlist references: either remove song from setlists on delete, or document orphan handling (simplest: leave references, handle 404 in setlist view later)

**Files:** `src/pages/SongDetail.tsx`, add `src/components/ui/alert-dialog.tsx` if not present

**Story update:** Mark DONE; check delete from list/detail, confirmation, Firestore removal (localStorage for now), setlist handling.

---

### 1.6 Duplicate Song

**Story:** [song/song-duplicate.md](./app-req/user-stories/song/song-duplicate.md)

**Tasks:**
- Add `duplicateSong` in `src/lib/songs.ts` (copy metadata + content, new ID, no source)
- Add `useDuplicateSongMutation` in `useSongs.ts`
- Add "Duplicate" button on song list (card) and song detail
- On success: redirect to edit for new song

**Files:** `src/lib/songs.ts`, `src/hooks/useSongs.ts`, `src/pages/SongDetail.tsx`, `src/pages/SongsList.tsx`

**Story update:** Mark DONE; check duplicate from list/detail, copied metadata/content, new ID, no source, redirect to edit.

---

## Phase 2: Setlists

### 2.1 Create Setlist

**Story:** [setlist/setlist-create.md](./app-req/user-stories/setlist/setlist-create.md)

**Tasks:**
- Create `src/lib/setlists.ts` (localStorage, mirror songs pattern): create, get, getForUser, update, delete
- Create `src/hooks/useSetlists.ts` (query + mutations)
- Add routes: `setlists.index`, `setlists.new`, `setlists.$setlistId`, `setlists.$setlistId.index`
- Create `SetlistsList`, `SetlistNew`, `SetlistDetail` pages
- Add "Setlists" nav link in AppShell

**Files:** New lib, hooks, routes, pages; `src/components/layout/AppShell.tsx`

**Story update:** Mark DONE; check create UI, required name, Firestore schema (localStorage), list, navigate to detail.

---

### 2.2 Add Songs to Setlist

**Story:** [setlist/setlist-add-songs.md](./app-req/user-stories/setlist/setlist-add-songs.md)

**Tasks:**
- Song picker UI on setlist detail (modal or inline): list user’s songs, search/filter
- Append selected songs to `songIds`, persist
- Show added songs in setlist detail immediately

**Files:** `src/pages/SetlistDetail.tsx` (or equivalent), new song picker component

**Story update:** Mark DONE; check add UI, song picker, append to songIds, persist, visible immediately.

---

### 2.3 Reorder Songs in Setlist

**Story:** [setlist/setlist-reorder.md](./app-req/user-stories/setlist/setlist-reorder.md)

**Tasks:**
- Drag-and-drop for song order (e.g. @dnd-kit or similar)
- Update `songIds` order on drop, persist

**Files:** Setlist detail page, setlists lib

**Story update:** Mark DONE.

---

### 2.4 Setlist Notes

**Story:** [setlist/setlist-notes.md](./app-req/user-stories/setlist/setlist-notes.md)

**Tasks:**
- Add `notes` textarea to setlist detail/edit
- Persist notes field

**Files:** Setlist detail page, setlists lib

**Story update:** Mark DONE.

---

### 2.5 Setlist Player Mode

**Story:** [setlist/setlist-player-mode.md](./app-req/user-stories/setlist/setlist-player-mode.md)

**Tasks:**
- Player view for setlist: large typography, swipe/next song navigation
- Reuse ChordProPreview display
- Optional autoscroll (can defer to Player story)

**Files:** New player route/page, possibly shared with 3.1

**Story update:** Mark DONE.

---

## Phase 3: Player Mode

### 3.1 Player Mode

**Story:** [player/player-mode.md](./app-req/user-stories/player/player-mode.md)

**Tasks:**
- Large typography view for single song or setlist
- Swipe/button navigation between songs
- Optional autoscroll
- Dark/light mode (ThemeProvider already exists)

**Files:** New player route, player component

**Story update:** Mark DONE. ✓

---

## Phase 4: Sharing, Export, Security (Later)

Implemented:
- Share song via link (encoded in URL, localStorage-compatible)
- Open shared song, save to My Songs, duplicate prevention
- Export library as ZIP (songs as .cho, setlists as .json, library.json)

Still deferred:
- Share setlist via link
- Security rules (Firestore)

---

## Checklist Summary

| Phase | Item                | Story File                         |
|-------|---------------------|------------------------------------|
| 1.1   | Complete Edit Song  | song/song-edit.md                 |
| 1.2   | Live Preview        | song/song-live-preview.md         |
| 1.3   | Tag Songs           | song/song-tag.md                  |
| 1.4   | Search Songs        | song/song-search.md               |
| 1.5   | Delete Confirmation | song/song-delete.md               |
| 1.6   | Duplicate Song      | song/song-duplicate.md            |
| 2.1   | Create Setlist      | setlist/setlist-create.md         |
| 2.2   | Add Songs           | setlist/setlist-add-songs.md      |
| 2.3   | Reorder Songs       | setlist/setlist-reorder.md        |
| 2.4   | Setlist Notes       | setlist/setlist-notes.md          |
| 2.5   | Setlist Player      | setlist/setlist-player-mode.md    |
| 3.1   | Player Mode         | player/player-mode.md             |
| 4.1   | Export library      | export/export-library.md          |
| 4.2   | Share song          | sharing/share-song-link.md, etc.  |

**After each:** Update story file + README.md status.
