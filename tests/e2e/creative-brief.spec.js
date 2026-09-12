'use strict';

/**
 * Creative brief builder — EN-only free tool (open by default).
 */

const { test, expect } = require('@playwright/test');

test.describe('creative brief builder', () => {
  test('en/ shows open #creative-brief; builder works without extra click', async ({ page }) => {
    await page.goto('/en/');
    const section = page.locator('#creative-brief');
    await expect(section).toBeVisible();
    await expect(page.locator('img.hero-sample-image')).toBeVisible();
    await expect(page.locator('#progressJumpCreative')).toBeVisible();
    await expect(page.locator('#cb-builder')).toBeVisible();
    await expect(page.locator('#cb-builder')).toHaveAttribute('open', '');

    const activeId = await page.evaluate(function () {
      return document.activeElement && document.activeElement.id;
    });
    expect(activeId).not.toBe('cbCampaignGoal');

    await expect(page.locator('#cbOutput')).toBeVisible();
    await expect(page.locator('#cbPanelVisual')).toBeHidden();
    await expect(page.locator('#cbPanelText')).toBeHidden();
    await page.locator('[data-cb-step="2"]').click();
    await expect(page.locator('#cbPanelVisual')).toBeVisible();
    await expect(page.locator('#cbPanelContext')).toBeHidden();
    await page.locator('[data-cb-step="1"]').click();
    await expect(page.locator('#cbPanelContext')).toBeVisible();
    await expect(page.locator('#cbPanelVisual')).toBeHidden();

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
