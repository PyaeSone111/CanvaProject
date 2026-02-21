.PHONY: dev migrate docker-up docker-down install build lint

# Start infra (postgres + redis), then web + api in parallel
dev: docker-up
	pnpm run dev

# Run only Docker services (run from infra so infra/.env is used)
docker-up:
	cd infra && docker compose up -d

docker-down:
	cd infra && docker compose down

# Placeholder for DB migrations
migrate:
	@echo "Migrations not implemented yet. Add your migration tool here."
	@exit 0

install:
	pnpm install
	cd apps/api && go mod tidy

build:
	pnpm run build

lint:
	pnpm run lint
