Status: DONE

# Add Songs to Setlist

## User story

As a user, I want to add songs from my library to a setlist so that I can build a set for practice or performance.

## Acceptance criteria

- [x] UI to add songs when viewing/editing a setlist
- [x] Song picker or list from user's library
- [x] Selected songs appended to setlist's songIds (preserving order)
- [x] Changes persisted (localStorage; Firestore when wired)
- [x] Added songs visible in setlist immediately

## Notes

songIds: string[] (ordered). Only songs from user's library can be added.
