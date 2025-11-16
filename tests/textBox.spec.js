import { test, expect } from '@playwright/test';
import { TextBoxPage } from '../src/pageObjects';
import { TestDataGenerator } from '../src/utils';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url.includes('googlesyndication') || url.includes('doubleclick') || url.includes('ads')) {
      route.abort();
    } else {
      route.continue();
    }
  });
});

test.describe('Text Box Page Tests', () => {
  test('Fill text box with random data and verify results', async ({ page }) => {
    const textBoxPage = new TextBoxPage(page);
    const testData = TestDataGenerator.generateTextBoxData();

    await test.step('Open Text Box page', async () => {
      await textBoxPage.open();
    });

    await test.step('Fill all fields with random data', async () => {
      await textBoxPage.fillFullName(testData.fullName);
      await textBoxPage.fillEmail(testData.email);
      await textBoxPage.fillCurrentAddress(testData.currentAddress);
      await textBoxPage.fillPermanentAddress(testData.permanentAddress);
    });

    await test.step('Submit the form', async () => {
      await textBoxPage.submitForm();
    });

    await test.step('Verify output is visible', async () => {
      const isVisible = await textBoxPage.isOutputVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('Verify output data matches input data', async () => {
      const outputData = await textBoxPage.getOutputData();

      expect(outputData.fullName).toBe(testData.fullName);
      expect(outputData.email).toBe(testData.email);
      expect(outputData.currentAddress).toBe(testData.currentAddress);
      expect(outputData.permanentAddress).toBe(testData.permanentAddress);
    });
  });

  test('Fill text box using fillAllFields method', async ({ page }) => {
    const textBoxPage = new TextBoxPage(page);
    const testData = TestDataGenerator.generateTextBoxData();

    await test.step('Open Text Box page', async () => {
      await textBoxPage.open();
    });

    await test.step('Fill all fields at once', async () => {
      await textBoxPage.fillAllFields(testData);
    });

    await test.step('Submit the form', async () => {
      await textBoxPage.submitForm();
    });

    await test.step('Verify all output fields match input', async () => {
      const outputData = await textBoxPage.getOutputData();

      expect(outputData.fullName).toBe(testData.fullName);
      expect(outputData.email).toBe(testData.email);
      expect(outputData.currentAddress).toBe(testData.currentAddress);
      expect(outputData.permanentAddress).toBe(testData.permanentAddress);
    });
  });

  test('Verify individual field outputs', async ({ page }) => {
    const textBoxPage = new TextBoxPage(page);
    const testData = TestDataGenerator.generateTextBoxData();

    await test.step('Open and fill the form', async () => {
      await textBoxPage.open();
      await textBoxPage.fillAllFields(testData);
      await textBoxPage.submitForm();
    });

    await test.step('Verify full name output', async () => {
      const outputName = await textBoxPage.getOutputFullName();
      expect(outputName).toBe(testData.fullName);
    });

    await test.step('Verify email output', async () => {
      const outputEmail = await textBoxPage.getOutputEmail();
      expect(outputEmail).toBe(testData.email);
    });

    await test.step('Verify current address output', async () => {
      const outputCurrentAddress = await textBoxPage.getOutputCurrentAddress();
      expect(outputCurrentAddress).toBe(testData.currentAddress);
    });

    await test.step('Verify permanent address output', async () => {
      const outputPermanentAddress = await textBoxPage.getOutputPermanentAddress();
      expect(outputPermanentAddress).toBe(testData.permanentAddress);
    });
  });

  test('Negative: Submit empty form', async ({ page }) => {
    const textBoxPage = new TextBoxPage(page);

    await test.step('Open Text Box page', async () => {
      await textBoxPage.open();
    });

    await test.step('Submit empty form', async () => {
      await textBoxPage.submitForm();
    });

    await test.step('Verify output is not visible', async () => {
      const isVisible = await textBoxPage.isOutputVisible();
      expect(isVisible).toBe(false);
    });
  });

  test('Negative: Invalid email format', async ({ page }) => {
    const textBoxPage = new TextBoxPage(page);
    const testData = TestDataGenerator.generateTextBoxData();
    const invalidEmail = 'invalid-email';

    await test.step('Open Text Box page', async () => {
      await textBoxPage.open();
    });

    await test.step('Fill form with invalid email', async () => {
      await textBoxPage.fillFullName(testData.fullName);
      await textBoxPage.fillEmail(invalidEmail);
      await textBoxPage.fillCurrentAddress(testData.currentAddress);
      await textBoxPage.fillPermanentAddress(testData.permanentAddress);
    });

    await test.step('Submit and verify output does not appear', async () => {
      await textBoxPage.submitForm();

      await expect(textBoxPage.outputSection).toBeHidden();

      if (await textBoxPage.isOutputVisible()) {
        const email = await textBoxPage.getOutputEmail();
        expect(email).not.toBe(invalidEmail);
      }
    });
  });

  test('Negative: Submit with only email', async ({ page }) => {
    const textBoxPage = new TextBoxPage(page);
    const testData = TestDataGenerator.generateTextBoxData();

    await test.step('Open Text Box page', async () => {
      await textBoxPage.open();
    });

    await test.step('Fill only email field', async () => {
      await textBoxPage.fillEmail(testData.email);
    });

    await test.step('Submit form', async () => {
      await textBoxPage.submitForm();
    });

    await test.step('Verify only email is displayed in output', async () => {
      const isVisible = await textBoxPage.isOutputVisible();
      expect(isVisible).toBe(true);

      const outputEmail = await textBoxPage.getOutputEmail();
      expect(outputEmail).toBe(testData.email);
    });
  });
});
