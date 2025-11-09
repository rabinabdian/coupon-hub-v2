# Coupon Hub

A full-stack Nx monorepo for managing coupons, merchants, and user events. Built with NestJS, Angular, TypeORM, BullMQ, and PostgreSQL.

## Architecture

This monorepo contains three applications:

- **api** - NestJS REST API with TypeORM, BullMQ, and Swagger documentation
- **worker** - NestJS background worker that processes events from Redis queue and batch-writes to PostgreSQL
- **web** - Angular frontend application

## Tech Stack

### Backend
- NestJS (Node.js framework)
- TypeORM (PostgreSQL ORM with migrations)
- BullMQ (Redis-based queue for background jobs)
- Swagger/OpenAPI (API documentation)
- class-validator (request validation)
- PostgreSQL (database)
- Redis (message queue)

### Frontend
- Angular 20
- Standalone components
- TypeScript

### Infrastructure
- Nx (monorepo tooling)
- pnpm (package manager)
- Docker Compose (local development)

## Prerequisites

- Node.js 20+ (with `node --env-file` support)
- pnpm 8+
- Docker & Docker Compose (for Postgres and Redis)

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Docker Services

```bash
pnpm dev:db
# or manually:
docker compose -f docker-compose.dev.yml up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

### 3. Build Applications

```bash
pnpm nx run api:build
pnpm nx run worker:build
pnpm nx run web:build
```

### 4. Run Database Migrations

```bash
# Generate initial migration
pnpm --filter api migration:generate

# Run migrations
pnpm --filter api migration:run
```

### 5. Seed the Database

```bash
pnpm --filter api seed
```

This creates:
- 3 merchants (Amazon, Target, Best Buy)
- 4 categories (Electronics, Clothing, Home & Garden, Food & Beverage)
- 5 coupons with various discounts
- Links between coupons and categories

### 6. Start All Services

```bash
pnpm dev
```

Or start individually:
```bash
pnpm dev:db      # Start docker services
pnpm dev:api     # Start API on port 3000
pnpm dev:worker  # Start worker
pnpm dev:web     # Start web on port 4200
```

## API Documentation

Once the API is running, visit **http://localhost:3000/docs** for Swagger documentation.

### Key Endpoints

- `GET /api/coupons` - Get all active coupons
- `GET /api/coupons/:id` - Get coupon by ID
- `GET /api/coupons/merchant/:merchantId` - Get coupons by merchant
- `POST /api/events` - Create event (enqueued to Redis, processed by worker)

### Events Flow

1. POST to `/api/events` enqueues event to Redis via BullMQ
2. Worker consumes events from queue
3. Worker batch-writes events to PostgreSQL (batch size: 10 or 5-second timeout)

Example event:
```json
{
  "type": "user_action",
  "data": {
    "action": "click",
    "target": "coupon_card"
  },
  "userId": "user-123"
}
```

## Database Schema

### Entities

- **User** - User accounts (id, email, password, isActive)
- **Merchant** - Coupon merchants (id, name, description, website, logoUrl)
- **Category** - Coupon categories (id, name, description, slug)
- **Coupon** - Coupons (id, title, description, code, discountAmount, discountType, expiresAt, merchantId)
- **CouponCategory** - Join table linking coupons to categories
- **Event** - User events (id, type, data, userId, createdAt)

### Migrations

Migrations are stored in `apps/api/src/database/migrations/`

Available migration commands:
```bash
pnpm --filter api migration:generate  # Auto-generate from entities
pnpm --filter api migration:create    # Create empty migration
pnpm --filter api migration:run       # Apply migrations
pnpm --filter api migration:revert    # Revert last migration
```

## Testing

### Run Unit Tests

```bash
# API tests
pnpm nx test api

# Worker tests
pnpm nx test worker

# Web tests
pnpm nx test web
```

### Run E2E Tests

```bash
# Web e2e (Playwright)
pnpm nx e2e web-e2e
```

## Project Structure

```
coupon-hub-v2/
├── apps/
│   ├── api/                    # NestJS API
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── coupons/   # Coupons module
│   │   │   │   └── events/    # Events module (BullMQ producer)
│   │   │   ├── database/
│   │   │   │   ├── migrations/
│   │   │   │   ├── seed/
│   │   │   │   └── data-source.ts
│   │   │   ├── entities/      # TypeORM entities
│   │   │   └── main.ts
│   │   ├── .env.development
│   │   └── package.json
│   ├── worker/                 # NestJS Worker
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   └── events-processor/  # BullMQ consumer
│   │   │   ├── entities/      # TypeORM entities (copied)
│   │   │   └── main.ts
│   │   ├── .env.development
│   │   └── package.json
│   └── web/                    # Angular app
│       └── src/
├── docker-compose.dev.yml      # Postgres + Redis
├── package.json
├── nx.json
└── pnpm-workspace.yaml
```

## Environment Variables

### API & Worker (.env.development)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=coupon_hub

REDIS_HOST=localhost
REDIS_PORT=6379

PORT=3000 (api) / 3001 (worker)
NODE_ENV=development
```

## Development Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all services (db, api, worker, web) |
| `pnpm dev:db` | Start Postgres + Redis |
| `pnpm dev:api` | Start API server |
| `pnpm dev:worker` | Start worker |
| `pnpm dev:web` | Start Angular dev server |

## Verification

After starting all services:

1. **Swagger** - http://localhost:3000/docs
2. **Angular App** - http://localhost:4200
3. **Test Events Flow**:
   ```bash
   curl -X POST http://localhost:3000/api/events \
     -H "Content-Type: application/json" \
     -d '{"type":"test","data":{"foo":"bar"}}'
   ```
   Check worker logs to see event processing, then query database to verify persistence.

## Troubleshooting

- If ports are in use, update `PORT` in `.env.development` files
- If database connection fails, ensure Docker services are running: `docker compose -f docker-compose.dev.yml ps`
- For Redis connection issues, verify Redis is accessible: `docker compose -f docker-compose.dev.yml logs redis`

## License

MIT
