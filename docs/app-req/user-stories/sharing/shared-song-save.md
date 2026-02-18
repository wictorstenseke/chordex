Status: Done

# Save Shared Song to My Songs

## User story

As a recipient, I want to save a shared song to my library so that I can keep a copy and edit it.

## Acceptance criteria

- [x] "Save to My Songs" creates new song owned by current user
- [x] All metadata and content copied
- [x] Source metadata added: sourceSongId, sourceOwnerId, importedAt
- [x] Redirect to Edit mode after save
- [x] If not signed in: prompt to sign in first

## Notes

Save to My Songs:
- Creates new song owned by current user
- Copies all metadata + content
- Adds source: { songId, ownerId, importedAt }
- Redirect to Edit mode
