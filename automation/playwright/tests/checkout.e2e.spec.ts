import { test, expect } from '@playwright/test';
import { captureEvidence } from './utils/evidence';

const checkoutUrl = process.env.CHECKOUT_URL || 'https://www.saucedemo.com/';
const checkoutUser = process.env.CHECKOUT_USER || 'standard_user';
const checkoutPassword = process.env.CHECKOUT_PASSWORD || 'secret_sauce';

test.describe('Checkout E2E — full journey', () => {
  test('Happy path: login → add to cart → complete order @checkout @e2e', async ({ page }, testInfo) => {
    // ── Step 1: Login ────────────────────────────────────────────────────────
    await page.goto(checkoutUrl);
    await page.getByPlaceholder('Username').fill(checkoutUser);
    await page.getByPlaceholder('Password').fill(checkoutPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await captureEvidence(page, testInfo, 'e2e-1-inventory');

    // ── Step 2: Add first item to cart ───────────────────────────────────────
    const firstAddButton = page.locator('button[data-test^="add-to-cart"]').first();
    const firstItemName = await page
      .locator('.inventory_item_name')
      .first()
      .textContent();
    await firstAddButton.click();

    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    await captureEvidence(page, testInfo, 'e2e-2-item-added');

    // ── Step 3: Review cart ──────────────────────────────────────────────────
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart/);

    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);
    if (firstItemName) {
      await expect(page.locator('.inventory_item_name').first()).toHaveText(firstItemName);
    }
    await captureEvidence(page, testInfo, 'e2e-3-cart');

    // ── Step 4: Start checkout ───────────────────────────────────────────────
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page).toHaveURL(/checkout-step-one/);

    // ── Step 5: Fill shipping information ───────────────────────────────────
    await page.getByPlaceholder('First Name').fill('Nightwatch');
    await page.getByPlaceholder('Last Name').fill('QA');
    await page.getByPlaceholder('Zip/Postal Code').fill('94107');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/checkout-step-two/);

    // ── Step 6: Verify order overview ───────────────────────────────────────
    await expect(page.getByText('Checkout: Overview')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await captureEvidence(page, testInfo, 'e2e-4-overview');

    // ── Step 7: Complete order ───────────────────────────────────────────────
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.getByText(/thank you for your order/i)).toBeVisible();
    await captureEvidence(page, testInfo, 'e2e-5-confirmation');
  });

  test('Login failure — locked-out user sees error @checkout @e2e', async ({ page }, testInfo) => {
    await page.goto(checkoutUrl);
    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill(checkoutPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    const errorBanner = page.locator('[data-test="error"]');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(/locked out/i);
    // URL should stay on the login page
    await expect(page).toHaveURL(checkoutUrl);
    await captureEvidence(page, testInfo, 'e2e-login-locked');
  });

  test('Login validation — empty credentials show required-field error @checkout @e2e', async ({ page }, testInfo) => {
    await page.goto(checkoutUrl);
    await page.getByRole('button', { name: 'Login' }).click();

    const errorBanner = page.locator('[data-test="error"]');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(/username is required/i);
    await captureEvidence(page, testInfo, 'e2e-login-empty');
  });

  test('Checkout info validation — empty shipping form shows error @checkout @e2e', async ({ page }, testInfo) => {
    await page.goto(checkoutUrl);
    await page.getByPlaceholder('Username').fill(checkoutUser);
    await page.getByPlaceholder('Password').fill(checkoutPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory/);

    await page.locator('button[data-test^="add-to-cart"]').first().click();
    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Submit without filling shipping info
    await page.getByRole('button', { name: 'Continue' }).click();

    const errorBanner = page.locator('[data-test="error"]');
    await expect(errorBanner).toBeVisible();
    await captureEvidence(page, testInfo, 'e2e-shipping-empty');
  });
});
