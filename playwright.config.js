'use strict';

/**
 * Playwright config for tests/e2e/.
 *
 * The npm scripts (test:smoke, test:e2e) start a static server in front of
 * public/ via start-server-and-test, so this config only points at that
 * baseURL. No webServer block here on purpose - that is owned by npm so
 * port 3000 is started/stopped consistently across test:smoke / test:e2e.
 */

const { defineConfig, devices } = require('@playwright/test');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PORT}`;

module.exports = defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: BASE_URL,
    actionTimeout: 7000,
    trace: 'retain-on-failure',
    video: 'off',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});
