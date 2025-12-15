import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class ToolTipsPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = 'https://demoqa.com/tool-tips';

    this.toolTipButton = page.locator('#toolTipButton');
    this.toolTipTextField = page.locator('#toolTipTextField');
    this.contraryLink = page.locator('//a[normalize-space()="Contrary"]');
    this.sectionLink = page.locator('//a[normalize-space()="1.10.32"]');

    this.tooltipVisible = page.locator('[role="tooltip"]:visible');
    this.tooltipInner = this.tooltipVisible.locator('.tooltip-inner');
  }

  async open() {
    await this.navigateTo(this.url);
    await this.page.waitForLoadState('load');
    await this.toolTipButton.waitFor({ state: 'visible' });
  }

  async clearTooltip() {
    await this.page.mouse.move(0, 0);
    await this.page.mouse.move(0, 500);

    await expect(this.tooltipVisible).toBeHidden({ timeout: 2000 });
  }

  async hoverAndGetTooltipText(target) {
    await this.clearTooltip();

    await target.scrollIntoViewIfNeeded();
    await target.hover({ force: true });

    await this.tooltipVisible.waitFor({ state: 'visible', timeout: 3000 });

    await expect(this.tooltipInner).toBeVisible();

    return (await this.tooltipInner.textContent()).trim();
  }

  async showTooltip(target) {
    await this.clearTooltip();
    await target.scrollIntoViewIfNeeded();
    await target.hover({ force: true });
    await expect(this.tooltipVisible).toHaveCount(1, { timeout: 5000 });
  }

  getButtonTooltipText() {
    return this.hoverAndGetTooltipText(this.toolTipButton);
  }

  getTextFieldTooltipText() {
    return this.hoverAndGetTooltipText(this.toolTipTextField);
  }

  getContraryLinkTooltipText() {
    return this.hoverAndGetTooltipText(this.contraryLink);
  }

  getSectionLinkTooltipText() {
    return this.hoverAndGetTooltipText(this.sectionLink);
  }
}
