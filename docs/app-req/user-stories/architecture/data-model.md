Status: TODO

# Data Model

## User story

As a developer, I want the Firestore schema for Users, Songs, and Setlists implemented so that data is stored correctly and consistently.

## Acceptance criteria

- [ ] `users/{uid}` collection: displayName, createdAt
- [ ] `songs/{songId}` collection: ownerId, title, artist?, key?, capo?, tempo?, tags?, content (ChordPro), visibility, source?, createdAt, updatedAt
- [ ] `setlists/{setlistId}` collection: ownerId, name, songIds (ordered), notes?, visibility, createdAt, updatedAt
- [ ] TypeScript types match schema

## Notes

### Users
- displayName, createdAt

### Songs
- visibility: "private" | "unlisted" | "group"
- source?: { songId, ownerId, importedAt } for shared-song imports

### Setlists
- songIds: string[] (ordered)
- visibility: "private" | "unlisted" | "group"
