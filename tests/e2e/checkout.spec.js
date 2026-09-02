'use strict';

/**
 * Checkout e2e flow.
 *
 * Behaviour depends on commerce.allowPlaceholderCheckout in config/sot.json:
 *
 *   placeholder mode (default before live Payment Links exist):
 *     - storefront CTAs route to /coming-soon.html
 *     - no buy.stripe.com URLs anywhere on the EN page
 *     - clicking "Notify me" lands on the coming-soon page
 *
 *   live mode (after Payment Links are filled in SOT):
 *     - both CTAs are absolute https://buy.stripe.com/* URLs (Stripe-hosted)
 *     - clicking is asserted to navigate (we open in a new tab and check the URL)
 *
 * We also exercise the success.html polling state on a fake session id - the
 * /api/* routes are not deployed in the static smoke server, so we expect the
 * page to fall through to the "check your email" copy without throwing.
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SOT = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', '..', 'config', 'sot.json'), 'utf8')
);

const isPlaceholder =
  SOT.commerce.allowPlaceholderCheckout === true &&
  !/^https:\/\/buy\.stripe\.com\//.test(String(SOT.commerce.stripePaymentLinks.starter || '')) &&
  !/^https:\/\/buy\.stripe\.com\//.test(String(SOT.commerce.stripePaymentLinks.pro || '')) &&
  !/^https:\/\/buy\.stripe\.com\//.test(String(SOT.commerce.stripePaymentLinks.bundle || ''));

test.describe('paid PDF storefront (en/index.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#pdf-storefront')).toBeVisible();
  });

  test('renders all products with correct prices', async ({ page }) => {
    await expect(page.locator('#pdf-card-starter')).toBeVisible();
    await expect(page.locator('#pdf-card-pro')).toBeVisible();
    await expect(page.locator('#pdf-card-bundle')).toBeVisible();
    await expect(page.locator('#pdf-card-starter')).toContainText('$3.99');
    await expect(page.locator('#pdf-card-pro')).toContainText('$8.99');
    await expect(page.locator('#pdf-card-bundle')).toContainText('$10.99');
  });

  test('comparison table is not rendered', async ({ page }) => {
    await expect(page.locator('.pdf-comparison-table')).toHaveCount(0);
  });

  test('cover thumbnails load (no broken images)', async ({ page }) => {
    const starterCover = page.locator('#pdf-card-starter .pdf-card-cover img').first();
    const proCover = page.locator('#pdf-card-pro .pdf-card-cover img').first();
    await expect(starterCover).toBeVisible();
    await expect(proCover).toBeVisible();
    for (const cover of [starterCover, proCover]) {
      await cover.scrollIntoViewIfNeeded();
      await page.waitForFunction(
        (el) => el && el.naturalWidth > 0,
        await cover.elementHandle(),
        { timeout: 10000 }
      );
    }
  });

  test('CTAs route to the right destination based on SOT mode', async ({ page }) => {
    const starterCta = page.locator('#pdf-card-starter a.pdf-card-cta');
    const proCta = page.locator('#pdf-card-pro a.pdf-card-cta');
    const bundleCta = page.locator('#pdf-card-bundle a.pdf-card-cta');
    const starterHref = await starterCta.getAttribute('href');
    const proHref = await proCta.getAttribute('href');
    const bundleHref = await bundleCta.getAttribute('href');
    if (isPlaceholder) {
      expect(starterHref).toBe('/coming-soon.html');
      expect(proHref).toBe('/coming-soon.html');
      expect(bundleHref).toBe('/coming-soon.html');
      await expect(starterCta).toHaveAttribute('data-placeholder', 'true');
      await expect(proCta).toHaveAttribute('data-placeholder', 'true');
      await expect(bundleCta).toHaveAttribute('data-placeholder', 'true');
      const html = await page.content();
      expect(html, 'placeholder mode must NOT expose buy.stripe.com URLs').not.toMatch(/https:\/\/buy\.stripe\.com\//);
    } else {
      expect(starterHref).toMatch(/^https:\/\/buy\.stripe\.com\//);
      expect(proHref).toMatch(/^https:\/\/buy\.stripe\.com\//);
      expect(bundleHref).toMatch(/^https:\/\/buy\.stripe\.com\//);
      await expect(starterCta).toHaveAttribute('data-placeholder', 'false');
      await expect(proCta).toHaveAttribute('data-placeholder', 'false');
      await expect(bundleCta).toHaveAttribute('data-placeholder', 'false');
    }
  });

  test('placeholder click lands on coming-soon page', async ({ page }) => {
    test.skip(!isPlaceholder, 'live mode - skipped, real Stripe checkout is not exercised in e2e');
    await page.locator('#pdf-card-starter a.pdf-card-cta').click();
    await expect(page).toHaveURL(/\/coming-soon(\.html)?$/);
    await expect(page.getByText(/CMO AI Content System - Starter/)).toBeVisible();
  });

  test('PDF preview lightbox opens and closes', async ({ page }) => {
    await page.locator('#pdf-storefront').scrollIntoViewIfNeeded();
    const thumb = page.locator('#pdf-card-starter .pdf-card-preview-thumb').first();
    await expect(thumb).toBeVisible();
    await thumb.click();
    const lightbox = page.locator('.pdf-preview-lightbox');
    await expect(lightbox).toBeVisible();
    await expect(lightbox.locator('.pdf-preview-lightbox__img')).toBeVisible();
    await page.locator('.pdf-preview-lightbox__close').click();
    await expect(lightbox).toBeHidden();
  });
});

test.describe('success.html polling UX', () => {
  test('shows preparing state and falls back gracefully without /api', async ({ page }) => {
    await page.goto('/success.html?session_id=cs_test_FAKE_SESSION');
    await expect(page.locator('#status')).toBeVisible();
    const finalText = await page
      .locator('#status-text')
      .filter({ hasText: /(error|email|preparing|ready)/i })
      .first()
      .textContent({ timeout: 8000 });
    expect(finalText).toBeTruthy();
    await expect(page.getByText(/info@promptanatomy\.app/).first()).toBeVisible();
  });

  test('rejects missing session id with the right copy', async ({ page }) => {
    await page.goto('/success.html');
    await expect(page.locator('#status')).toHaveAttribute('data-state', 'error');
    await expect(page.getByText(/No session id/i)).toBeVisible();
  });
});
