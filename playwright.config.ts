import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  testDir: './tests',
  testMatch: 'Index.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  workers: 1,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: "http://127.0.0.1:4000", 

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  
  },

 


});
