# BookStore API

A RESTful API for a bookstore web application built with Node.js, Express, TypeScript and MongoDB.

![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/playwright.yml/badge.svg)

## Tech Stack

- **Runtime:** Node.js (v20, v22)
- **Framework:** Express 5
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Testing:** Playwright (E2E)
- **CI/CD:** GitHub Actions → Render

## CI/CD Pipeline

Every push to `main` triggers a 3-stage pipeline:

```
push to main
     │
     ▼
┌─────────────────────────────────┐
│  TEST (matrix: Node 20 + 22)    │
│  1. npm install                 │
│  2. ESLint (lint)               │
│  3. TypeScript build            │
│  4. Start server (in-memory DB) │
│  5. Run 28 Playwright tests     │
│  6. Upload HTML report          │
└────────────────┬────────────────┘
                 │ only if tests pass
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│ DEPLOY REPORT│  │ DEPLOY           │
│ → GitHub     │  │ → Render.com     │
│   Pages      │  │   (production)   │
└──────────────┘  └──────────────────┘
```

## Test Coverage (28 tests)

| Suite | Tests | Covers |
|-------|-------|--------|
| Health | 1 | Server availability |
| Dev Tools | 4 | Cron endpoint |
| Auth – Register | 5 | Registration validation |
| Auth – Login | 5 | Login + wrong credentials |
| Books – Public | 4 | GET routes |
| Books – Protected | 8 | Auth middleware + CRUD |
| Books – E2E | 1 | Full Register→Login→CRUD flow |

## Running Tests Locally

```bash
npm install
npm run start-ci &        # starts server with in-memory MongoDB
npx playwright test       # runs all 28 tests
npx playwright show-report # opens HTML report
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/` | ❌ | Health check |
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/books` | ❌ | Get all books |
| GET | `/api/books/:id` | ❌ | Get book by ID |
| POST | `/api/books` | ✅ | Create book |
| PUT | `/api/books/:id` | ✅ | Update book |
| DELETE | `/api/books/:id` | ✅ | Delete book |
| GET | `/api/start-cron/:duration` | ❌ | Start keep-alive cron |

Swagger docs available at `/api-docs` when server is running.
