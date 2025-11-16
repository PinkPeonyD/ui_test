import BasePage from './BasePage.js';

export default class SelectMenuPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = 'https://demoqa.com/select-menu';

    this.selectValueControl = page.locator('#withOptGroup');
    this.selectOneControl = page.locator('#selectOne');

    this.oldStyleSelect = page.locator('#oldSelectMenu');

    this.multiContainer = page.locator('#selectMenuContainer div[class*="control"]').last();
    this.multiInput = this.multiContainer.locator('input[id*="react-select"][id$="-input"]');

    this.multiValueChips = page.locator('#selectMenuContainer div[class*="multiValue"]');
  }

  async open() {
    await this.navigateTo(this.url);
  }

  async chooseSelectValue(text) {
    await this.selectValueControl.click();
    await this.getOptionByText(text).click();
  }

  async chooseSelectOne(text) {
    await this.selectOneControl.click();
    await this.getOptionByText(text).click();
  }

  async chooseOldStyle(value) {
    await this.oldStyleSelect.selectOption({ label: value });
  }

  async chooseMulti(values) {
    for (const value of values) {
      await this.multiContainer.click();

      await this.multiInput.fill(value);

      const option = this.getOptionByText(value);
      await option.waitFor({ state: 'visible', timeout: 5000 });
      await option.click();

      const chip = this.page.locator(`#selectMenuContainer div[class*="multiValue"]:has-text("${value}")`);
      await chip.waitFor({ state: 'attached', timeout: 2000 });
    }
  }

  async getDisplayedSelectValue() {
    const valueEl = this.selectValueControl.locator("[class*='singleValue']");
    await valueEl.waitFor({ state: 'visible' });
    return (await valueEl.textContent()).trim();
  }

  async getDisplayedSelectOne() {
    const valueEl = this.selectOneControl.locator("[class*='singleValue']");
    await valueEl.waitFor({ state: 'visible' });
    return (await valueEl.textContent()).trim();
  }

  async getDisplayedOldStyle() {
    const selectedOption = this.oldStyleSelect.locator('option:checked');
    return (await selectedOption.textContent()).trim();
  }

  async getDisplayedMultiValues() {
    const count = await this.multiValueChips.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      const chipText = await this.multiValueChips.nth(i).locator('> div').first().textContent();
      texts.push(chipText.trim());
    }
    return texts;
  }
}
