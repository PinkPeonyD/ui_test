export default class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async clickOnButton(name) {
    await this.page.getByRole('button', { name }).click();
  }

  async clickOnElementByLocator(locator) {
    await locator.waitFor({ state: 'visible' });
    const isEnabled = await locator.isEnabled();
    if (!isEnabled) {
      throw new Error('Element is not enabled for clicking');
    }
    await locator.click();
  }

  async hoverOnElement(element) {
    await element.hover();
  }

  async getElementText(locator) {
    return await locator.textContent();
  }

  async waitForElementVisible(locator) {
    await locator.waitFor({ state: 'visible' });
  }

  async isElementVisible(locator) {
    return await locator.isVisible();
  }
}
