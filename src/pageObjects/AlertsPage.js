import { BasePage } from './index.js';

export default class AlertsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.selectors = {
      alertButton: page.locator('#alertButton'),
      timerAlertButton: page.locator('#timerAlertButton'),
      confirmButton: page.locator('#confirmButton'),
      promptButton: page.locator('#promtButton'),

      confirmResult: page.locator('#confirmResult'),
      promptResult: page.locator('#promptResult'),

      alertsHeader: page.locator('h1', { hasText: 'Alerts' }),
    };
  }

  async verifyAlertsHeader() {
    await this.selectors.alertsHeader.waitFor({ state: 'visible' });
    return await this.selectors.alertsHeader.isVisible();
  }

  async clickSimpleAlert() {
    await this.selectors.alertButton.scrollIntoViewIfNeeded();
    await this.selectors.alertButton.waitFor({ state: 'visible' });
    await this.selectors.alertButton.click();
  }

  async clickTimerAlert() {
    await this.selectors.timerAlertButton.scrollIntoViewIfNeeded();
    await this.selectors.timerAlertButton.waitFor({ state: 'visible' });
    await this.selectors.timerAlertButton.click();
  }

  async clickConfirmAlert() {
    await this.selectors.confirmButton.scrollIntoViewIfNeeded();
    await this.selectors.confirmButton.waitFor({ state: 'visible' });
    await this.selectors.confirmButton.click();
  }

  async clickPromptAlert() {
    await this.selectors.promptButton.scrollIntoViewIfNeeded();
    await this.selectors.promptButton.waitFor({ state: 'visible' });
    await this.selectors.promptButton.click();
  }

  async getConfirmResult() {
    await this.selectors.confirmResult.waitFor({ state: 'visible' });
    return await this.selectors.confirmResult.textContent();
  }

  async getPromptResult() {
    try {
      await this.selectors.promptResult.waitFor({ state: 'visible', timeout: 15000 });
      return await this.selectors.promptResult.textContent();
    } catch (error) {
      const elementExists = await this.selectors.promptResult.count();
      if (elementExists > 0) {
        return await this.selectors.promptResult.textContent();
      }
      throw error;
    }
  }

  async waitForPromptResult(timeout = 15000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const elementCount = await this.selectors.promptResult.count();
        if (elementCount > 0) {
          const isVisible = await this.selectors.promptResult.isVisible();
          if (isVisible) {
            return await this.selectors.promptResult.textContent();
          }
        }
        await this.page.waitForTimeout(100);
      } catch (error) {
        await this.page.waitForTimeout(100);
      }
    }
    throw new Error(`Prompt result element not found within ${timeout}ms`);
  }

  async verifyNoActiveDialogs() {
    const dialogs = await this.page.$$('dialog[open]');
    return dialogs.length === 0;
  }

  async clickAlertButtonByType(buttonSelector) {
    const button = this.selectors[buttonSelector];
    await button.waitFor({ state: 'visible' });
    await button.click();
  }
}
