Status: TODO

# Security Rules

## User story

As a developer, I want Firestore and sharing security rules implemented so that users can only access their own data and shared links work correctly.

## Acceptance criteria

- [ ] Users can only read/write their own songs (ownerId match)
- [ ] Users can only read/write their own setlists (ownerId match)
- [ ] Shared links allow read-only access (unlisted visibility)
- [ ] Group permissions override private ownership (Phase 2 – placeholder or note for later)

## Notes

Initial security from mvp-desc-scope.md:
- Users can only read/write their own songs
- Shared links allow read-only access
- Group permissions override private ownership rules (Phase 2)
