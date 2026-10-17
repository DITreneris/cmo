'use strict';

/**
 * Creative brief builder — EN-only free tool (open by default).
 */

const { test, expect } = require('@playwright/test');

/**
 * Even field counts must stay in two columns. The legend is not a field.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
async function expectEvenBriefRows(page) {
  const rows = await page.evaluate(function () {
    return Array.prototype.map.call(document.querySelectorAll('fieldset.cb-panel'), function (panel) {
      var wasHidden = panel.hidden;
      panel.hidden = false;
      var fields = panel.querySelectorAll(':scope > .cb-field:not(.cb-field--choices):not(.cb-field--span)');
      var last = fields[fields.length - 1];
      var gridColumn = last ? getComputedStyle(last).gridColumn : '';
      panel.hidden = wasHidden;
      return { id: panel.id, count: fields.length, gridColumn: gridColumn };
    });
  });
  rows.forEach(function (row) {
    if (row.count % 2 === 0) {
      expect(row.gridColumn, row.id).not.toMatch(/span 2|1\s*\/\s*-1/);
    }
  });
}

test.describe('creative brief builder', () => {
  test('en/ shows open #creative-brief; builder works without extra click', async ({ page }) => {
    await page.goto('/en/');
    const section = page.locator('#creative-brief');
    await expect(section).toBeVisible();
    await expect(page.locator('img.hero-sample-image')).toBeVisible();
    await expect(page.locator('#progressJump')).toBeVisible();
    await expect(page.locator('#progressJump')).toContainText('Plan');
    await expect(page.locator('#progressJump')).toContainText('Improve');
    await expect(page.locator('#progressJump')).not.toContainText('Pricing');
    await expect(page.locator('#progressJumpCreative')).toHaveCount(0);
    await expect(page.locator('#cb-builder')).toBeVisible();
    await expect(page.locator('#cb-builder')).toHaveAttribute('open', '');
    await expect(page.locator('#creative-brief .cb-eyebrow')).toHaveCount(0);
    await expect(page.locator('#creative-brief .cb-lead')).toHaveCount(0);
    await expect(page.locator('#cbSampleBtn')).toHaveCount(0);
    await expect(page.locator('.cb-presets-label')).toHaveText('Try an example');

    const activeId = await page.evaluate(function () {
      return document.activeElement && document.activeElement.id;
    });
    expect(activeId).not.toBe('cbCampaignGoal');

    await expect(page.locator('#cbOutput')).toBeVisible();
    await expect(page.locator('#cbCopyBtn')).toBeDisabled();
    await expect(page.locator('#cbQualityBadge')).toHaveText('Just started');
    await page.setViewportSize({ width: 1024, height: 768 });
    const openStage = await page.locator('.cb-stage').evaluate(function (el) {
      var stage = el.getBoundingClientRect();
      var wrap = el.querySelector('.cb-output-wrap');
      var sheet = el.querySelector('.cb-output-sheet');
      var output = wrap.getBoundingClientRect();
      var sheetBox = sheet.getBoundingClientRect();
      var field = el.querySelector('#cbOutput').getBoundingClientRect();
      var wrapStyle = getComputedStyle(wrap);
      return {
        stageHeight: stage.height,
        innerHeight: window.innerHeight,
        bottomDelta: Math.abs(output.bottom - stage.bottom),
        sheetBottomDelta: Math.abs(sheetBox.bottom - stage.bottom),
        outputHeight: field.height,
        wrapBg: wrapStyle.backgroundColor
      };
    });
    expect(openStage.stageHeight).toBeLessThanOrEqual(openStage.innerHeight + 1);
    expect(openStage.bottomDelta).toBeLessThanOrEqual(2);
    expect(openStage.sheetBottomDelta).toBeLessThanOrEqual(8);
    expect(openStage.outputHeight).toBeGreaterThan(72);
    expect(openStage.wrapBg).toBe('rgba(0, 0, 0, 0)');
    await expectEvenBriefRows(page);
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
    await expect(page.locator('[data-cb-preset="ecommerce"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-cb-preset="ecommerce"]')).toHaveCSS('background-color', 'rgb(238, 230, 216)');
    await expect(page.locator('[data-cb-preset="ecommerce"]')).toHaveCSS('color', 'rgb(15, 23, 42)');

    const filledField = page.locator('#cbAudience');
    await expect(filledField).toHaveCSS('border-top-color', 'rgb(15, 23, 42)');
    await expect(page.locator('#cbCampaignGoal')).toHaveValue('Conversion');
    const picked = page.locator('#cbPanelContext .cb-choice[aria-pressed="true"]').first();
    await expect(picked).toHaveText('Conversion');
    await expect(picked).toHaveCSS('border-top-color', 'rgb(15, 23, 42)');
    await expect(picked).toHaveCSS('background-color', 'rgb(238, 230, 216)');
    await expect(picked).toHaveCSS('color', 'rgb(15, 23, 42)');

    const stepTwo = page.locator('.cb-step[data-cb-step="2"]');
    await expect(stepTwo).toHaveClass(/is-complete/);
    await expect(stepTwo).not.toHaveClass(/is-active/);
    await expect(stepTwo).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    const toolCount = await page.locator('.cb-tool-btn').count();
    expect(toolCount).toBe(2);
    const toolBg = await page.locator('.cb-tool-btn').first().evaluate(function (el) {
      return getComputedStyle(el).backgroundColor;
    });
    expect(toolBg).toBe('rgba(0, 0, 0, 0)');

    // Quiet summary at 900px has no box, so Playwright's hit-test click never lands. DOM click still toggles.
    await page.locator('#cb-builder-summary').evaluate(function (el) {
      el.click();
    });
    await expect(page.locator('#cbForm')).toBeHidden();
    await expect(page.locator('#cbOutput')).toBeVisible();
    const closedMax = await page.locator('.cb-stage').evaluate(function (el) {
      return getComputedStyle(el).maxHeight;
    });
    expect(closedMax).toBe('none');
    await page.locator('#cb-builder-summary').evaluate(function (el) {
      el.click();
    });
    await expect(page.locator('#cb-builder')).toHaveAttribute('open', '');

    await page.setViewportSize({ width: 390, height: 844 });
    const mobileStage = await page.locator('.cb-stage').evaluate(function (el) {
      return {
        maxHeight: getComputedStyle(el).maxHeight,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });
    expect(mobileStage.maxHeight).toBe('none');
    expect(mobileStage.scrollWidth).toBe(mobileStage.clientWidth);
    await expect(page.locator('#cb-builder-summary')).toBeVisible();
  });

  test('lt/ does not include #creative-brief', async ({ page }) => {
    await page.goto('/lt/');
    await expect(page.locator('#creative-brief')).toHaveCount(0);
  });
});
