import BasePage from './BasePage.js';

export default class TextBoxPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = 'https://demoqa.com/text-box';

    this.fullNameInput = page.locator('#userName');
    this.emailInput = page.locator('#userEmail');
    this.currentAddressTextarea = page.locator('#currentAddress');
    this.permanentAddressTextarea = page.locator('#permanentAddress');

    this.submitButton = page.locator('#submit');

    this.outputName = page.locator('#output #name');
    this.outputEmail = page.locator('#output #email');
    this.outputCurrentAddress = page.locator('#output #currentAddress');
    this.outputPermanentAddress = page.locator('#output #permanentAddress');
    this.outputBox = page.locator('#output');
    this.outputSection = this.outputBox;
  }

  async open() {
    await this.navigateTo(this.url);
  }

  async fillFullName(fullName) {
    await this.fullNameInput.fill(fullName);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillCurrentAddress(address) {
    await this.currentAddressTextarea.fill(address);
  }

  async fillPermanentAddress(address) {
    await this.permanentAddressTextarea.fill(address);
  }

  async submitForm() {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  async fillAllFields(data) {
    await this.fillFullName(data.fullName);
    await this.fillEmail(data.email);
    await this.fillCurrentAddress(data.currentAddress);
    await this.fillPermanentAddress(data.permanentAddress);
  }

  async isOutputVisible() {
    try {
      await this.outputBox.waitFor({ state: 'visible', timeout: 2000 });
      return await this.outputBox.isVisible();
    } catch {
      return false;
    }
  }

  async waitForOutputNotVisible() {
    try {
      await this.outputBox.waitFor({ state: 'hidden', timeout: 2000 });
      return true;
    } catch {
      const isVisible = await this.outputBox.isVisible();
      return !isVisible;
    }
  }

  async getOutputFullName() {
    const text = await this.outputName.textContent();
    return text.replace('Name:', '').trim();
  }

  async getOutputEmail() {
    const text = await this.outputEmail.textContent();
    return text.replace('Email:', '').trim();
  }

  async getOutputCurrentAddress() {
    const text = await this.outputCurrentAddress.textContent();
    return text.replace('Current Address :', '').trim();
  }

  async getOutputPermanentAddress() {
    const text = await this.outputPermanentAddress.textContent();
    return text.replace('Permananet Address :', '').trim();
  }

  async getOutputData() {
    return {
      fullName: await this.getOutputFullName(),
      email: await this.getOutputEmail(),
      currentAddress: await this.getOutputCurrentAddress(),
      permanentAddress: await this.getOutputPermanentAddress(),
    };
  }
}
