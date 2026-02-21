#!/usr/bin/env bash
# Local dev: start Docker, then web + api (Unix)
set -e
cd "$(dirname "$0")/.."

echo "Starting Docker (postgres + redis)..."
(cd infra && docker compose up -d)

echo "Starting dev servers (web + api)..."
pnpm run dev
