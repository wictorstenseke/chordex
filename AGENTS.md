# AI Agent Instructions

This project includes detailed coding rules that all AI agents should follow.

## Project Rules Location

**Read the project rules in `.cursor/rules/`.** These files contain context-specific conventions for this codebase:

| File                   | Scope                                              |
| ---------------------- | -------------------------------------------------- |
| `global.mdc`           | Project-wide: TypeScript, code style, completeness |
| `api-client.mdc`       | API client, fetch wrappers, error handling         |
| `react-components.mdc` | React components, JSX, accessibility               |
| `tanstack-query.mdc`   | TanStack Query hooks and mutations                 |
| `tanstack-router.mdc`  | TanStack Router, routing, navigation               |
| `testing.mdc`          | Vitest, test structure, co-location                |
| `ui-components.mdc`    | shadcn/ui, Radix UI, component patterns            |

Each rule file uses glob patterns to indicate which parts of the codebase it applies to. When working in a file, consult the rules that match its path.

## Application Requirements

**Read the application requirements in `docs/app-req/user-stories/`.** These files contain user stories and requirements for the application:

- The main index is at `docs/app-req/user-stories/README.md`
- User stories are organized by feature area (song, setlist, player, sharing, export, security, architecture)
- Each story includes status (TODO/Done), acceptance criteria, and implementation details
- Consult these requirements when working on features to ensure implementation matches specifications

## Quick Reference (Global Rules)

These apply everywhere:

- Use TypeScript strict mode; avoid `any`
- Prefer `const` arrow functions with explicit types
- Use `@/*` path aliases for imports
- Use early returns; use descriptive names
- Do not leave TODOs, placeholders, or incomplete implementations
- Verify code is complete and functional before finishing
