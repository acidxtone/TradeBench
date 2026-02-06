# TradeBench

## Overview
TradeBench is a quiz and study application for apprenticeship training. Users select their year of study and access questions, study guides, and track their progress. Authentication is handled via Replit Auth (OpenID Connect).

## Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Radix UI components (shadcn/ui pattern)
- **Routing**: React Router v6
- **State Management**: TanStack React Query
- **Backend**: Express 5 + TypeScript (server/) with Vite middleware for dev
- **Database**: PostgreSQL (Neon) via Drizzle ORM
- **Auth**: Replit Auth (OpenID Connect) with Passport.js
- **Language**: JavaScript/JSX (frontend), TypeScript (backend)

## Project Structure
```
src/
  api/           - API clients (localClient.js for offline data)
  components/    - UI components (ui/ for shadcn primitives, dashboard/, quiz/, study/ for features)
  hooks/         - Custom React hooks
  lib/           - Utilities, auth context
  pages/         - Page components (LandingPage, Dashboard, Quiz, Study, YearSelection, etc.)
  utils/         - Utility functions
server/
  index.ts       - Express server entry point
  db.ts          - Drizzle ORM database connection
  vite.ts        - Vite dev middleware for serving frontend
  replit_integrations/auth/ - Replit Auth integration (OIDC, passport, session storage)
shared/
  schema.ts      - Combined Drizzle schema exports
  models/auth.ts - Users and sessions tables
data/            - JSON data files for questions and study guides
scripts/         - Data generation and migration scripts
```

## Configuration
- Express server runs on port 5000, host 0.0.0.0
- Vite runs in middleware mode (served through Express)
- Path alias: `@/` maps to `./src/`
- Tailwind config: `tailwind.config.js`
- PostCSS config: `postcss.config.js`
- Drizzle config: `drizzle.config.ts`

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Replit)
- `SESSION_SECRET` - Session encryption secret (stored as secret)
- `REPL_ID` - Replit app ID (auto-provided)

## Auth Flow
- Landing page shown to unauthenticated users
- `/api/login` - Initiates Replit OIDC login
- `/api/callback` - OIDC callback handler
- `/api/logout` - Logs user out
- `/api/auth/user` - Returns authenticated user data
- Sessions stored in PostgreSQL via connect-pg-simple

## Running
- `npm run dev` - Start Express + Vite dev server on port 5000
- `npm run build` - Build frontend for production
- `npm run db:push` - Push Drizzle schema to database

## Recent Changes
- 2026-02-06: Added Replit Auth integration (OIDC with Passport.js)
- 2026-02-06: Created Express backend server with Vite middleware
- 2026-02-06: Set up PostgreSQL database with Drizzle ORM (users, sessions tables)
- 2026-02-06: Created landing page for unauthenticated users
- 2026-02-06: Updated AuthContext to use Replit Auth instead of Supabase/local auth
