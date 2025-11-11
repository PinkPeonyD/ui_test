import { test, expect } from '@playwright/test';
import { AutomationPracticeFormPage, MainPage } from '../src/pageObjects';
import { StateCityData } from '../src/utils';
import path from 'path';
import fs from 'fs';
//TODO: Remove hardcoded data from tests
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

    await test.step('Fill minimum required fields', async () => {
      await formPage.fillFirstName('Daria');
      await formPage.fillLastName('Shamraeva');
      await formPage.selectGender('Female');
      await formPage.fillMobile('1234567890');
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

      expect(modalData['Student Name']).toBe('Daria Shamraeva');
      expect(modalData['Gender']).toBe('Female');
      expect(modalData['Mobile']).toBe('1234567890');
    });
  });

  test('Positive: Fill all fields step by step', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const stateCityData = StateCityData.getFixedStateCityWithAddress();

    await test.step('Fill basic info', async () => {
      await formPage.fillFirstName('Daria');
      await formPage.fillLastName('Shamraeva');
      await formPage.fillEmail('daria.shamraeva@example.com');
      await formPage.selectGender('Female');
      await formPage.fillMobile('1234567890');
    });

    await test.step('Select date of birth', async () => {
      await formPage.selectDateOfBirth(6, '5', '2001');
    });

    await test.step('Fill address', async () => {
      await formPage.fillCurrentAddress(stateCityData.address);
    });

    await test.step('Select state and city', async () => {
      await formPage.selectState(stateCityData.state);
      // TODO: Do we need this timeout? Replace with waitForResponse or waitForSelector if needed
      // Avoid hardcoding timeouts like await page.waitForTimeout(1000);
      // This approach is unreliable and can slow down tests unnecessarily.
      // Instead, use explicit waits for specific elements or conditions to ensure stability and better performance.
      await page.waitForTimeout(1000);
      await formPage.selectCity(stateCityData.city);
    });

    await test.step('Submit and verify basic fields', async () => {
      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      expect(modalData['Student Name']).toBe('Daria Shamraeva');
      expect(modalData['Student Email']).toBe('daria.shamraeva@example.com');
      expect(modalData['Gender']).toBe('Female');
      expect(modalData['Mobile']).toBe('1234567890');
      expect(modalData['Date of Birth']).toMatch(/.*June.*2001|.*06.*2001|.*6.*2001/);
      expect(modalData['Address']).toBe(stateCityData.address);
      expect(modalData['State and City']).toBe(
        StateCityData.formatStateCityResult(stateCityData.state, stateCityData.city),
      );
    });
  });

  test('Complete form with all basic fields', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);
    const stateCityData = StateCityData.getFixedStateCityWithAddress();

    await test.step('Fill complete form with all basic fields', async () => {
      await formPage.fillFirstName('Daria');
      await formPage.fillLastName('Shamraeva');
      await formPage.fillEmail('daria.shamraeva@example.com');
      await formPage.selectGender('Female');
      await formPage.fillMobile('1234567890');
      await formPage.selectDateOfBirth(6, '5', '2001');
      await formPage.fillCurrentAddress(stateCityData.address);
      await formPage.selectState(stateCityData.state);
      await page.waitForTimeout(1000);
      await formPage.selectCity(stateCityData.city);
      await formPage.uploadFile(testImagePath);

      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      expect(modalData['Student Name']).toBe('Daria Shamraeva');
      expect(modalData['Student Email']).toBe('daria.shamraeva@example.com');
      expect(modalData['Gender']).toBe('Female');
      expect(modalData['Mobile']).toBe('1234567890');
      expect(modalData['Date of Birth']).toContain('06 June,2001');
      expect(modalData['Address']).toBe(stateCityData.address);
      expect(modalData['State and City']).toBe(
        StateCityData.formatStateCityResult(stateCityData.state, stateCityData.city),
      );
      expect(modalData['Picture']).toBe('test-image.png');
    });
  });

  test('Hobbies functionality', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);

    await test.step('Fill required fields and select hobby', async () => {
      await formPage.fillFirstName('Daria');
      await formPage.fillLastName('Shamraeva');
      await formPage.selectGender('Female');
      await formPage.fillMobile('1234567890');

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

    await test.step('Fill form without gender', async () => {
      await formPage.fillFirstName('Test');
      await formPage.fillLastName('User');
      await formPage.fillMobile('1234567890');
    });

    await test.step('Submit and verify failure', async () => {
      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(false);
    });
  });

  test('Negative: Invalid mobile number', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);

    await test.step('Fill form with short mobile', async () => {
      await formPage.fillFirstName('Test');
      await formPage.fillLastName('User');
      await formPage.selectGender('Male');
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

    await test.step('Verify city is initially disabled', async () => {
      const isCityDisabled = await formPage.isCityDropdownDisabled();
      expect(isCityDisabled).toBe(true);
    });

    await test.step('Select state and verify city enabled', async () => {
      await formPage.selectState(stateCity.state);
      await page.waitForTimeout(1000);

      const isCityDisabled = await formPage.isCityDropdownDisabled();
      expect(isCityDisabled).toBe(false);
    });

    await test.step('Complete form and verify state/city in result', async () => {
      await formPage.selectCity(stateCity.city);

      await formPage.fillFirstName('Test');
      await formPage.fillLastName('User');
      await formPage.selectGender('Male');
      await formPage.fillMobile('1234567890');

      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      expect(modalData['State and City']).toBe(StateCityData.formatStateCityResult(stateCity.state, stateCity.city));
    });
  });

  test('Random state and city combinations', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);

    await test.step('Test with random state-city combination', async () => {
      const randomStateCityData = StateCityData.getRandomStateCityWithAddress();
      console.log(`Testing with random combination: ${randomStateCityData.state} - ${randomStateCityData.city}`);
      console.log(`Generated address: ${randomStateCityData.address}`);

      await formPage.fillFirstName('Test');
      await formPage.fillLastName('User');
      await formPage.selectGender('Male');
      await formPage.fillMobile('1234567890');

      await formPage.fillCurrentAddress(randomStateCityData.address);

      await formPage.selectState(randomStateCityData.state);
      await page.waitForTimeout(1000);
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
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
        await formPage.blockAds();

        await formPage.fillFirstName('Test');
        await formPage.fillLastName('User');
        await formPage.selectGender('Female');
        await formPage.fillMobile('1234567890');

        await formPage.selectState(combination.state);
        await page.waitForTimeout(1000);
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

    await test.step('Test valid email: daria.shamraeva@example.com', async () => {
      await formPage.fillFirstName('Daria');
      await formPage.fillLastName('Shamraeva');
      await formPage.fillEmail('daria.shamraeva@example.com');
      await formPage.selectGender('Female');
      await formPage.fillMobile('1234567890');

      await formPage.submitForm();

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      expect(modalData['Student Email']).toBe('daria.shamraeva@example.com');
    });
  });

  test('File upload verification', async ({ page }) => {
    const formPage = new AutomationPracticeFormPage(page);

    await test.step('Upload file and verify', async () => {
      await formPage.fillFirstName('Daria');
      await formPage.fillLastName('Shamraeva');
      await formPage.selectGender('Female');
      await formPage.fillMobile('1234567890');

      await formPage.uploadFile(testImagePath);
      await page.waitForTimeout(1000);

      await formPage.submitForm();
      await page.waitForTimeout(1000);

      const isModalVisible = await formPage.isModalVisible();
      expect(isModalVisible).toBe(true);

      const modalData = await formPage.getModalData();
      expect(modalData['Picture']).toBe('test-image.png');
    });
  });
});
