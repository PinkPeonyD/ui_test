import { test } from '@playwright/test';
import { AlertsPage, MainPage } from '../src/pageObjects';

test.beforeEach(async ({ page }) => {
  // await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com', { waitUntil: 'domcontentloaded' });
});

test.describe('Check Alert Page', async () => {
  test('Handle Alerts', async ({ page }) => {
    const mainPage = new MainPage(page);
    const alertPage = new AlertsPage(page);
    await test.step('Click on card "Alerts, Frame & Windows"', async () => {
      await mainPage.clickCategoryCard('Alerts, Frame & Windows');
    });

    await test.step('Click on card "Alerts"', async () => {
      await mainPage.clickOnElementCardList('Alerts');
    });

    await test.step('Handle simple alert', async () => {
      page.on('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.accept();
      });
      await alertPage.clickAlertButtonByType('alertButton');
    });
  });
});
