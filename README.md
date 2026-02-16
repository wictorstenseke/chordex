# Chordex

A clean, lightweight, offline-first web app for managing chord-based songs (ChordPro format), creating setlists, practicing, and sharing songs with others.

## Vision

- **Simple & fast** – Minimal interface, no distractions, works fully offline
- **ChordPro-native** – Edit songs in ChordPro format with live chord preview
- **Setlists** – Create, reorder, and play setlists with drag & drop
- **Player mode** – Large typography, swipe navigation, optional autoscroll
- **Sharing** – Share songs and setlists via read-only links; save shared songs to your library
- **Backup** – Export library as ZIP (.cho files + setlist JSON)

## Tech Stack

- **Vite + React 19 + TypeScript** – Fast build, strict typing
- **Firebase** – Firestore (data), Auth (users)
- **PWA** – Offline support; app shell cached, Firestore offline persistence
- **TanStack Router** – Type-safe file-based routing
- **TanStack Query** – Data fetching and caching
- **Tailwind CSS v4** – Utility-first styling
- **shadcn/ui** – Accessible components (Radix UI)
- **Vitest** – Unit and component testing

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── AppShell.tsx      # Main layout wrapper
│   └── ui/                    # shadcn/ui components
├── pages/
│   └── Landing.tsx
├── routes/                    # TanStack Router routes
│   ├── __root.tsx
│   └── index.tsx
├── hooks/
├── lib/
│   ├── api.ts
│   ├── queryClient.ts
│   └── utils.ts
├── types/
├── router.tsx
├── main.tsx
└── index.css
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

Build runs type checking, linting, tests, and the Vite build. Any failure stops the build.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Full production build (type-check, lint, test, build) |
| `npm run preview` | Preview production build locally |
| `npm run generate:routes` | Generate TanStack Router route tree |
| `npm run type-check` | TypeScript type checking (generates routes first) |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier format |
| `npm run format:check` | Prettier check |
| `npm run test` | Run tests once |
| `npm run test:watch` | Tests in watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run ci` | CI checks (type-check, lint, test) |
| `npm run check` | Alias for `ci` |
| `npm run check:full` | All checks including build |

## Modes (MVP)

- **Edit mode** – Create and edit songs (ChordPro), manage metadata (key, capo, tempo, tags)
- **View mode** – Read songs with chords rendered above lyrics
- **Player mode** – Large typography for performance; swipe/next song; optional autoscroll; dark/light

## Firebase Setup

Configure Firebase before running against Firestore and Auth:

1. Create a Firebase project
2. Enable Firestore and Authentication
3. Add app config to environment (see `.env.example` when available)
4. Enable Firestore offline persistence for offline-first behavior

## Adding Components

Add shadcn/ui components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

Components install in `src/components/ui/`.

## Adding Routes

TanStack Router uses file-based routing. Create files in `src/routes/`; the route tree is auto-generated.

- Route tree: `src/routeTree.gen.ts` (generated, git-ignored)
- `prepare` script generates it on `npm install` / `npm ci`
- Also generated during dev, type-check, and build

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

Tests use **Vitest** and **@testing-library/react**. Co-locate test files with `.test.tsx` / `.test.ts`.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`):

- Runs on push/PR to main, master, develop
- Type check, lint, test, build

## Troubleshooting

### Route tree not found

If you see `Cannot find module './routeTree.gen'`:

1. Run `npm install` (or `npm ci`) – `prepare` generates the route tree
2. Or run `npm run generate:routes` manually

The route tree file is git-ignored and generated fresh in each environment.

## Learn More

- [Vite](https://vite.dev)
- [React](https://react.dev)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Firebase](https://firebase.google.com/docs)
- [ChordPro format](https://www.chordpro.org/)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)

## License

MIT
