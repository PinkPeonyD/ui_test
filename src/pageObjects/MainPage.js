import BasePage from './BasePage.js';

export default class MainPage extends BasePage {
  constructor(page) {
    super(page);
    this.headerLocator = page.locator('header');
    this.categoryCardLocator = cardName =>
      page.locator(`//div[contains(@class, "card")]//*[contains(text(), "${cardName}")]`);
    this.listElement = element => page.locator(`//span[contains(text(), "${element}")]`);
    this.expandedGroupLocator = group =>
      page.locator(`//div[contains(text(), "${group}")]/following::div[contains(@class, "element-list")][1]`);
  }

  async checkCategoryCard(cardName) {
    const card = this.categoryCardLocator(cardName);
    await this.waitForElementVisible(card);
    await this.isElementVisible(card);
  }

  async clickCategoryCard(category) {
    const card = this.categoryCardLocator(category);
    await card.waitFor({ state: 'visible' });
    await card.click();
  }

  async clickOnElementCardList(element) {
    const elementInList = this.listElement(element);
    await elementInList.waitFor({ state: 'visible' });
    await elementInList.click();
  }
}
