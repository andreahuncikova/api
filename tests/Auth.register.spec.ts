import { test, expect } from "@playwright/test";

const BASE_URL = "/api";

const TEST_USER = {
  name: "TestUser",
  email: `testuser_${Date.now()}@example.com`,
  password: "Test1234!",
};

export default function authRegisterTests() {
test.describe("Auth – Register", () => {
  test.setTimeout(60000);

  test("POST /auth/register should create a new user (201)", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/register`, {
      data: TEST_USER,
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.error).toBeNull();
    expect(body).toHaveProperty("data");
  });

  test("POST /auth/register with duplicate email should return 400", async ({ request }) => {
    const duplicateUser = {
      name: "DuplicateUser",
      email: "duplicate@example.com",
      password: "Test1234!",
    };

    await request.post(`${BASE_URL}/auth/register`, { data: duplicateUser });
    const res = await request.post(`${BASE_URL}/auth/register`, { data: duplicateUser });

    expect(res.status()).toBe(409);
    const body = await res.json();
    expect(body.error).toBe("Email already exists.");
  });

  test("POST /auth/register with missing name should return 400", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/register`, {
      data: { email: "noname@example.com", password: "Test1234!" },
    });

    expect(res.status()).toBe(400);
  });

  test("POST /auth/register with missing password should return 400", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/register`, {
      data: { name: "NoPassword", email: "nopassword@example.com" },
    });

    expect(res.status()).toBe(400);
  });

  test("POST /auth/register with missing email should return 400", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/register`, {
      data: { name: "NoEmail", password: "Test1234!" },
    });

    expect(res.status()).toBe(400);
  });

  test("POST /auth/register with empty body should return 400", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/auth/register`, {
      data: {},
    });

    expect(res.status()).toBe(400);
  });
});
}