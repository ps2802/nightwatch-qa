import { test, expect } from '@playwright/test';
import { captureEvidence } from './utils/evidence';

const signupUrl = process.env.SIGNUP_URL || 'https://demo.playwright.dev/todomvc';

test.describe('Signup/onboarding flow', () => {
  test('User can create a placeholder record @signup', async ({ page }, testInfo) => {
    await page.goto(signupUrl);

    const newTodo = page.locator('.new-todo');
    await expect(newTodo).toBeVisible();
    await newTodo.fill('Nightwatch smoke user');
    await newTodo.press('Enter');

    const todoItems = page.locator('.todo-list li');
    await expect(todoItems.first()).toContainText('Nightwatch smoke user');

    await captureEvidence(page, testInfo, 'signup');
  });
});
