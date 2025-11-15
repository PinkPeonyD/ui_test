import { test, expect } from '@playwright/test';
import { AutomationPracticeFormPage, MainPage } from '../src/pageObjects';
import { StateCityData, TestDataGenerator } from '../src/utils';
import path from 'path';
import fs from 'fs';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url.includes('googlesyndication') || url.includes('doubleclick') || url.includes('ads')) {
      route.abort();
    } else {
      route.continue();
    }
  });

  await page.goto('https://demoqa.com', { waitUntil: 'domcontentloaded' });
});

test.describe('Automation Practice Form - Essential Coverage', () => {
  let testImagePath;

  test.beforeAll(async () => {
    const dir = path.join(process.cwd(), 'test-files');
    await fs.promises.mkdir(dir, { recursive: true });

    const pngHex =
      '89504E470D0A1A0A0000000D4948445200000001000000010802000000907753DE0000000A49444154789C6360000002000154A24F5D0000000049454E44AE426082';
    const buffer = Buffer.from(pngHex, 'hex');

    testImagePath = path.join(dir, 'test-image.png');
    await fs.promises.writeFile(testImagePath, buffer);
  });

  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    const formPage = new AutomationPracticeFormPage(page);

    await test.step('Navigate to Practice Form page', async () => {
      await mainPage.clickCategoryCard('Forms');
      await mainPage.clickOnElementCardList('Practice Form');
    });

    await test.step('Block ads and verify form', async () => {
      await formPage.blockAds();
      const isHeaderVisible = await formPage.verifyFormHeader();
      expect(isHeaderVisible).toBe(true);
    });
  });

  test('Positive: Fill required fields only', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const testData = TestDataGenerator.generateMinimalFormData();

    await test.step('Fill minimum required fields', async () => {
      await formPage.fillFirstName(testData.firstName);
      await formPage.fillLastName(testData.lastName);
      await formPage.selectGender(testData.gender);
      await formPage.fillMobile(testData.mobile);
    });

    await test.step('Submit form', async () => {
      await formPage.submitForm();
    });

    await test.step('Verify modal appears', async () => {
      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);
    });

    await test.step('Verify basic data in modal', async () => {
      const modalData = await formPage.getModalData();

      expect(modalData['Student Name']).toBe(`${testData.firstName} ${testData.lastName}`);
      expect(modalData['Gender']).toBe(testData.gender);
      expect(modalData['Mobile']).toBe(testData.mobile);
    });
  });

  test('Positive: Fill all fields step by step', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const testData = TestDataGenerator.generateCompleteFormData();
    const stateCityData = StateCityData.getRandomStateCityWithAddress();

    await test.step('Fill basic info', async () => {
      await formPage.fillFirstName(testData.firstName);
      await formPage.fillLastName(testData.lastName);
      await formPage.fillEmail(testData.email);
      await formPage.selectGender(testData.gender);
      await formPage.fillMobile(testData.mobile);
    });

    await test.step('Select date of birth', async () => {
      await formPage.selectDateOfBirth(testData.birthDay, testData.birthMonth, testData.birthYear);
    });

    await test.step('Fill address', async () => {
      await formPage.fillCurrentAddress(stateCityData.address);
    });

    await test.step('Select state and city', async () => {
      await formPage.selectState(stateCityData.state);
      await formPage.selectCity(stateCityData.city);
    });

    await test.step('Submit and verify basic fields', async () => {
      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      expect(modalData['Student Name']).toBe(`${testData.firstName} ${testData.lastName}`);
      expect(modalData['Student Email']).toBe(testData.email);
      expect(modalData['Gender']).toBe(testData.gender);
      expect(modalData['Mobile']).toBe(testData.mobile);
      expect(modalData['Date of Birth']).toBeTruthy();
      expect(modalData['Address']).toBe(stateCityData.address);
      expect(modalData['State and City']).toBe(
        StateCityData.formatStateCityResult(stateCityData.state, stateCityData.city),
      );
    });
  });

  test('Complete form with all basic fields', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const testData = TestDataGenerator.generateCompleteFormData();
    const stateCityData = StateCityData.getRandomStateCityWithAddress();

    await test.step('Fill complete form with all basic fields', async () => {
      await formPage.fillFirstName(testData.firstName);
      await formPage.fillLastName(testData.lastName);
      await formPage.fillEmail(testData.email);
      await formPage.selectGender(testData.gender);
      await formPage.fillMobile(testData.mobile);
      await formPage.selectDateOfBirth(testData.birthDay, testData.birthMonth, testData.birthYear);
      await formPage.fillCurrentAddress(stateCityData.address);
      await formPage.selectState(stateCityData.state);
      await formPage.selectCity(stateCityData.city);
      await formPage.uploadFile(testImagePath);

      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      expect(modalData['Student Name']).toBe(`${testData.firstName} ${testData.lastName}`);
      expect(modalData['Student Email']).toBe(testData.email);
      expect(modalData['Gender']).toBe(testData.gender);
      expect(modalData['Mobile']).toBe(testData.mobile);
      expect(modalData['Date of Birth']).toBeTruthy();
      expect(modalData['Address']).toBe(stateCityData.address);
      expect(modalData['State and City']).toBe(
        StateCityData.formatStateCityResult(stateCityData.state, stateCityData.city),
      );
      expect(modalData['Picture']).toBe('test-image.png');
    });
  });

  test('Hobbies functionality', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const testData = TestDataGenerator.generateMinimalFormData();

    await test.step('Fill required fields and select hobby', async () => {
      await formPage.fillFirstName(testData.firstName);
      await formPage.fillLastName(testData.lastName);
      await formPage.selectGender(testData.gender);
      await formPage.fillMobile(testData.mobile);

      await formPage.selectHobbies(['Sports']);

      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      expect(modalData['Hobbies']).toContain('Sports');
    });
  });

  test('Negative: Empty form submission', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);

    await test.step('Submit empty form', async () => {
      await formPage.submitForm();
    });

    await test.step('Verify modal does not appear', async () => {
      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(false);
    });
  });

  test('Negative: Missing required gender', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const testData = TestDataGenerator.generateMinimalFormData();

    await test.step('Fill form without gender', async () => {
      await formPage.fillFirstName(testData.firstName);
      await formPage.fillLastName(testData.lastName);
      await formPage.fillMobile(testData.mobile);
    });

    await test.step('Submit and verify failure', async () => {
      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(false);
    });
  });

  test('Negative: Invalid mobile number', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const testData = TestDataGenerator.generateMinimalFormData();

    await test.step('Fill form with short mobile', async () => {
      await formPage.fillFirstName(testData.firstName);
      await formPage.fillLastName(testData.lastName);
      await formPage.selectGender(testData.gender);
      await formPage.fillMobile('123');
    });

    await test.step('Submit and verify failure', async () => {
      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(false);
    });
  });

  test('State and City dependency', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const stateCity = StateCityData.getFixedStateCity();
    const testData = TestDataGenerator.generateMinimalFormData();

    await test.step('Verify city is initially disabled', async () => {
      const isCityDisabled = await formPage.isCityDropdownDisabled();
      expect(isCityDisabled).toBe(true);
    });

    await test.step('Select state and verify city enabled', async () => {
      await formPage.selectState(stateCity.state);

      const isCityDisabled = await formPage.isCityDropdownDisabled();
      expect(isCityDisabled).toBe(false);
    });

    await test.step('Complete form and verify state/city in result', async () => {
      await formPage.selectCity(stateCity.city);

      await formPage.fillFirstName(testData.firstName);
      await formPage.fillLastName(testData.lastName);
      await formPage.selectGender(testData.gender);
      await formPage.fillMobile(testData.mobile);

      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      expect(modalData['State and City']).toBe(StateCityData.formatStateCityResult(stateCity.state, stateCity.city));
    });
  });

  test('Random state and city combinations', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const testData = TestDataGenerator.generateMinimalFormData();

    await test.step('Test with random state-city combination', async () => {
      const randomStateCityData = StateCityData.getRandomStateCityWithAddress();
      console.log(`Testing with random combination: ${randomStateCityData.state} - ${randomStateCityData.city}`);
      console.log(`Generated address: ${randomStateCityData.address}`);

      await formPage.fillFirstName(testData.firstName);
      await formPage.fillLastName(testData.lastName);
      await formPage.selectGender(testData.gender);
      await formPage.fillMobile(testData.mobile);

      await formPage.fillCurrentAddress(randomStateCityData.address);

      await formPage.selectState(randomStateCityData.state);
      await formPage.selectCity(randomStateCityData.city);

      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      const expectedStateCity = StateCityData.formatStateCityResult(
        randomStateCityData.state,
        randomStateCityData.city,
      );
      expect(modalData['State and City']).toBe(expectedStateCity);
      expect(modalData['Address']).toBe(randomStateCityData.address);

      console.log(` Successfully tested: ${expectedStateCity} with address: ${randomStateCityData.address}`);
    });
  });

  test('All state-city combinations validation', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const allCombinations = StateCityData.getAllStateCityCombinations();
    const testCombinations = allCombinations.slice(0, 3);

    for (const combination of testCombinations) {
      await test.step(`Test combination: ${combination.state} - ${combination.city}`, async () => {
        const testData = TestDataGenerator.generateMinimalFormData();

        await page.reload();
        await page.waitForLoadState('domcontentloaded');
        await formPage.blockAds();

        await formPage.fillFirstName(testData.firstName);
        await formPage.fillLastName(testData.lastName);
        await formPage.selectGender(testData.gender);
        await formPage.fillMobile(testData.mobile);

        await formPage.selectState(combination.state);
        await formPage.selectCity(combination.city);

        await formPage.submitForm();

        const isModalVisible = await formPage.isModalVisible();
        expect(isModalVisible).toBe(true);

        const modalData = await formPage.getModalData();
        const expectedResult = StateCityData.formatStateCityResult(combination.state, combination.city);
        expect(modalData['State and City']).toBe(expectedResult);

        await page.keyboard.press('Escape');
      });
    }
  });

  test('Email validation patterns', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const testData = TestDataGenerator.generateCompleteFormData();

    await test.step('Test valid email format', async () => {
      await formPage.fillFirstName(testData.firstName);
      await formPage.fillLastName(testData.lastName);
      await formPage.fillEmail(testData.email);
      await formPage.selectGender(testData.gender);
      await formPage.fillMobile(testData.mobile);

      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      expect(modalData['Student Email']).toBe(testData.email);
    });
  });

  test('File upload verification', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const testData = TestDataGenerator.generateMinimalFormData();

    await test.step('Upload file and verify', async () => {
      await formPage.fillFirstName(testData.firstName);
      await formPage.fillLastName(testData.lastName);
      await formPage.selectGender(testData.gender);
      await formPage.fillMobile(testData.mobile);

      await formPage.uploadFile(testImagePath);
      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      expect(modalData['Picture']).toBe('test-image.png');
    });
  });
});
