# CoChef API — Sprint 1 (Backend Foundation)

NestJS + Prisma + PostgreSQL backend with JWT auth and role-based access control (`VILLAGER`, `MANAGER`, `ADMIN`).

## Prerequisites

- Node.js 20+
- A PostgreSQL instance (local Docker, or Supabase's Postgres connection string)

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your PostgreSQL instance, e.g. for a local Docker Postgres:

```bash
docker run --name cochef-postgres \
  -e POSTGRES_USER=cochef -e POSTGRES_PASSWORD=cochef -e POSTGRES_DB=cochef_dev \
  -p 5432:5432 -d postgres:16
```

`DATABASE_URL="postgresql://cochef:cochef@localhost:5432/cochef_dev?schema=public"`

## 3. Generate Prisma client & run migrations

```bash
npx prisma migrate dev --name init
npm run prisma:generate
```

This creates all tables (`users`, `wallets`, `meals`, `menus`, `orders`, etc.) from `prisma/schema.prisma`.

## 4. Seed test users (one per role)

```bash
npm run prisma:seed
```

Creates:
- `villager@cochef.test`
- `manager@cochef.test`
- `admin@cochef.test`

All three share the password `Password123!`.

## 5. Run the API

```bash
npm run start:dev
```

API is available at `http://localhost:3000/api/v1`.

## 6. Try it

```bash
# Register a new villager
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@cochef.test","password":"Password123!"}'

# Login (works for seeded users too)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cochef.test","password":"Password123!"}'
# -> { "accessToken": "...", "user": { "role": "ADMIN", ... } }

# Call a protected route with the token from login
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <accessToken>"

# Call the ADMIN-only route (403 if you use a villager/manager token)
curl http://localhost:3000/api/v1/users/admin-check \
  -H "Authorization: Bearer <admin accessToken>"
```

## What's implemented in Sprint 1

- NestJS project structure (`common/`, `config/`, `prisma/`, `modules/`).
- Prisma schema covering the full data model designed in the architecture phase (users, wallets, meals, menus, orders, order items, favorites, waiting time) plus the `Role` enum (`VILLAGER`, `MANAGER`, `ADMIN`).
- JWT-based authentication: register, login, forgot-password (stubbed — logs instead of sending an email; swap in a real provider in a later sprint).
- `JwtAuthGuard` (validates the token) + `RolesGuard` + `@Roles()` decorator (restricts a route to specific roles) + `@CurrentUser()` decorator.
- Global validation pipe (rejects unknown fields, validates DTOs), global exception filter (consistent error JSON shape), env validation on boot (fails fast if `.env` is misconfigured).
- `GET /users/me` (any authenticated role) and `GET /users/admin-check` (ADMIN only) as a working example of the guard/role stack end-to-end.

## Note on this sandbox vs. your machine

Prisma's client generation step (`prisma generate`) downloads a query-engine binary from `binaries.prisma.sh`. That domain isn't reachable from the sandbox this code was written in, so I could not run `prisma generate` / `migrate dev` here to execute the code end-to-end — but `npm install` succeeded cleanly, and `binaries.prisma.sh` is a normal public domain that will resolve fine on your own machine or CI. Run the steps above locally and it will work; if step 3 ever fails for you, it's almost always a `DATABASE_URL` typo or Postgres not running, not the schema itself.

## Next step (Sprint 2 preview)

Menu & meal endpoints: `GET /menus/today`, `GET /menus/weekly`, `GET /meals/:id`, plus the manager-only meal/menu CRUD (`Roles(Role.MANAGER)`).
