import { test } from '@playwright/test';
import { AdBlock } from '../src/utils/index.js';

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com', { waitUntil: 'domcontentloaded' });
});

test('Click on category card', async () => {});
