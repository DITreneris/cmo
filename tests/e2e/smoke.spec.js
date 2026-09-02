'use strict';

/**
 * Smoke test - verifies the static site loads with the EN library, the LT
 * mirror works, and the new commerce-related pages render without errors.
 * Wired through `npm run test:smoke` (Playwright + start-server-and-test).
 */

const { test, expect } = require('@playwright/test');

test.describe('static site smoke', () => {
  test('root index loads (LT default landing)', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(String(err)));
    await page.goto('/');
    await expect(page).toHaveTitle(/Prompt Anatomy/);
    expect(errors).toEqual([]);
  });

  test('en/ library loads with copy buttons present', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(String(err)));
    await page.goto('/en/');
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('button[data-prompt-id="prompt1"]').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('lt/ mirror loads', async ({ page }) => {
    await page.goto('/lt/');
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('terms.html renders the team license anchor', async ({ page }) => {
    await page.goto('/terms.html#paid-pdf-license');
    await expect(page.locator('#paid-pdf-license')).toBeVisible();
    await expect(page.getByText(/Team license/i).first()).toBeVisible();
  });

  test('coming-soon.html renders the two products', async ({ page }) => {
    await page.goto('/coming-soon.html');
    await expect(page.getByText('CMO AI Content System - Starter')).toBeVisible();
    await expect(page.getByText('CMO AI Content System - Pro')).toBeVisible();
    await expect(page.getByText(/\$3\.99/)).toBeVisible();
    await expect(page.getByText(/\$8\.99/)).toBeVisible();
  });

  test('en/privacy.html lists paid PDF processors', async ({ page }) => {
    await page.goto('/en/privacy.html');
    await expect(page.locator('#paid-pdf-data')).toBeVisible();
    for (const processor of ['Stripe', 'Resend', 'Upstash', 'Vercel Blob']) {
      await expect(page.locator('body')).toContainText(processor);
    }
  });
});
