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

  async hideTooltip() {
    await this.page.mouse.move(0, 0);
  }

  getOptionByText(text) {
    return this.page.locator(`//div[contains(@class,"option") and normalize-space()="${text}"]`);
  }

  getLabelByText(text) {
    return this.page.locator(`//label[contains(normalize-space(), "${text}")]`);
  }

  getInputById(id) {
    return this.page.locator(`//input[@id="${id}"]`);
  }
}
