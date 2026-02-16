Status: TODO

# Delete Song

## User story

As a user, I want to delete a song so that I can remove outdated or unwanted chord charts from my library.

## Acceptance criteria

- [ ] Delete action available from song list or song detail
- [ ] Confirmation before delete (to avoid accidents)
- [ ] Song removed from Firestore
- [ ] Song removed from any setlists that reference it (or handle orphaned references appropriately)
- [ ] Works offline with sync when back online

## Notes

Security: Users can only read/write their own songs. Delete should enforce ownership.
