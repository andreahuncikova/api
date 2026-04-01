import { test, expect } from "@playwright/test";

test.describe("Health Check", () => {
  test.setTimeout(60000);

  test("GET / should return 200 and welcome message", async ({ request }) => {
    const res = await request.get(`/api/`);

    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Welcome");
  });
});