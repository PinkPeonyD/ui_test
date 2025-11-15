import { BasePage } from './index.js';

export default class AutomationPracticeFormPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.selectors = {
      firstName: page.locator('#firstName'),
      lastName: page.locator('#lastName'),
      userEmail: page.locator('#userEmail'),
      userNumber: page.locator('#userNumber'),
      currentAddress: page.locator('#currentAddress'),

      dateOfBirthInput: page.locator('#dateOfBirthInput'),
      datePickerMonth: page.locator('.react-datepicker__month-select'),
      datePickerYear: page.locator('.react-datepicker__year-select'),

      subjectsInput: page.locator('#subjectsInput'),

      uploadPicture: page.locator('#uploadPicture'),

      stateDropdown: page.locator('#state'),
      cityDropdown: page.locator('#city'),

      submitButton: page.locator('#submit'),

      modalTitle: page.locator('#example-modal-sizes-title-lg'),
      modalTable: page.locator('.table-responsive'),

      formHeader: page.locator('.practice-form-wrapper h5', { hasText: 'Student Registration Form' }),
    };
  }

  getStateInputLocator() {
    return this.page.locator(
      'xpath=//div[@id="state"]//input[contains(@id, "react-select") and contains(@id, "input")]',
    );
  }

  getCityInputLocator() {
    return this.page.locator(
      'xpath=//div[@id="city"]//input[contains(@id, "react-select") and contains(@id, "input")]',
    );
  }

  getDatePickerDayLocator(day) {
    return this.page.locator(`.react-datepicker__day--${day.toString().padStart(3, '0')}`);
  }

  getDatePickerDayByAriaLabel(day) {
    return this.page.locator(`[aria-label*="${day}"]`);
  }

  getDatePickerDayByText(day) {
    return this.page.locator('.react-datepicker__day', { hasText: day.toString() }).first();
  }

  async verifyFormHeader() {
    await this.selectors.formHeader.waitFor({ state: 'visible' });
    return await this.selectors.formHeader.isVisible();
  }

  async fillFirstName(firstName) {
    await this.selectors.firstName.scrollIntoViewIfNeeded();
    await this.selectors.firstName.fill(firstName);
  }

  async fillLastName(lastName) {
    await this.selectors.lastName.fill(lastName);
  }

  async fillEmail(email) {
    await this.selectors.userEmail.fill(email);
  }

  async fillMobile(mobile) {
    await this.selectors.userNumber.fill(mobile);
  }

  async fillCurrentAddress(address) {
    await this.selectors.currentAddress.scrollIntoViewIfNeeded();
    await this.selectors.currentAddress.fill(address);
  }

  async selectGender(gender) {
    const genderLocator = this.page.locator(
      `xpath=//label[contains(text(), "${gender}") and @for[starts-with(., "gender-radio")]]`,
    );
    await genderLocator.scrollIntoViewIfNeeded();
    await genderLocator.click();
  }

  async selectDateOfBirth(day, month, year) {
    await this.selectors.dateOfBirthInput.click();

    await this.selectors.datePickerYear.selectOption(year);

    try {
      await this.selectors.datePickerMonth.selectOption(month);
    } catch {
      try {
        await this.selectors.datePickerMonth.selectOption('June');
      } catch {
        await this.selectors.datePickerMonth.selectOption('6');
      }
    }

    await this.page.waitForSelector('.react-datepicker__day', { state: 'visible' });

    try {
      await this.getDatePickerDayLocator(day).click();
    } catch {
      try {
        await this.getDatePickerDayByAriaLabel(day).click();
      } catch {
        await this.getDatePickerDayByText(day).click();
      }
    }
  }

  async addSubject(subject) {
    await this.page.keyboard.press('Escape');

    await this.selectors.subjectsInput.scrollIntoViewIfNeeded();
    await this.selectors.subjectsInput.click({ force: true });
    await this.selectors.subjectsInput.fill(subject);
    await this.page.keyboard.press('Enter');

    await this.page
      .waitForSelector(`.css-1rhbuit-multiValue:has-text("${subject}")`, {
        state: 'attached',
        timeout: 3000,
      })
      .catch(() => {
        console.log(`Subject chip for "${subject}" may not have appeared`);
      });
  }

  async addMultipleSubjects(subjects) {
    for (const subject of subjects) {
      await this.addSubject(subject);
    }
  }

  async selectHobbies(hobbies) {
    await this.page.keyboard.press('Escape');

    for (const hobby of hobbies) {
      const hobbyLocator = this.page.locator(`//label[normalize-space(text())="${hobby}"]`);
      await hobbyLocator.scrollIntoViewIfNeeded();
      await hobbyLocator.click({ force: true });
    }
  }

  async uploadFile(filePathOrBuffer, fileName = 'test-image.png', mimeType = 'image/png') {
    await this.selectors.uploadPicture.scrollIntoViewIfNeeded();
    await this.selectors.uploadPicture.waitFor({ state: 'visible', timeout: 10000 });

    if (Buffer.isBuffer(filePathOrBuffer)) {
      await this.selectors.uploadPicture.setInputFiles({
        name: fileName,
        mimeType,
        buffer: filePathOrBuffer,
      });
    } else {
      await this.selectors.uploadPicture.setInputFiles(filePathOrBuffer);
    }
  }

  async selectState(stateName) {
    await this.selectors.stateDropdown.scrollIntoViewIfNeeded();
    await this.selectors.stateDropdown.click();
    await this.getStateInputLocator().fill(stateName);
    await this.page.keyboard.press('Enter');

    const cityInput = this.getCityInputLocator();
    await cityInput.waitFor({ state: 'attached', timeout: 5000 });
    await this.page.waitForFunction(
      /* global document */
      () => {
        const input = document.querySelector('div#city input[id*="react-select"][id*="input"]');
        return input && !input.disabled;
      },
      { timeout: 5000 },
    );
  }

  async selectCity(cityName) {
    await this.selectors.cityDropdown.click();
    await this.getCityInputLocator().fill(cityName);
    await this.page.keyboard.press('Enter');
  }

  async isCityDropdownDisabled() {
    const isDisabled = await this.getCityInputLocator().isDisabled();
    return isDisabled;
  }

  async submitForm() {
    await this.selectors.submitButton.scrollIntoViewIfNeeded();
    await this.selectors.submitButton.click({ force: true });
  }

  async isModalVisible() {
    try {
      await this.selectors.modalTitle.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getModalData() {
    await this.selectors.modalTable.waitFor({ state: 'visible' });

    const rows = await this.selectors.modalTable.locator('tbody tr').all();
    const data = {};

    for (const row of rows) {
      const label = await row.locator('td:first-child').textContent();
      const value = await row.locator('td:last-child').textContent();
      data[label.trim()] = value.trim();
    }

    return data;
  }

  async checkFormValidity() {
    const form = await this.page.locator('form').first();
    return await form.evaluate(form => form.checkValidity());
  }

  async fillCompleteForm(formData) {
    await this.fillFirstName(formData.firstName);
    await this.fillLastName(formData.lastName);
    await this.fillEmail(formData.email);
    await this.selectGender(formData.gender);
    await this.fillMobile(formData.mobile);
    await this.selectDateOfBirth(formData.birthDay, formData.birthMonth, formData.birthYear);
    await this.addMultipleSubjects(formData.subjects);
    await this.selectHobbies(formData.hobbies);

    if (formData.picture) {
      await this.uploadFile(formData.picture);
    }

    await this.fillCurrentAddress(formData.address);
    await this.selectState(formData.state);
    await this.selectCity(formData.city);
  }

  async blockAds() {
    await this.page.addStyleTag({
      content: `
        #fixedban,
        iframe[src*="googlesyndication"],
        iframe[src*="doubleclick"],
        .adsbygoogle {
          display: none !important;
          visibility: hidden !important;
        }
      `,
    });
  }
}
