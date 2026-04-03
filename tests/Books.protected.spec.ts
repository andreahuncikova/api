import { test, expect, request } from "@playwright/test";

const BASE_URL = "/api";

const TEST_USER = {
  name: "BooksProtectedUser",
  email: `books_protected_${Date.now()}@example.com`,
  password: "Test1234!",
};

const BOOK_PAYLOAD = {
  title: "Protected Test Book",
  author: "Jane Protected",
  image: "https://example.com/book.jpg",
  price: 29.99,
  genre: "Science",
  publishedYear: 2023,
  pages: 450,
  summary: "A test book for protected route testing.",
  available: true,
};

let authToken: string;
let createdBookId: string;


export default function booksProtectedTests() {
test.describe("Books – Protected Routes", () => {
  test.setTimeout(60000);

  test.beforeAll(async ({ request }) => {
    await request.post(`${BASE_URL}/auth/register`, { data: TEST_USER });
    const loginRes = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: TEST_USER.email, password: TEST_USER.password },
    });
    const body = await loginRes.json();
    authToken = body.data.token; // { error: null, data: { userId, token } }
  });

  // ── POST /books ──────────────────────────────
  test("POST /books without token should return 400", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/books`, { data: BOOK_PAYLOAD });
    // verifyToken returns 400 when no token
    expect(res.status()).toBe(400);
  });

  test("POST /books with invalid token should return 401", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/books`, {
      data: BOOK_PAYLOAD,
      headers: { "auth-token": "invalidtoken123" },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /books with valid token should create a book (201)", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/books`, {
      data: BOOK_PAYLOAD,
      headers: { "auth-token": authToken },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty("_id");
    expect(body.title).toBe(BOOK_PAYLOAD.title);
    expect(body.author).toBe(BOOK_PAYLOAD.author);
    expect(body.price).toBe(BOOK_PAYLOAD.price);
    createdBookId = body._id;
  });

  // ── PUT /books/:id ───────────────────────────
  test("PUT /books/:id without token should return 400", async ({ request }) => {
    const res = await request.put(`${BASE_URL}/books/${createdBookId}`, {
      data: { title: "Hacker attempt" },
    });
    expect(res.status()).toBe(400);
  });

  test("PUT /books/:id with valid token should update the book (200)", async ({ request }) => {
    const updated = { ...BOOK_PAYLOAD, title: "Updated Title", price: 39.99 };
    const res = await request.put(`${BASE_URL}/books/${createdBookId}`, {
      data: updated,
      headers: { "auth-token": authToken },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("book");
    expect(body.book.title).toBe("Updated Title");
    expect(body.book.price).toBe(39.99);
  });

  test("PUT /books/:id with non-existent ID should return 404", async ({ request }) => {
    const res = await request.put(`${BASE_URL}/books/000000000000000000000000`, {
      data: BOOK_PAYLOAD,
      headers: { "auth-token": authToken },
    });
    expect(res.status()).toBe(404);
  });

  // ── DELETE /books/:id ────────────────────────
  test("DELETE /books/:id without token should return 400", async ({ request }) => {
    const res = await request.delete(`${BASE_URL}/books/${createdBookId}`);
    expect(res.status()).toBe(400);
  });

  test("DELETE /books/:id with valid token should return 200 with message", async ({ request }) => {
    const res = await request.delete(`${BASE_URL}/books/${createdBookId}`, {
      headers: { "auth-token": authToken },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("book");
    expect(body.message).toBe("Book deleted successfully");
  });

  test("GET /books/:id after delete should return empty array", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/books/${createdBookId}`);
    expect([200, 404]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(body.length).toBe(0);
    }
  });

  test("DELETE /books/:id already deleted should return 404", async ({ request }) => {
    const res = await request.delete(`${BASE_URL}/books/${createdBookId}`, {
      headers: { "auth-token": authToken },
    });
    expect(res.status()).toBe(404);
  });
});
}