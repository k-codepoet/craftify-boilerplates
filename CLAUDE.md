# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Craftify Boilerplates - a monorepo of production-ready starter templates for web applications. Designed for use with `degit` for quick project initialization and integrates with the Craftify CLI framework.

## Common Commands

### Root Level (Turbo orchestrated)
```bash
pnpm build      # Build all packages
pnpm dev        # Start dev servers for all packages (persistent)
pnpm lint       # Lint all packages
pnpm clean      # Clean build artifacts
```

### Individual Boilerplate Commands
```bash
pnpm dev        # Start development server with HMR
pnpm build      # Production build
pnpm typecheck  # TypeScript + React Router code generation
```

**SSR-specific (react-router-cloudflare):**
```bash
pnpm start      # Start local Wrangler dev server
pnpm deploy     # Deploy to Cloudflare Workers
```

## Architecture

### Monorepo Structure
```
web/
├── react-router-spa/        # Static SPA (Cloudflare Pages, Vercel, Netlify)
└── react-router-cloudflare/ # SSR on Cloudflare Workers
api/                         # Backend templates (planned)
lib/                         # Library templates (planned)
```

### Boilerplate Internal Structure

**SPA Pattern:**
```
app/
├── app.css       # Global styles + Tailwind + theme variables
├── root.tsx      # Root layout with error boundary
├── routes.ts     # React Router v7 route configuration
├── routes/       # Page components
└── lib/utils.ts  # Utilities (cn function)
```

**SSR Pattern (adds):**
```
app/entry.server.tsx   # SSR with renderToReadableStream + isbot detection
workers/app.ts         # Cloudflare Worker entry point
wrangler.toml          # Cloudflare configuration
```

### Technology Stack
- **Framework**: React Router v7 (SPA or SSR mode)
- **Build**: Vite 7 + Turbo
- **Styling**: Tailwind CSS v4 with OKLch color system
- **UI**: shadcn/ui compatible (new-york style)
- **Types**: TypeScript with strict mode

### Path Aliases
All boilerplates use `~/*` → `./app/*` for imports.

### shadcn/ui Integration
Configured in `components.json`:
- Components: `~/components`
- UI: `~/components/ui`
- Utils: `~/lib/utils`
- Hooks: `~/hooks`

## Boilerplate Naming Convention
```
{framework}-{deploy}        # SSR by default
{framework}-spa-{deploy}    # Explicitly SPA
```

## Build Outputs
- **SPA**: `build/client/` - static assets
- **SSR**: `build/client/` + `build/server/` - client assets + server bundle
