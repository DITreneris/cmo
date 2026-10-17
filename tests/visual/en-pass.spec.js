'use strict';

/**
 * EN visual pass: section screenshots, overflow, sticky bar, and one-sample
 * load / LCP / CLS written to docs/visual/benchmark.json.
 * Run via npm run test:visual. Baselines are host-OS specific.
 */

const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const BENCH_PATH = path.join(__dirname, '..', '..', 'docs', 'visual', 'benchmark.json');

const VIEWPORTS = [
  { name: '320', width: 320, height: 720 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1920', width: 1920, height: 1080 }
];

/**
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
function installVitals(page) {
  return page.addInitScript(function () {
    window.__cls = 0;
    window.__lcp = 0;
    try {
      new PerformanceObserver(function (list) {
        var entries = list.getEntries();
        for (var i = 0; i < entries.length; i++) {
          if (!entries[i].hadRecentInput) window.__cls += entries[i].value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (_err) {
      /* layout-shift is Chromium-only in this suite */
    }
    try {
      new PerformanceObserver(function (list) {
        var entries = list.getEntries();
        var last = entries[entries.length - 1];
        if (last) window.__lcp = last.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (_err) {
      /* LCP observer missing */
    }
  });
}

/**
 * @param {object} sample
 * @returns {void}
 */
function recordSample(sample) {
  const data = JSON.parse(fs.readFileSync(BENCH_PATH, 'utf8'));
  const key = sample.path + '@' + sample.width;
  data.pages = (data.pages || []).filter(function (row) {
    return row.path + '@' + row.width !== key;
  });
  data.pages.push(sample);
  data.pages.sort(function (a, b) {
    if (a.path === b.path) return a.width - b.width;
    return a.path < b.path ? -1 : 1;
  });
  fs.writeFileSync(BENCH_PATH, JSON.stringify(data, null, 2) + '\n');
}

/**
 * @param {import('@playwright/test').Page} page
 * @returns {string[]}
 */
function watchErrors(page) {
  const errors = [];
  page.on('pageerror', function (err) {
    errors.push(err && err.message ? err.message : String(err));
  });
  return errors;
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {{ width: number, height: number }} vp
 * @returns {Promise<void>}
 */
async function setViewport(page, vp) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
}

/**
 * Fonts settled, then a short pause so late shifts land in the CLS observer.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
async function settle(page) {
  await page.evaluate(async function () {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(1000);
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} urlPath
 * @param {number} width
 * @returns {Promise<void>}
 */
async function assertAndRecord(page, urlPath, width) {
  const sample = await page.evaluate(function () {
    const doc = document.documentElement;
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      loadMs: nav && nav.loadEventEnd ? Math.round(nav.loadEventEnd) : 0,
      lcpMs: Math.round(window.__lcp || 0),
      cls: Math.round((window.__cls || 0) * 1000) / 1000,
      overflowPx: doc.scrollWidth - doc.clientWidth
    };
  });
  recordSample({
    path: urlPath,
    width: width,
    loadMs: sample.loadMs,
    lcpMs: sample.lcpMs,
    cls: sample.cls,
    overflowPx: sample.overflowPx
  });
  expect(sample.overflowPx, urlPath + ' overflow @' + width).toBeLessThanOrEqual(1);
  expect(sample.cls, urlPath + ' CLS @' + width).toBeLessThanOrEqual(0.25);
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} blockId
 * @returns {import('@playwright/test').Locator}
 */
function workflowCard(page, blockId) {
  return page.locator('article.prompt').filter({ has: page.locator('#' + blockId) });
}

test.beforeAll(function () {
  fs.mkdirSync(path.dirname(BENCH_PATH), { recursive: true });
  if (!fs.existsSync(BENCH_PATH)) {
    fs.writeFileSync(BENCH_PATH, JSON.stringify({
      date: '2026-10-15',
      browser: 'chromium',
      note: 'One local sample per page and viewport. Load and LCP are recorded only. CLS above 0.25 fails.',
      pages: []
    }, null, 2) + '\n');
  }
});

test.beforeEach(async function ({ page }) {
  await installVitals(page);
});

for (const vp of VIEWPORTS) {
  test('en home ' + vp.name, async function ({ page }) {
    const errors = watchErrors(page);
    await setViewport(page, vp);
    await page.goto('/en/', { waitUntil: 'load' });
    await page.locator('img.hero-sample-image').evaluate(function (img) {
      if (img.complete && img.naturalWidth > 0) return undefined;
      return new Promise(function (resolve, reject) {
        img.addEventListener('load', function () { resolve(undefined); }, { once: true });
        img.addEventListener('error', function () { reject(new Error('hero image failed')); }, { once: true });
      });
    });
    await settle(page);

    const ctaDir = await page.locator('.header-cta').evaluate(function (el) {
      return getComputedStyle(el).flexDirection;
    });
    expect(ctaDir).toBe(vp.width === 320 ? 'column' : 'row');

    const builderOpen = await page.locator('#cb-builder').evaluate(function (el) {
      return el.open === true;
    });
    expect(builderOpen).toBe(true);

    const h1Font = await page.locator('header.header h1').evaluate(function (el) {
      return getComputedStyle(el).fontFamily;
    });
    expect(h1Font.toLowerCase()).toContain('fraunces');

    if (vp.width >= 640) {
      const briefRows = await page.evaluate(function () {
        return Array.prototype.map.call(document.querySelectorAll('fieldset.cb-panel'), function (panel) {
          var wasHidden = panel.hidden;
          panel.hidden = false;
          var fields = panel.querySelectorAll(':scope > .cb-field');
          var last = fields[fields.length - 1];
          var gridColumn = last ? getComputedStyle(last).gridColumn : '';
          panel.hidden = wasHidden;
          return { id: panel.id, count: fields.length, gridColumn: gridColumn };
        });
      });
      briefRows.forEach(function (row) {
        if (row.count % 2 === 0) {
          expect(row.gridColumn, row.id + ' @' + vp.width).not.toMatch(/span 2|1\s*\/\s*-1/);
        }
      });
    }

    const copyInk = await page.locator('#cbCopyBtn').evaluate(function (el) {
      return {
        cursor: getComputedStyle(el).cursor,
        background: getComputedStyle(el).backgroundColor
      };
    });
    expect(copyInk.cursor).toBe('not-allowed');
    expect(copyInk.background).not.toBe('rgb(207, 167, 58)');

    await assertAndRecord(page, '/en/', vp.width);

    await expect(page.locator('#stickyPromptBar')).toBeHidden();

    await expect(page).toHaveScreenshot('en-fold-' + vp.name + '.png');
    await expect(page.locator('header.header')).toHaveScreenshot('en-hero-' + vp.name + '.png');
    await expect(page.locator('#creative-brief')).toHaveScreenshot('en-creative-brief-' + vp.name + '.png');
    await expect(page.locator('#pdf-storefront')).toHaveScreenshot('en-pdf-storefront-' + vp.name + '.png');

    await expect(workflowCard(page, 'block1')).toHaveScreenshot('en-block1-' + vp.name + '.png');
    await expect(page.locator('#cmo-context')).toHaveScreenshot('en-cmo-context-' + vp.name + '.png');
    await expect(workflowCard(page, 'block2')).toHaveScreenshot('en-block2-' + vp.name + '.png');
    await expect(workflowCard(page, 'block3')).toHaveScreenshot('en-block3-' + vp.name + '.png');
    await expect(workflowCard(page, 'block5')).toHaveScreenshot('en-block5-' + vp.name + '.png');

    await expect(page.locator('#cmo-safety')).toHaveScreenshot('en-cmo-safety-' + vp.name + '.png');
    // Section sits inside a closed details; the summary is the visible control.
    await expect(page.locator('details.cmo-scenarios-details')).toHaveScreenshot('en-cmo-scenarios-' + vp.name + '.png');
    await expect(page.locator('#pro-contents')).toHaveScreenshot('en-pro-contents-' + vp.name + '.png');
    await expect(page.locator('#faq')).toHaveScreenshot('en-faq-' + vp.name + '.png');
    await expect(page.locator('#prompt-basics')).toHaveScreenshot('en-prompt-basics-' + vp.name + '.png');
    await expect(page.locator('#ecosystem-strip')).toHaveScreenshot('en-ecosystem-' + vp.name + '.png');
    await expect(page.locator('#community')).toHaveScreenshot('en-community-' + vp.name + '.png');
    await expect(page.locator('footer.footer')).toHaveScreenshot('en-footer-' + vp.name + '.png');

    await page.evaluate(function () {
      var el = document.getElementById('block1');
      var y = el.getBoundingClientRect().top + window.scrollY + el.offsetHeight + 8;
      window.scrollTo(0, y);
    });

    const bar = page.locator('#stickyPromptBar');
    if (vp.width <= 768) {
      await expect(bar).toBeVisible();
      // Fixed bars screenshot as an empty strip; paint them in flow for the baseline.
      await bar.evaluate(function (el) {
        el.style.position = 'relative';
        el.style.left = 'auto';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      });
      await expect(bar).toHaveScreenshot('en-sticky-' + vp.name + '.png');
    } else {
      await expect(bar).toBeHidden();
    }

    expect(errors).toEqual([]);
  });

  test('en privacy ' + vp.name, async function ({ page }) {
    const errors = watchErrors(page);
    await setViewport(page, vp);
    await page.goto('/en/privacy/', { waitUntil: 'load' });
    await settle(page);
    await assertAndRecord(page, '/en/privacy/', vp.width);
    await expect(page).toHaveScreenshot('en-privacy-' + vp.name + '.png', { fullPage: true });
    expect(errors).toEqual([]);
  });

  test('en terms ' + vp.name, async function ({ page }) {
    const errors = watchErrors(page);
    await setViewport(page, vp);
    await page.goto('/terms/', { waitUntil: 'load' });
    await settle(page);
    await assertAndRecord(page, '/terms/', vp.width);
    await expect(page).toHaveScreenshot('en-terms-' + vp.name + '.png', { fullPage: true });
    expect(errors).toEqual([]);
  });

  test('en success ' + vp.name, async function ({ page }) {
    const errors = watchErrors(page);
    await page.route('**/api/download-link**', function (route) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ downloadUrl: '/api/download?token=visual-pass' })
      });
    });
    await setViewport(page, vp);
    await page.goto('/success.html?session_id=cs_test_visual', { waitUntil: 'load' });
    await expect(page.locator('#status-text')).toHaveText('Your download is ready.');
    const downloadInk = await page.locator('#download-btn').evaluate(function (el) {
      return getComputedStyle(el).color;
    });
    expect(downloadInk).toBe('rgb(255, 255, 255)');
    await settle(page);
    await assertAndRecord(page, '/success.html', vp.width);
    await expect(page).toHaveScreenshot('en-success-' + vp.name + '.png', { fullPage: true });
    expect(errors).toEqual([]);
  });
}
