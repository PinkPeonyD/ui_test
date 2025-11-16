import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pageObjects';
import { AdBlock } from '../src/utils/index.js';

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com', { waitUntil: 'domcontentloaded' });
});

test.describe('Main page navigation', () => {
  test('Navigate to Elements and back to Widgets', async ({ page }) => {
    const mainPage = new MainPage(page);

    await test.step('Open Elements section from home cards', async () => {
      await mainPage.clickCategoryCard('Elements');
      await expect(page).toHaveURL(/.*elements/);
      await expect(page.getByText('Text Box')).toBeVisible();
    });

    await test.step('Return to home and open Widgets section', async () => {
      await page.goto('https://demoqa.com', { waitUntil: 'domcontentloaded' });
      await mainPage.clickCategoryCard('Widgets');
      await expect(page).toHaveURL(/.*widgets/);
      await expect(page.getByText('Accordian')).toBeVisible();
    });
  });
});
