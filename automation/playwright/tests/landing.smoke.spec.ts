import { test, expect } from '@playwright/test';
import { captureEvidence } from './utils/evidence';

const landingUrl = process.env.LANDING_URL || process.env.BASE_URL || 'https://playwright.dev/';

test.describe('Landing experience', () => {
  test('Landing hero renders key CTA @landing', async ({ page }, testInfo) => {
    await page.goto(landingUrl, { waitUntil: 'domcontentloaded' });

    const heroSelector = 'h1';
    await expect(page.locator(heroSelector)).toBeVisible();

    const cta = page.locator('a:has-text("Get started")');
    await expect(cta.first()).toBeVisible();

    await captureEvidence(page, testInfo, 'landing');
  });
});
