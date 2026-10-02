# Tides of Tyria

A Guild Wars 2 event timer and checklist application built with React and Vite.

**Live Website:** https://tides-of-tyria.chuggs.net

## About

Tides of Tyria helps Guild Wars 2 players track in-game events, manage checklists, and optimize their gameplay experience with real-time event timers and customizable tracking features.

## Features

- Real-time event timers for Guild Wars 2 meta events
- Interactive checklists with drag-and-drop functionality
- Multiple color schemes and customizable themes
- Responsive design for desktop and mobile
- Wiki search functionality
- Persistent settings and progress tracking

## Tech Stack

- **Frontend:** React 18, Vite, Emotion CSS-in-JS
- **UI Components:** Material-UI, Radix UI
- **State Management:** React Context
- **Routing:** React Router DOM
- **Styling:** SCSS modules + Emotion
- **Build Tool:** Vite
- **Deployment:** AWS S3 + CloudFront

## Prerequisites

- [mise](https://mise.jdx.dev), which installs the pinned Node.js v20.12 and
  runs the project tasks (see `mise.toml`)
- npm (bundled with Node.js)

## Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd tides-of-tyria
```

2. **Install tools** (Node.js)

```bash
mise install
```

3. **Start development server** (installs dependencies first if needed)

```bash
mise run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

Tasks are defined in `mise.toml` and wrap the npm scripts in `package.json`.
Run `mise tasks` to list them. The npm equivalents work too, once Node is
installed.

| Command                     | npm equivalent             | Description                                                 |
| --------------------------- | -------------------------- | ----------------------------------------------------------- |
| `mise run install`          | `npm install`              | Install dependencies (skipped if the lockfile is unchanged) |
| `mise run dev`              | `npm run dev`              | Start development server with hot reload                    |
| `mise run build`            | `npm run build`            | Build for production (includes sitemap generation)          |
| `mise run preview`          | `npm run preview`          | Preview production build locally                            |
| `mise run lint`             | `npm run lint`             | Run ESLint (fails on any warning)                           |
| `mise run check-collisions` | `npm run check-collisions` | Check for potential event collision issues                  |

## Build & Deployment

### Local Production Build

```bash
mise run build
mise run preview
```

## Code Quality

The project uses several tools to maintain code quality:

- **ESLint:** JavaScript/React linting with custom rules
- **Prettier:** Code formatting (4 spaces, trailing commas)
- **Husky:** Git hooks for pre-commit checks
- **lint-staged:** Run linting/formatting on staged files

Pre-commit hooks automatically run:

- ESLint with auto-fix
- Prettier formatting

## Deployment

The application is automatically deployed via GitHub Actions:

- Builds on push to `main` branch
- Deploys to AWS S3 with CloudFront CDN
- Includes cache invalidation for immediate updates

## Releases

Two version numbers are bumped by hand. Neither is automated.

### App version (`package.json`)

Bump `version` in `package.json` for any change that should be released. The
deploy workflow reads it to create a GitHub release tagged `v<version>` (it
skips creation if that tag already exists), and it is shown on the Settings
page.

### Event timer version (`src/utils/meta_events.js`)

Bump `version` on the first entry of `META_EVENTS` (`core_tyria`) whenever
anything in `meta_events.js` changes. On load, the app compares that value with
the version saved in the user's local storage. If the saved version is older, the
user's event config is merged with the new defaults, so users only receive
timer changes when this version is bumped.

- Format: `YYYY-MM-DD_N`, where `N` is a counter for multiple bumps on the same
  day (e.g. `2026-05-23_1`, then `2026-05-23_2`).
- Versions are compared as strings, so keep `N` below 10 or zero-pad it
  (`_01`), otherwise `_10` sorts before `_9`.
- Run `mise run check-collisions` after editing events.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [ISC License](LICENSE).

## Acknowledgments

- Guild Wars 2 community for event timing data
- Open source libraries that make this project possible

_All game-related content is property of ArenaNet LLC._
