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
  }

  async open() {
    await this.navigateTo(this.url);
  }

  async clearTooltip() {
    await this.page.mouse.move(0, 0);
    await this.page.mouse.move(0, 500);
    await this.page.waitForTimeout(300);

    await expect(this.tooltipVisible).toBeHidden({ timeout: 2000 });
  }

  async hoverAndGetTooltipText(target) {
    await this.clearTooltip();

    await target.scrollIntoViewIfNeeded();
    await target.hover({ force: true });

    const tooltip = this.tooltipVisible;
    await tooltip.waitFor({ state: 'visible', timeout: 3000 });

    const inner = tooltip.locator('.tooltip-inner');
    await expect(inner).toBeVisible();

    return (await inner.textContent()).trim();
  }

  async showTooltip(target) {
    await this.clearTooltip();
    await target.scrollIntoViewIfNeeded();
    for (let attempt = 0; attempt < 3; attempt++) {
      await target.hover({ force: true });
      const appeared = await this.tooltipVisible
        .first()
        .waitFor({ state: 'visible', timeout: 2500 })
        .then(() => true)
        .catch(() => false);

      if (appeared) return;
      await this.page.waitForTimeout(300);
    }

    await expect(this.tooltipVisible).toBeVisible({ timeout: 3000 });
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
