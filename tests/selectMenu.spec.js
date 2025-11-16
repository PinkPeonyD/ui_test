import { test, expect } from '@playwright/test';
import { SelectMenuPage } from '../src/pageObjects';
import AdBlock from '../src/utils/AdBlock.js';

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
});

test.describe('Select Menu page', () => {
  test('Select Value, Select One, Old Style, Multiselect', async ({ page }) => {
    const selectPage = new SelectMenuPage(page);

    await test.step('Open Select Menu page', async () => {
      await selectPage.open();
    });

    await test.step('Select Value → Group 2, option 1', async () => {
      await selectPage.chooseSelectValue('Group 2, option 1');
      const value = await selectPage.getDisplayedSelectValue();
      expect(value).toBe('Group 2, option 1');
    });

    await test.step('Select One → Other', async () => {
      await selectPage.chooseSelectOne('Other');
      const value = await selectPage.getDisplayedSelectOne();
      expect(value).toBe('Other');
    });

    await test.step('Old Style Select Menu → Green', async () => {
      await selectPage.chooseOldStyle('Green');
      const value = await selectPage.getDisplayedOldStyle();
      expect(value).toBe('Green');
    });

    await test.step('Multiselect → Black, Blue', async () => {
      await selectPage.chooseMulti(['Black', 'Blue']);
      const values = await selectPage.getDisplayedMultiValues();
      expect(values).toEqual(expect.arrayContaining(['Black', 'Blue']));
      expect(values.length).toBe(2);
    });
  });

  test('Negative: Verify default states', async ({ page }) => {
    const selectPage = new SelectMenuPage(page);

    await test.step('Open Select Menu page', async () => {
      await selectPage.open();
    });

    await test.step('Verify Select Value has placeholder', async () => {
      const value = await page.locator('#withOptGroup').textContent();
      expect(value).toContain('Select');
    });

    await test.step('Verify Select One has placeholder', async () => {
      const value = await page.locator('#selectOne').textContent();
      expect(value).toContain('Select');
    });
  });

  test('Negative: Multiple selection in single-select', async ({ page }) => {
    const selectPage = new SelectMenuPage(page);

    await test.step('Open Select Menu page', async () => {
      await selectPage.open();
    });

    await test.step('Select first value', async () => {
      await selectPage.chooseSelectOne('Mrs.');
      const value1 = await selectPage.getDisplayedSelectOne();
      expect(value1).toBe('Mrs.');
    });

    await test.step('Select second value - should replace first', async () => {
      await selectPage.chooseSelectOne('Other');
      const value2 = await selectPage.getDisplayedSelectOne();
      expect(value2).toBe('Other');
      expect(value2).not.toBe('Mrs.');
    });
  });

  test('Positive: Multiselect with 3 colors', async ({ page }) => {
    const selectPage = new SelectMenuPage(page);

    await test.step('Open Select Menu page', async () => {
      await selectPage.open();
    });

    await test.step('Select multiple colors', async () => {
      await selectPage.chooseMulti(['Red', 'Green', 'Blue']);
      const values = await selectPage.getDisplayedMultiValues();
      expect(values).toEqual(expect.arrayContaining(['Red', 'Green', 'Blue']));
      expect(values.length).toBe(3);
    });
  });
});
