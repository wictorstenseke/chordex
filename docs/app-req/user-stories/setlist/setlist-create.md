Status: TODO

# Create Setlist

## User story

As a user, I want to create a new setlist so that I can group songs for a practice session or gig.

## Acceptance criteria

- [ ] UI to create a new setlist
- [ ] Setlist requires a name
- [ ] Setlist saved to Firestore with ownerId, name, songIds (empty array), createdAt, updatedAt
- [ ] New setlist appears in setlist list
- [ ] Navigate to setlist detail for adding songs

## Notes

Setlists in `setlists/{setlistId}`: ownerId, name, songIds (ordered), notes?, visibility, createdAt, updatedAt.
