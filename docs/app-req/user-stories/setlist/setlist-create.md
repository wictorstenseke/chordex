Status: DONE

# Create Setlist

## User story

As a user, I want to create a new setlist so that I can group songs for a practice session or gig.

## Acceptance criteria

- [x] UI to create a new setlist
- [x] Setlist requires a name
- [x] Setlist saved (localStorage; Firestore when wired) with ownerId, name, songIds (empty array), createdAt, updatedAt
- [x] New setlist appears in setlist list
- [x] Navigate to setlist detail for adding songs

## Notes

Setlists in `setlists/{setlistId}`: ownerId, name, songIds (ordered), notes?, visibility, createdAt, updatedAt.
