import { BasePage } from './index.js';

export default class AlertsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.selectors = {
      alertButton: page.locator('#alertButton'),
      confirmButton: page.locator('#confirmButton'),
      promptButton: page.locator('#promtButton'),
    };
  }

  async clickAlertButtonByType(buttonSelector) {
    const button = this.selectors[buttonSelector];
    await button.waitFor({ state: 'visible' });
    await button.click();
  }
}
