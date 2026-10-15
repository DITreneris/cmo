'use strict';

/**
 * Local visual pass for /en/. Not used by npm test or GitHub CI:
 * screenshot baselines are Windows Chromium (font raster differs on ubuntu-latest).
 */

const { defineConfig, devices } = require('@playwright/test');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PORT}`;

module.exports = defineConfig({
  testDir: 'tests/visual',
  timeout: 240000,
  expect: {
    timeout: 60000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002
    }
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  snapshotPathTemplate: '{testDir}/snapshots/{arg}-{projectName}-{platform}{ext}',
  use: {
    baseURL: BASE_URL,
    actionTimeout: 15000,
    trace: 'retain-on-failure',
    video: 'off',
    screenshot: 'only-on-failure',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    deviceScaleFactor: 1
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], deviceScaleFactor: 1 }
    }
  ]
});
