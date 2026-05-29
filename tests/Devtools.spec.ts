import { test, expect } from "@playwright/test";

export default function devToolsTests() {
test.describe("Dev Tools – Cron Routes", () => {

  test("GET /start-cron/:duration should return 200 with started message", async ({ request }) => {
    const res = await request.get("/api/start-cron/30");

    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Started background task");
    expect(body).toContain("duration:30 mins");
  });

});
}