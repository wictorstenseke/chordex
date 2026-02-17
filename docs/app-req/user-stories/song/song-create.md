Status: DONE

# Create Song

## User story

As a user, I want to create a new song so that I can add chord charts to my library.

## Acceptance criteria

- [x] UI to start creating a new song
- [x] Song saved to Firestore with required fields (ownerId, title, content, createdAt, updatedAt)
- [x] Optional metadata supported (artist, key, capo, tempo, tags)
- [x] New song appears in song list/library after creation
- [x] Redirect or navigate to edit mode after creation

## Notes

Songs stored in `songs/{songId}` with ownerId, title, artist?, key?, capo?, tempo?, tags?, content (ChordPro format), visibility, createdAt, updatedAt.
