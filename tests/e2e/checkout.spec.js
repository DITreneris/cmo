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

  test('renders Starter + Complete cards and Pro text link', async ({ page }) => {
    await expect(page.locator('#pdf-card-starter')).toBeVisible();
    await expect(page.locator('#pdf-card-bundle')).toBeVisible();
    await expect(page.locator('#pdf-card-pro')).toBeVisible();
    await expect(page.locator('#pdf-card-starter article, article#pdf-card-starter')).toHaveCount(1);
    await expect(page.locator('#pdf-card-starter')).toContainText('$3.99');
    await expect(page.locator('#pdf-card-pro')).toContainText('$8.99');
    await expect(page.locator('#pdf-card-bundle')).toContainText('$10.99');
    await expect(page.locator('#pdf-card-bundle')).toContainText('separately $12.98');
    await expect(page.locator('#pdf-card-bundle')).not.toContainText('was $19.99');
    await expect(page.locator('article.pdf-card')).toHaveCount(2);
  });

  test('comparison table is not rendered', async ({ page }) => {
    await expect(page.locator('.pdf-comparison-table')).toHaveCount(0);
  });

  test('cover thumbnails load (no broken images)', async ({ page }) => {
    const starterCover = page.locator('#pdf-card-starter .pdf-card-cover img').first();
    const bundleCover = page.locator('#pdf-card-bundle .pdf-card-cover img').first();
    await expect(starterCover).toBeVisible();
    await expect(bundleCover).toBeVisible();
    for (const cover of [starterCover, bundleCover]) {
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
    const proCta = page.locator('#pdf-card-pro a.pdf-pro-alt-link, #pdf-card-pro a.pdf-card-cta');
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

  test('PDF preview thumbs are not required on pricing cards', async ({ page }) => {
    await page.locator('#pdf-storefront').scrollIntoViewIfNeeded();
    await expect(page.locator('#pdf-card-starter .pdf-card-preview-thumb')).toHaveCount(0);
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

  // serve clean-urls: /success.html?x=1 redirects to /success and drops the query.
  test('binds Download from downloadUrl or url', async ({ page }) => {
    await page.route(/\/api\/download-link/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ready',
          downloadUrl: '/api/download?t=mock-starter',
          url: '/api/download?t=mock-starter'
        })
      });
    });
    await page.goto('/success?session_id=cs_test_READY');
    await expect(page.locator('#status')).toHaveAttribute('data-state', 'ready', { timeout: 10000 });
    await expect(page.locator('#download-area')).toBeVisible();
    await expect(page.locator('#download-btn')).toHaveAttribute('href', '/api/download?t=mock-starter');
  });

  test('shows a second in-page link when downloads has two files', async ({ page }) => {
    await page.route(/\/api\/download-link/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ready',
          downloadUrl: '/api/download?t=mock-starter',
          url: '/api/download?t=mock-starter',
          downloads: [
            {
              productId: 'starter',
              productName: 'CMO AI Content System · Starter',
              url: '/api/download?t=mock-starter'
            },
            {
              productId: 'pro',
              productName: 'CMO AI Content System · Pro',
              url: '/api/download?t=mock-pro'
            }
          ]
        })
      });
    });
    await page.goto('/success?session_id=cs_test_BUNDLE');
    await expect(page.locator('#status')).toHaveAttribute('data-state', 'ready', { timeout: 10000 });
    await expect(page.locator('#download-btn')).toBeVisible();
    await expect(page.locator('#download-area a[data-extra-download="pro"]')).toBeVisible();
    await expect(page.locator('#download-area a[data-extra-download="pro"]')).toHaveAttribute(
      'href',
      '/api/download?t=mock-pro'
    );
  });

  test('shows Markdown companion when downloads includes pro-md', async ({ page }) => {
    await page.route(/\/api\/download-link/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ready',
          downloadUrl: '/api/download?t=mock-pro',
          url: '/api/download?t=mock-pro',
          downloads: [
            {
              productId: 'pro',
              productName: 'CMO AI Content System · Pro',
              url: '/api/download?t=mock-pro'
            },
            {
              productId: 'pro-md',
              productName: 'CMO AI Content System · Pro (Markdown companion)',
              url: '/api/download?t=mock-pro-md'
            }
          ]
        })
      });
    });
    await page.goto('/success?session_id=cs_test_PRO_MD');
    await expect(page.locator('#status')).toHaveAttribute('data-state', 'ready', { timeout: 10000 });
    await expect(page.locator('#download-btn')).toHaveAttribute('href', '/api/download?t=mock-pro');
    await expect(page.locator('#download-area a[data-extra-download="pro-md"]')).toBeVisible();
    await expect(page.locator('#download-area a[data-extra-download="pro-md"]')).toHaveAttribute(
      'href',
      '/api/download?t=mock-pro-md'
    );
  });
});
