Status: DONE

# Offline PWA

## User story

As a user, I want the app to work fully offline so that I can edit songs and practice setlists without internet.

## Acceptance criteria

- [x] PWA manifest and service worker configured
- [x] App shell cached for offline load
- [x] Firestore offline persistence enabled (IndexedDB)
- [ ] Full song editing available offline (requires song-edit UI)
- [x] Data syncs automatically when connection returns

## Notes

Offline strategy from mvp-desc-scope.md:
- Firestore offline persistence enabled
- App shell cached (PWA)
- Full song editing available offline
- Sync automatically when connection returns
