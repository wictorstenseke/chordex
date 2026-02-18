Status: DONE

# Delete Song

## User story

As a user, I want to delete a song so that I can remove outdated or unwanted chord charts from my library.

## Acceptance criteria

- [x] Delete action available from song list or song detail
- [x] Confirmation before delete (to avoid accidents)
- [x] Song removed (localStorage; Firestore when wired)
- [ ] Song removed from any setlists that reference it (or handle orphaned references appropriately)
- [x] Works offline with sync when back online

## Notes

Security: Users can only read/write their own songs. Delete enforces ownership.
