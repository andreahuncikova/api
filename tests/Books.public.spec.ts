import { test, expect, request } from "@playwright/test";

const BASE_URL = "/api";

const TEST_USER = {
  name: "BooksPublicUser",
  email: `books_public_${Date.now()}@example.com`,
  password: "Test1234!",
};

const BOOK_PAYLOAD = {
  title: "Public Test Book",
  author: "John Public",
  image: "https://example.com/book.jpg",
  price: 19.99,
  genre: "Fiction",
  publishedYear: 2024,
  pages: 300,
  summary: "A test book for public route testing.",
  available: true,
};

let seededBookId: string;

export default function booksPublicTests() {
test.describe("Books – Public Routes", () => {
  test.setTimeout(60000);

  test.beforeAll(async ({ request }) => {
    await request.post(`${BASE_URL}/auth/register`, { data: TEST_USER });
    const loginRes = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: TEST_USER.email, password: TEST_USER.password },
    });
    const loginBody = await loginRes.json();
    const token = loginBody.data.token; // { error: null, data: { userId, token } }

    const createRes = await request.post(`${BASE_URL}/books`, {
      data: BOOK_PAYLOAD,
      headers: { "auth-token": token },
    });
    const book = await createRes.json();
    seededBookId = book._id;
  });

  test("GET /books should return 200 and an array", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/books`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test("GET /books should contain at least one book", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/books`);
    const body = await res.json();

    expect(body.length).toBeGreaterThan(0);
  });

  test("GET /books/:id should return an array with the correct book (200)", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/books/${seededBookId}`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]._id).toBe(seededBookId);
    expect(body[0].title).toBe(BOOK_PAYLOAD.title);
    expect(body[0].author).toBe(BOOK_PAYLOAD.author);
    expect(body[0].price).toBe(BOOK_PAYLOAD.price);
  });

  test("GET /books/:id with non-existent ID returns empty array", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/books/000000000000000000000000`);

    expect([200, 404]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBe(0);
    }
  });

  test("GET /books/:id with wrong ID should return 400 or 500", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/books/not-a-valid-id`);

    expect([400, 500]).toContain(res.status());
  });
});
}