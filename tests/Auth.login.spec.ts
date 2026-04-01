import { test, expect, request } from "@playwright/test";

const BASE_URL = "https://api-e7dw.onrender.com/api";

const TEST_USER = {
  name: "LoginUser",
  email: `login_${Date.now()}@example.com`,
  password: "Test1234!",
};

test.describe("Auth – Login", () => {
  test.setTimeout(60000);

  test.beforeAll(async () => {
    const ctx = await request.newContext();
    await ctx.post(`${BASE_URL}/auth/register`, { data: TEST_USER });
    await ctx.dispose();
  });

  test("POST /auth/login should return a token (200)", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: TEST_USER.email, password: TEST_USER.password },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.error).toBeNull();
    expect(body.data).toHaveProperty("token");
    expect(body.data).toHaveProperty("userId");
    expect(typeof body.data.token).toBe("string");
  });

  test("POST /auth/login with wrong password should return 400", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: TEST_USER.email, password: "wrongpassword" },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Password or email is wrong.");
  });

  test("POST /auth/login with unknown email should return 400", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: "nobody@example.com", password: "irrelevant" },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Password or email is wrong.");
  });

  test("POST /auth/login with missing password should return 400", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: TEST_USER.email },
    });

    expect(res.status()).toBe(400);
  });

  test("POST /auth/login with missing email should return 400", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/login`, {
      data: { password: TEST_USER.password },
    });

    expect(res.status()).toBe(400);
  });
});