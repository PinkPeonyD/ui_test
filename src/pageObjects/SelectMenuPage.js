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
    this.multiValueChipByText = value =>
      page.locator(`#selectMenuContainer div[class*="multiValue"]:has-text("${value}")`);

    this.selectValueSingleValue = this.selectValueControl.locator("[class*='singleValue']");
    this.selectOneSingleValue = this.selectOneControl.locator("[class*='singleValue']");
    this.selectedOldStyleOption = this.oldStyleSelect.locator('option:checked');
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

      const chip = this.multiValueChipByText(value);
      await chip.waitFor({ state: 'attached', timeout: 4000 });
    }
  }

  async getDisplayedSelectValue() {
    await this.selectValueSingleValue.waitFor({ state: 'visible' });
    return (await this.selectValueSingleValue.textContent()).trim();
  }

  async getDisplayedSelectOne() {
    await this.selectOneSingleValue.waitFor({ state: 'visible' });
    return (await this.selectOneSingleValue.textContent()).trim();
  }

  async getDisplayedOldStyle() {
    return (await this.selectedOldStyleOption.textContent()).trim();
  }

  async getDisplayedMultiValues() {
    const count = await this.multiValueChips.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      const chip = this.multiValueChips.nth(i);
      await chip.waitFor({ state: 'visible', timeout: 4000 });
      const labelText = await chip.textContent();
      texts.push(labelText.replace(/×/g, '').trim());
    }
    return texts;
  }
}
