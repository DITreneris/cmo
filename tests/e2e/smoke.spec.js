'use strict';

/**
 * Smoke test - verifies the static site loads with the EN library, the LT
 * mirror works, and the new commerce-related pages render without errors.
 * Wired through `npm run test:smoke` (Playwright + start-server-and-test).
 */

const { test, expect } = require('@playwright/test');

test.describe('static site smoke', () => {
  test('root redirects to /en/', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(String(err)));
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.locator('#main-content')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('root redirects to /en/ even with Lithuanian browser locale', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'lt-LT' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/?$/);
    await context.close();
  });

  test('en/ library loads with copy buttons present', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(String(err)));
    await page.goto('/en/');
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('button[data-prompt-id="prompt1"]').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('en/ Improve stays prompt 5 after locale JS', async ({ page }) => {
    await page.goto('/en/');
    const card = page.locator('article.prompt').filter({ has: page.locator('#prompt5') });
    await expect(card.locator('.prompt-title')).toHaveText(/Daily analysis/i);
    await expect(card.locator('.number')).toHaveText('4');
    await expect(page.locator('#prompt5')).toContainText(/performance analyst/i);
    await expect(page.locator('#prompt5')).not.toContainText(/30-second script/i);
    await expect(page.locator('#prompt1Recommended')).toHaveText(/Workflow 1 of 4/i);
  });

  test('en/ footer has no workbook chrome and keeps entity + community', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#footerSignoff')).toHaveCount(0);
    await expect(page.locator('#footerPlaceholderHint')).toHaveCount(0);
    await expect(page.locator('.footer .tags')).toHaveCount(0);
    await expect(page.locator('.footer > h3')).toHaveCount(0);
    await expect(page.locator('.cmo-footer-crosslink')).toHaveCount(0);
    await expect(page.locator('.cmo-kit-version')).toBeVisible();
    await expect(page.locator('#footer-product-link')).toBeVisible();
    await expect(page.locator('#community')).toBeVisible();
    await expect(page.getByText(/Remember to replace/)).toHaveCount(0);
    await expect(page.locator('.ecosystem-strip-list li')).toHaveCount(1);
  });

  test('lt/ mirror loads', async ({ page }) => {
    await page.goto('/lt/');
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('terms/ renders the team license anchor', async ({ page }) => {
    await page.goto('/terms/#paid-pdf-license');
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

  test('en/privacy/ lists paid PDF processors', async ({ page }) => {
    await page.goto('/en/privacy/');
    await expect(page.locator('#paid-pdf-data')).toBeVisible();
    for (const processor of ['Stripe', 'Resend', 'Upstash', 'Vercel Blob']) {
      await expect(page.locator('body')).toContainText(processor);
    }
  });
});
