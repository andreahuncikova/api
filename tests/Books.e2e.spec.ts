import { test, expect } from "@playwright/test";

const BASE_URL = "/api";

const BOOK_PAYLOAD = {
  title: "E2E Flow Book",
  author: "E2E Author",
  image: "https://example.com/e2e.jpg",
  price: 14.99,
  genre: "Mystery",
  publishedYear: 2022,
  pages: 220,
  summary: "An end-to-end test book.",
  available: true,
};


export default function booksE2eTests() {
test.describe("Full E2E Flow", () => {
  test.setTimeout(60000);

  test("Register → Login → Create → Read → Update → Delete", async ({ request }) => {
    const uniqueUser = {
      name: "E2EUser",
      email: `e2e_${Date.now()}@example.com`,
      password: "E2ETest99!",
    };

    // 1. Register
    const registerRes = await request.post(`${BASE_URL}/auth/register`, {
      data: uniqueUser,
    });
    expect(registerRes.status()).toBe(201);
    const registerBody = await registerRes.json();
    expect(registerBody.error).toBeNull();
    expect(registerBody).toHaveProperty("data");

    // 2. Login
    const loginRes = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: uniqueUser.email, password: uniqueUser.password },
    });
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    const token = loginBody.data.token; // { error: null, data: { userId, token } }
    expect(token).toBeTruthy();
    const headers = { "auth-token": token };

    // 3. Create book
    const createRes = await request.post(`${BASE_URL}/books`, {
      data: BOOK_PAYLOAD,
      headers,
    });
    expect(createRes.status()).toBe(201);
    const createdBook = await createRes.json();
    expect(createdBook).toHaveProperty("_id");
    const bookId = createdBook._id;

    // 4. Read book — find() returns an array
    const getRes = await request.get(`${BASE_URL}/books/${bookId}`);
    expect(getRes.status()).toBe(200);
    const getBody = await getRes.json();
    expect(Array.isArray(getBody)).toBeTruthy();
    expect(getBody[0].title).toBe(BOOK_PAYLOAD.title);
    expect(getBody[0].price).toBe(BOOK_PAYLOAD.price);

    // 5. Update book — returns { message, book }
    const updateRes = await request.put(`${BASE_URL}/books/${bookId}`, {
      data: { ...BOOK_PAYLOAD, title: "E2E Updated Title", price: 24.99 },
      headers,
    });
    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody.book.title).toBe("E2E Updated Title");
    expect(updateBody.book.price).toBe(24.99);

    // 6. Delete book — returns { message, book }
    const deleteRes = await request.delete(`${BASE_URL}/books/${bookId}`, { headers });
    expect(deleteRes.status()).toBe(200);
    const deleteBody = await deleteRes.json();
    expect(deleteBody.message).toBe("Book deleted successfully");

    // 7. Confirm deletion — find() returns empty array
    const confirmRes = await request.get(`${BASE_URL}/books/${bookId}`);
    expect([200, 404]).toContain(confirmRes.status());
    if (confirmRes.status() === 200) {
      const confirmBody = await confirmRes.json();
      expect(confirmBody.length).toBe(0);
    }
  });
});
}