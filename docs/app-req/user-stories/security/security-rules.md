Status: DONE

# Security Rules

## User story

As a developer, I want Firestore and sharing security rules implemented so that users can only access their own data and shared links work correctly.

## Acceptance criteria

- [x] Users can only read/write their own songs (ownerId match)
- [x] Users can only read/write their own setlists (ownerId match)
- [x] Shared links allow read-only access (unlisted visibility)
- [x] Group permissions override private ownership (Phase 2 – placeholder in rules)

## Notes

Initial security from mvp-desc-scope.md:
- Users can only read/write their own songs
- Shared links allow read-only access
- Group permissions override private ownership rules (Phase 2)
