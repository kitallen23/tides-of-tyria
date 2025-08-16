# Tides of Tyria

A Guild Wars 2 event timer and checklist application built with React and Vite.

**Live Website:** https://tides-of-tyria.chuggs.net

## About

Tides of Tyria helps Guild Wars 2 players track in-game events, manage checklists, and optimize their gameplay experience with real-time event timers and customizable tracking features.

## Features

-   Real-time event timers for Guild Wars 2 meta events
-   Interactive checklists with drag-and-drop functionality
-   Multiple color schemes and customizable themes
-   Responsive design for desktop and mobile
-   Wiki search functionality
-   Persistent settings and progress tracking

## Tech Stack

-   **Frontend:** React 18, Vite, Emotion CSS-in-JS
-   **UI Components:** Material-UI, Radix UI
-   **State Management:** React Context
-   **Routing:** React Router DOM
-   **Styling:** SCSS modules + Emotion
-   **Build Tool:** Vite
-   **Deployment:** AWS S3 + CloudFront

## Prerequisites

-   Node.js v20.12 (use `nvm use` to switch to correct version)
-   Yarn package manager

## Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd tides-of-tyria
```

2. **Install dependencies**

```bash
yarn install
```

3. **Start development server**

```bash
yarn dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

| Command                 | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `yarn dev`              | Start development server with hot reload           |
| `yarn build`            | Build for production (includes sitemap generation) |
| `yarn preview`          | Preview production build locally                   |
| `yarn lint`             | Run ESLint with auto-fix                           |
| `yarn check-collisions` | Check for potential event collision issues         |

## Build & Deployment

### Local Production Build

```bash
yarn build
yarn preview
```

## Code Quality

The project uses several tools to maintain code quality:

-   **ESLint:** JavaScript/React linting with custom rules
-   **Prettier:** Code formatting (4 spaces, trailing commas)
-   **Husky:** Git hooks for pre-commit checks
-   **lint-staged:** Run linting/formatting on staged files

Pre-commit hooks automatically run:

-   ESLint with auto-fix
-   Prettier formatting

## Deployment

The application is automatically deployed via GitHub Actions:

-   Builds on push to `main` branch
-   Deploys to AWS S3 with CloudFront CDN
-   Includes cache invalidation for immediate updates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [ISC License](LICENSE).

## Acknowledgments

-   Guild Wars 2 community for event timing data
-   Open source libraries that make this project possible

_All game-related content is property of ArenaNet LLC._
