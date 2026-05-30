# BookStore API

REST API for a bookstore app built with Node.js, Express, TypeScript and MongoDB.


## Tech stack

- Node.js + Express 5
- TypeScript
- MongoDB + Mongoose
- Playwright (API integration tests + E2E)
- GitHub Actions → Render.com

## How to run locally

```bash
npm install
npm run start-dev     # starts dev server on port 4000
```

Swagger docs at `http://localhost:4000/api-docs`

## Running tests

```bash
npm install
npm run start-ci &        # starts server with in-memory MongoDB
npx playwright test       # runs all 25 tests
npx playwright show-report
```

## CI/CD pipeline

Every push to `main` triggers this automatically:

```
push to main
     │
     ▼
┌─────────────────────────────────┐
│  TEST (Node 20 + 22 in parallel)│
│  1. npm install                 │
│  2. ESLint                      │
│  3. TypeScript build            │
│  4. Start server (in-memory DB) │
│  5. Run 25 tests                │
│  6. Upload HTML report          │
└────────────────┬────────────────┘
                 │ only if tests pass
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌───────────────┐
│ DEPLOY REPORT│  │ DEPLOY        │
│ → GitHub     │  │ → Render.com  │
│   Pages      │  │               │
└──────────────┘  └───────────────┘
```

## Tests (25 total)

| Suite | Tests | What it checks |
|-------|-------|----------------|
| Health | 1 | Server is running |
| Dev Tools | 1 | Cron endpoint |
| Auth – Register | 5 | Registration + validation |
| Auth – Login | 5 | Login + wrong credentials |
| Books – Public | 4 | GET routes (no auth) |
| Books – Protected | 8 | JWT middleware + CRUD |
| Books – E2E | 1 | Full Register → Login → CRUD flow |

## API endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/` | ❌ | Health check |
| POST | `/api/auth/register` | ❌ | Register |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/books` | ❌ | Get all books |
| GET | `/api/books/:id` | ❌ | Get book by ID |
| POST | `/api/books` | ✅ | Create book |
| PUT | `/api/books/:id` | ✅ | Update book |
| DELETE | `/api/books/:id` | ✅ | Delete book |
| GET | `/api/start-cron/:duration` | ❌ | Start keep-alive cron |
