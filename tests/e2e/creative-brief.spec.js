'use strict';

/**
 * Creative brief builder — EN-only free tool (collapsed by default).
 */

const { test, expect } = require('@playwright/test');

test.describe('creative brief builder', () => {
  test('en/ shows #creative-brief teaser; builder works after open', async ({ page }) => {
    await page.goto('/en/');
    const section = page.locator('#creative-brief');
    await expect(section).toBeVisible();
    await expect(page.locator('#progressJumpCreative')).toBeVisible();
    await expect(page.locator('#cb-builder')).toBeVisible();

    await page.locator('#cb-builder-summary').click();
    await expect(page.locator('#cbOutput')).toBeVisible();

    await page.locator('[data-cb-preset="ecommerce"]').click();
    const output = page.locator('#cbOutput');
    await expect(output).not.toHaveValue('');
    await expect(output).toHaveValue(/Luxury leather handbag|marketing purpose|Conversion/i);

    const copyBtn = page.locator('#cbCopyBtn');
    await expect(copyBtn).toBeEnabled();

    const toolCount = await page.locator('.cb-tool-btn').count();
    expect(toolCount).toBe(2);
  });

  test('lt/ does not include #creative-brief', async ({ page }) => {
    await page.goto('/lt/');
    await expect(page.locator('#creative-brief')).toHaveCount(0);
  });
});
