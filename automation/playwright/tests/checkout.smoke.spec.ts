import { test, expect } from '@playwright/test';
import { captureEvidence } from './utils/evidence';

const checkoutUrl = process.env.CHECKOUT_URL || 'https://www.saucedemo.com/';
const checkoutUser = process.env.CHECKOUT_USER || 'standard_user';
const checkoutPassword = process.env.CHECKOUT_PASSWORD || 'secret_sauce';

test.describe('Checkout journey — smoke', () => {
  test('User can progress through checkout overview @checkout', async ({ page }, testInfo) => {
    await page.goto(checkoutUrl);

    await page.getByPlaceholder('Username').fill(checkoutUser);
    await page.getByPlaceholder('Password').fill(checkoutPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify login succeeded before proceeding
    await expect(page).toHaveURL(/inventory/);

    await page.locator('button[data-test^="add-to-cart"]').first().click();
    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByPlaceholder('First Name').fill('Nightwatch');
    await page.getByPlaceholder('Last Name').fill('QA');
    await page.getByPlaceholder('Zip/Postal Code').fill('94107');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Checkout: Overview')).toBeVisible();

    await captureEvidence(page, testInfo, 'checkout');
  });
});
