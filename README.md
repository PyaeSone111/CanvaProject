# Canva-like Editor + Portfolio Website Builder

Monorepo scaffold: React (Vite) frontend, Go (Gin) API, shared types, and local infra.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand
- **Backend:** Go 1.22+, Gin, PostgreSQL (pgx), Redis, S3-compatible storage (e.g. AWS S3 / Cloudflare R2)
- **Monorepo:** pnpm workspaces — `apps/web`, `apps/api`, `packages/shared`, `infra`

## How to run locally

### Prerequisites

- Node.js 20+, pnpm 9+
- Go 1.22+
- Docker & Docker Compose

### 1. Install dependencies

```bash
pnpm install
cd apps/api && go mod tidy && cd ../..
```

### 2. Environment files

- **Infra:** copy `infra/.env.example` to `infra/.env` (optional; defaults work for local).
- **API:** copy `apps/api/.env.example` to `apps/api/.env`.
- **Web:** copy `apps/web/.env.example` to `apps/web/.env` (optional; Vite defaults are fine).

### 3. Start services

**Option A – All-in-one (recommended)**

```bash
# Start Postgres + Redis, then run web + API
make dev
# Or on Windows PowerShell:
# .\scripts\dev.ps1
```

**Option B – Manual**

```bash
# Terminal 1: infra
docker compose -f infra/docker-compose.yml up -d

# Terminal 2: API (from repo root)
cd apps/api && go run .

# Terminal 3: Web
pnpm run dev:web
```

- **Web:** http://localhost:5173  
- **API:** http://localhost:8080 (e.g. GET http://localhost:8080/health)

### 4. Other commands

- **Migrations (placeholder):** `make migrate`
- **Lint:** `pnpm run lint`
- **Format:** `pnpm run format`
- **Build:** `pnpm run build` (builds `packages/shared` and `apps/web`; API is `go build` in `apps/api`)

## Project layout

```
apps/
  web/          # React + Vite + Tailwind + shadcn/ui + Zustand
  api/          # Go Gin API (pgx, Redis, S3 init)
packages/
  shared/       # Shared types and API contracts (TypeScript)
infra/          # Docker Compose (Postgres, Redis), .env.example
scripts/        # dev.ps1, dev.sh
```

Editor logic is not implemented; this is scaffolding and wiring only.
