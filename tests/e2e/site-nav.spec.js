'use strict';

/**
 * Page-level sticky #siteNav — bar stays in viewport after the hero
 * and hash targets are not covered by the bar.
 */

const { test, expect } = require('@playwright/test');

test.describe('sticky site nav', () => {
  test('en/ #siteNav stays at the top after scrolling to Pricing', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#siteNav')).toBeVisible();
    await page.locator('#pdf-storefront').scrollIntoViewIfNeeded();
    const navTop = await page.locator('#siteNav').evaluate(function (el) {
      return el.getBoundingClientRect().top;
    });
    expect(navTop).toBeLessThanOrEqual(8);
  });

  test('en/ Brief hash lands below the sticky bar', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('#pdf-storefront').scrollIntoViewIfNeeded();
    await page.locator('#navBrief').click();
    await expect(page).toHaveURL(/#creative-brief/);
    await page.waitForFunction(function () {
      var nav = document.getElementById('siteNav');
      var section = document.getElementById('creative-brief');
      if (!nav || !section) return false;
      return section.getBoundingClientRect().top >= nav.getBoundingClientRect().bottom - 1;
    });
    const clearance = await page.evaluate(function () {
      const nav = document.getElementById('siteNav');
      const section = document.getElementById('creative-brief');
      if (!nav || !section) return null;
      return {
        sectionTop: section.getBoundingClientRect().top,
        navBottom: nav.getBoundingClientRect().bottom
      };
    });
    expect(clearance).not.toBeNull();
    expect(clearance.sectionTop).toBeGreaterThanOrEqual(clearance.navBottom - 1);
  });
});
