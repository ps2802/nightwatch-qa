import { test, expect } from '@playwright/test';
import { captureEvidence } from './utils/evidence';

const landingUrl = process.env.LANDING_URL || process.env.BASE_URL || 'https://playwright.dev/';

test.describe('Landing experience — smoke', () => {
  test('Landing hero renders key CTA @landing', async ({ page }, testInfo) => {
    const response = await page.goto(landingUrl, { waitUntil: 'domcontentloaded' });

    // Page must load successfully
    expect(response?.status()).toBeLessThan(400);

    // Primary headline must be visible
    await expect(page.locator('h1').first()).toBeVisible();

    // Page must have a meaningful title
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);

    // Primary CTA must be present and actionable
    const cta = page.locator('a:has-text("Get started")');
    await expect(cta.first()).toBeVisible();
    const href = await cta.first().getAttribute('href');
    expect(href).toBeTruthy();

    await captureEvidence(page, testInfo, 'landing');
  });
});
