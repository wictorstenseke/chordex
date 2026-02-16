Status: TODO

# Shared Song Duplicate Prevention

## User story

As a user who previously saved a shared song, I want to see "Open My Copy" instead of creating a duplicate so that I don't accidentally create multiple copies.

## Acceptance criteria

- [ ] When opening a shared song, check if current user already has a copy (via source metadata)
- [ ] If copy exists: show "Open My Copy" instead of "Save to My Songs"
- [ ] "Open My Copy" navigates to user's existing song
- [ ] No duplicate songs created for same shared source

## Notes

Duplicate prevention: If user already saved a copy, show "Open My Copy" instead of creating duplicate. Match by source metadata (sourceSongId, sourceOwnerId).
