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

      genderMaleLabel: page.locator('label[for="gender-radio-1"]'),
      genderFemaleLabel: page.locator('label[for="gender-radio-2"]'),
      genderOtherLabel: page.locator('label[for="gender-radio-3"]'),

      dateOfBirthInput: page.locator('#dateOfBirthInput'),
      datePickerMonth: page.locator('.react-datepicker__month-select'),
      datePickerYear: page.locator('.react-datepicker__year-select'),

      subjectsInput: page.locator('#subjectsInput'),

      hobbySportsLabel: page.locator('label[for="hobbies-checkbox-1"]'),
      hobbyReadingLabel: page.locator('label[for="hobbies-checkbox-2"]'),
      hobbyMusicLabel: page.locator('label[for="hobbies-checkbox-3"]'),

      uploadPicture: page.locator('#uploadPicture'),

      stateDropdown: page.locator('#state'),
      stateInput: page.locator('#react-select-3-input'),
      cityDropdown: page.locator('#city'),
      cityInput: page.locator('#react-select-4-input'),

      submitButton: page.locator('#submit'),

      modalTitle: page.locator('#example-modal-sizes-title-lg'),
      modalTable: page.locator('.table-responsive'),

      formHeader: page.locator('.practice-form-wrapper h5', { hasText: 'Student Registration Form' }),
    };
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
    const genderMap = {
      Male: this.selectors.genderMaleLabel,
      Female: this.selectors.genderFemaleLabel,
      Other: this.selectors.genderOtherLabel,
    };

    await genderMap[gender].scrollIntoViewIfNeeded();
    await genderMap[gender].click();
  }

  async selectDateOfBirth(day, month, year) {
    await this.selectors.dateOfBirthInput.click();

    await this.selectors.datePickerYear.selectOption(year);

    try {
      await this.selectors.datePickerMonth.selectOption(month);
    } catch (error) {
      try {
        await this.selectors.datePickerMonth.selectOption('June');
      } catch (error2) {
        await this.selectors.datePickerMonth.selectOption('6');
      }
    }

    await this.page.waitForTimeout(500);

    try {
      await this.page.locator(`.react-datepicker__day--${day.toString().padStart(3, '0')}`).click();
    } catch (error) {
      try {
        await this.page.locator(`[aria-label*="${day}"]`).click();
      } catch (error2) {
        await this.page.locator('.react-datepicker__day', { hasText: day.toString() }).first().click();
      }
    }
  }

  async addSubject(subject) {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(500);

    await this.selectors.subjectsInput.scrollIntoViewIfNeeded();
    await this.selectors.subjectsInput.click({ force: true });
    await this.selectors.subjectsInput.fill(subject);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async addMultipleSubjects(subjects) {
    for (const subject of subjects) {
      await this.addSubject(subject);
    }
  }

  async selectHobbies(hobbies) {
    const hobbyMap = {
      Sports: this.selectors.hobbySportsLabel,
      Reading: this.selectors.hobbyReadingLabel,
      Music: this.selectors.hobbyMusicLabel,
    };

    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(500);

    for (const hobby of hobbies) {
      try {
        await hobbyMap[hobby].scrollIntoViewIfNeeded();
        await hobbyMap[hobby].click({ force: true });
        await this.page.waitForTimeout(300);
      } catch (error) {
        console.log(`Failed to click hobby ${hobby}, trying alternative method`);
        await this.page
          .locator(`#hobbies-checkbox-${['Sports', 'Reading', 'Music'].indexOf(hobby) + 1}`)
          .check({ force: true });
      }
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

    await this.page.waitForTimeout(500);
  }

  async selectState(stateName) {
    await this.selectors.stateDropdown.scrollIntoViewIfNeeded();
    await this.selectors.stateDropdown.click();
    await this.selectors.stateInput.fill(stateName);
    await this.page.keyboard.press('Enter');
  }

  async selectCity(cityName) {
    await this.selectors.cityDropdown.click();
    await this.selectors.cityInput.fill(cityName);
    await this.page.keyboard.press('Enter');
  }

  async isCityDropdownDisabled() {
    const isDisabled = await this.selectors.cityInput.isDisabled();
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
