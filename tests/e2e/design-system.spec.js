'use strict';

/**
 * DS 1.6.2 computed style on /en/.
 * Desktop project is 1280×720. The stack check sets 480px itself.
 */

const { test, expect } = require('@playwright/test');

/**
 * @param {import('@playwright/test').Locator} locator
 * @param {string} prop
 * @returns {Promise<string>}
 */
function css(locator, prop) {
  return locator.evaluate(function (el, name) {
    return getComputedStyle(el).getPropertyValue(name).trim();
  }, prop);
}

test.describe('DS 1.6.2 computed style', () => {
  test('en/ desktop hero is a flat gold row', async ({ page }) => {
    await page.goto('/en/');
    const spine = page.locator('#heroCtaSpine');
    await expect(spine).toBeVisible();
    expect(await css(spine, 'background-color')).toBe('rgb(207, 167, 58)');
    expect(await css(spine, 'box-shadow')).toBe('none');
    await spine.hover();
    expect(await css(spine, 'transform')).toBe('none');

    expect(await css(page.locator('#heroCtaBrief'), 'background-color')).toBe('rgba(0, 0, 0, 0)');
    expect(await css(page.locator('.header-cta'), 'flex-direction')).toBe('row');
    expect(await css(page.locator('#navPricing'), 'background-color')).toBe('rgba(0, 0, 0, 0)');
    expect(await css(page.locator('.hero-diagram'), 'max-width')).toBe('460px');
    expect(await css(page.locator('#hero-diagram-label'), 'color')).toBe('rgb(168, 181, 199)');
  });

  test('en/ hero CTA stacks below 481px', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    await page.goto('/en/');
    expect(await css(page.locator('.header-cta'), 'flex-direction')).toBe('column');
  });

  test('en/ Starter buy button is flat gold', async ({ page }) => {
    await page.goto('/en/');
    const starter = page.locator('a.pdf-card-cta[data-product-id="starter"]');
    await starter.scrollIntoViewIfNeeded();
    expect(await css(starter, 'background-color')).toBe('rgb(207, 167, 58)');
    expect(await css(starter, 'box-shadow')).toBe('none');
  });
});
