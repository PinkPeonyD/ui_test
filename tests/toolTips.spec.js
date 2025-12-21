import { test, expect } from '@playwright/test';
import { ToolTipsPage } from '../src/pageObjects';
import AdBlock from '../src/utils/AdBlock.js';

const expected = {
  button: 'You hovered over the Button',
  textField: 'You hovered over the text field',
  contrary: 'You hovered over the Contrary',
  section: 'You hovered over the 1.10.32',
};

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
});

test.describe('Tool Tips page', () => {
  test('Hover each element and verify tooltip text', async ({ page }) => {
    const pageObj = new ToolTipsPage(page);

    await test.step('Open Tool Tips page', async () => {
      await pageObj.open();
    });

    await test.step('Check tooltip for Button', async () => {
      const text = await pageObj.getButtonTooltipText();
      expect(text).toBe(expected.button);
    });

    await test.step('Check tooltip for Text Field', async () => {
      const text = await pageObj.getTextFieldTooltipText();
      expect(text).toBe(expected.textField);
    });

    await test.step('Check tooltip for Contrary link', async () => {
      const text = await pageObj.getContraryLinkTooltipText();
      expect(text).toBe(expected.contrary);
    });

    await test.step('Check tooltip for Section link', async () => {
      const text = await pageObj.getSectionLinkTooltipText();
      expect(text).toBe(expected.section);
    });
  });

  test('Negative: Tooltip is hidden without hover and disappears afterwards', async ({ page }) => {
    const pageObj = new ToolTipsPage(page);

    await test.step('Open Tool Tips page', async () => {
      await pageObj.open();
    });

    await test.step('Tooltip is not visible without hovering', async () => {
      await expect(pageObj.tooltipVisible).toHaveCount(0);
    });

    await test.step('Hover button to show tooltip', async () => {
      await pageObj.showTooltip(pageObj.toolTipButton);
    });

    await test.step('Move cursor away and ensure tooltip hides again', async () => {
      await pageObj.clearTooltip();
    });
  });
});
