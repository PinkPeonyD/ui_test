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
      dialogs: page.locator('dialog[open]'),

      alertsHeader: page.locator('h1', { hasText: 'Alerts' }),
    };
  }

  async verifyAlertsHeader() {
    await this.selectors.alertsHeader.waitFor({ state: 'visible' });
    return await this.selectors.alertsHeader.isVisible();
  }

  async clickSimpleAlert(options = {}) {
    await this.selectors.alertButton.scrollIntoViewIfNeeded();
    await this.selectors.alertButton.waitFor({ state: 'visible' });
    await this.selectors.alertButton.click(options);
  }

  async clickTimerAlert(options = {}) {
    await this.selectors.timerAlertButton.scrollIntoViewIfNeeded();
    await this.selectors.timerAlertButton.waitFor({ state: 'visible' });
    await this.selectors.timerAlertButton.click(options);
  }

  async clickConfirmAlert(options = {}) {
    await this.selectors.confirmButton.scrollIntoViewIfNeeded();
    await this.selectors.confirmButton.waitFor({ state: 'visible' });
    await this.selectors.confirmButton.click(options);
  }

  async clickPromptAlert(options = {}) {
    await this.selectors.promptButton.scrollIntoViewIfNeeded();
    await this.selectors.promptButton.waitFor({ state: 'visible' });
    await this.selectors.promptButton.click(options);
  }

  async getConfirmResult() {
    await this.selectors.confirmResult.waitFor({ state: 'visible' });
    return await this.selectors.confirmResult.textContent();
  }

  async getPromptResult() {
    try {
      await this.selectors.promptResult.waitFor({ state: 'visible', timeout: 15000 });
      return await this.selectors.promptResult.textContent();
    } catch {
      const elementExists = await this.selectors.promptResult.count();
      if (elementExists > 0) {
        return await this.selectors.promptResult.textContent();
      }
      throw new Error('Prompt result element not found');
    }
  }

  async waitForPromptResult(timeout = 15000) {
    try {
      await this.selectors.promptResult.waitFor({
        state: 'visible',
        timeout,
      });
      return await this.selectors.promptResult.textContent();
    } catch {
      throw new Error(`Prompt result element not found within ${timeout}ms`);
    }
  }

  async verifyNoActiveDialogs() {
    const dialogCount = await this.selectors.dialogs.count();
    return dialogCount === 0;
  }

  async clickAlertButtonByType(buttonSelector) {
    const button = this.selectors[buttonSelector];
    await button.waitFor({ state: 'visible' });
    await button.click();
  }
}
