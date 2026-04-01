import { test, expect } from "@playwright/test";

test.describe("Dev Tools – Cron Routes", () => {

  test("GET /start-cron/:duration should return 200 with plain text", async ({ request }) => {
    const res = await request.get("/api/start-cron/1");

    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Started background task");
  });

  test("GET /start-cron/:duration should reflect the correct duration in response", async ({ request }) => {
    const res = await request.get("/api/start-cron/30");

    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("duration:30 mins");
  });

  test("GET /start-cron/:duration with default fallback (non-number) should use 60 mins", async ({ request }) => {
    const res = await request.get("/api/start-cron/abc");

    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("duration:60 mins");
  });

  test("GET /start-cron/:duration calling twice should restart the cron (no crash)", async ({ request }) => {
    const res1 = await request.get("/api/start-cron/1");
    expect(res1.status()).toBe(200);

    const res2 = await request.get("/api/start-cron/2");
    expect(res2.status()).toBe(200);

    const body = await res2.text();
    expect(body).toContain("duration:2 mins");
  });

});