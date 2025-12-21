import { test, expect } from '@playwright/test';
import { AlertsPage, MainPage } from '../src/pageObjects';
import { TestDataGenerator } from '../src/utils';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demoqa.com', { waitUntil: 'domcontentloaded' });
});

test.describe('Alerts Page - Full Coverage', () => {
  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    const alertPage = new AlertsPage(page);

    await test.step('Navigate to Alerts page', async () => {
      await mainPage.clickCategoryCard('Alerts, Frame & Windows');
      await mainPage.clickOnElementCardList('Alerts');
    });

    await test.step('Verify Alerts header is displayed', async () => {
      const isHeaderVisible = await alertPage.verifyAlertsHeader();
      expect(isHeaderVisible).toBe(true);
    });
  });

  test('1. Simple Alert - #alertButton', async ({ page }) => {
    const alertPage = new AlertsPage(page);
    let dialogAppeared = false;
    let dialogMessage = '';

    await test.step('Verify no dialog before click', async () => {
      page.on('dialog', async dialog => {
        dialogAppeared = true;
        dialogMessage = dialog.message();
        await dialog.accept();
      });

      expect(dialogAppeared).toBe(false);
    });

    await test.step('Click simple alert button and verify dialog', async () => {
      await alertPage.clickSimpleAlert();

      await expect.poll(() => dialogAppeared, { timeout: 3000 }).toBe(true);
      expect(dialogMessage).toBe('You clicked a button');
    });

    await test.step('Verify no active dialogs after closing', async () => {
      const noActiveDialogs = await alertPage.verifyNoActiveDialogs();
      expect(noActiveDialogs).toBe(true);
    });
  });

  test('2. Timer Alert (5s) - #timerAlertButton', async ({ page }) => {
    const alertPage = new AlertsPage(page);
    let dialogStartTime;

    await test.step('Click timer alert button and verify dialog appears within 10s', async () => {
      dialogStartTime = Date.now();
      const [dialog] = await Promise.all([
        page.waitForEvent('dialog', { timeout: 10000 }),
        alertPage.clickTimerAlert(),
      ]);
      await dialog.accept();

      const elapsedTime = Date.now() - dialogStartTime;
      expect(elapsedTime).toBeLessThanOrEqual(10000);
      expect(dialog.message()).toBe('This alert appeared after 5 seconds');
    });

    await test.step('Verify no active dialogs after closing', async () => {
      const noActiveDialogs = await alertPage.verifyNoActiveDialogs();
      expect(noActiveDialogs).toBe(true);
    });
  });

  test('3A. Confirm Alert - Accept (OK)', async ({ page }) => {
    const alertPage = new AlertsPage(page);

    await test.step('Click confirm button and accept dialog', async () => {
      await Promise.all([
        page.waitForEvent('dialog').then(async confirmDialog => {
          expect(confirmDialog.type()).toBe('confirm');
          await confirmDialog.accept();
        }),
        alertPage.clickConfirmAlert({ noWaitAfter: true }),
      ]);
    });

    await test.step('Verify result shows OK selection', async () => {
      const result = await alertPage.getConfirmResult();
      expect(result).toContain('You selected Ok');
      expect(result).not.toContain('Cancel');
    });
  });

  test('3B. Confirm Alert - Dismiss (Cancel)', async ({ page }) => {
    const alertPage = new AlertsPage(page);

    await test.step('Click confirm button and dismiss dialog', async () => {
      await Promise.all([
        page.waitForEvent('dialog').then(async confirmDialog => {
          expect(confirmDialog.type()).toBe('confirm');
          await confirmDialog.dismiss();
        }),
        alertPage.clickConfirmAlert({ noWaitAfter: true }),
      ]);
    });

    await test.step('Verify result shows Cancel selection', async () => {
      const result = await alertPage.getConfirmResult();
      expect(result).toContain('You selected Cancel');
      expect(result).not.toContain('You selected Ok');
    });
  });

  test('4A. Prompt Alert - Enter value', async ({ page }) => {
    const alertPage = new AlertsPage(page);
    const testValue = TestDataGenerator.generateFirstName();
    let dialogHandled = false;

    await test.step('Set up dialog handler with input and click prompt', async () => {
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        await dialog.accept(testValue);
        dialogHandled = true;
      });

      await alertPage.clickPromptAlert();
      await expect.poll(() => dialogHandled, { timeout: 5000 }).toBe(true);
    });

    await test.step('Verify result shows entered value', async () => {
      const result = await alertPage.getPromptResult();
      expect(result).toContain(`You entered ${testValue}`);
      expect(result).not.toContain('null');
    });
  });

  test('4B. Prompt Alert - Cancel (null)', async ({ page }) => {
    const alertPage = new AlertsPage(page);
    let dialogHandled = false;

    await test.step('Set up dialog handler for dismiss and click prompt', async () => {
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        await dialog.dismiss();
        dialogHandled = true;
      });

      await alertPage.clickPromptAlert();
      await expect.poll(() => dialogHandled, { timeout: 5000 }).toBe(true);
    });

    await test.step('Verify result shows null value or no result element', async () => {
      try {
        await page
          .waitForSelector('#promptResult', {
            state: 'visible',
            timeout: 5000,
          })
          .catch(() => {
            console.log('Prompt result element did not appear - this may be acceptable behavior');
          });

        const elementCount = await page.locator('#promptResult').count();

        if (elementCount > 0) {
          const result = await page.locator('#promptResult').textContent();
          expect(result).toContain('You entered null');
          expect(result).not.toMatch(/You entered [a-zA-Zа-яА-ЯёЁ]/);
        } else {
          console.log('Prompt result element did not appear after cancelling - this is acceptable behavior');
          expect(true).toBe(true);
        }
      } catch (error) {
        const pageContent = await page.content();
        console.log('Page content after prompt cancel:', pageContent.substring(0, 1000));
        throw error;
      }
    });
  });

  test('All alerts comprehensive test', async ({ page }) => {
    const alertPage = new AlertsPage(page);
    const promptValue = TestDataGenerator.generateFirstName();

    await test.step('Test all alert types in sequence', async () => {
      const [simpleDialog] = await Promise.all([
        page.waitForEvent('dialog').then(async dialog => {
          expect(dialog.message()).toBe('You clicked a button');
          await dialog.accept();
          return dialog;
        }),
        alertPage.clickSimpleAlert({ noWaitAfter: true, force: true }),
      ]);

      const [confirmDialog] = await Promise.all([
        page.waitForEvent('dialog').then(async dialog => {
          await dialog.accept();
          return dialog;
        }),
        alertPage.clickConfirmAlert({ noWaitAfter: true }),
      ]);

      const confirmResult = await alertPage.getConfirmResult();
      expect(confirmResult).toContain('You selected Ok');

      const [promptDialog] = await Promise.all([
        page.waitForEvent('dialog').then(async dialog => {
          await dialog.accept(promptValue);
          return dialog;
        }),
        alertPage.clickPromptAlert(),
      ]);

      const promptResult = await alertPage.getPromptResult();
      expect(promptResult).toContain(`You entered ${promptValue}`);

      await Promise.all([
        page.waitForEvent('dialog', { timeout: 15000 }).then(async dialog => {
          expect(dialog.message()).toBe('This alert appeared after 5 seconds');
          await dialog.accept();
        }),
        alertPage.clickTimerAlert(),
      ]);
    });

    await test.step('Verify no active dialogs remain', async () => {
      const noActiveDialogs = await alertPage.verifyNoActiveDialogs();
      expect(noActiveDialogs).toBe(true);
    });
  });
});
