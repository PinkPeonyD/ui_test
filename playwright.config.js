// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
const VIEWPORT_WIDTH = process.env.VIEWPORT_WIDTH ? parseInt(process.env.VIEWPORT_WIDTH) : null;
const VIEWPORT_HEIGHT = process.env.VIEWPORT_HEIGHT ? parseInt(process.env.VIEWPORT_HEIGHT) : null;
const WORKERS = process.env.WORKERS ? parseInt(process.env.WORKERS) : undefined;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: WORKERS || (process.env.CI ? 1 : undefined),
  /* Grep pattern to run specific tests by keyword */
  grep: process.env.RUN_THIS ? new RegExp(process.env.RUN_THIS) : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    screenshot: 'only-on-failure',
  },

  projects:
    VIEWPORT_WIDTH && VIEWPORT_HEIGHT
      ? [
          {
            name: `Google Chrome - ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}`,
            use: {
              ...devices['Desktop Chrome'],
              channel: 'chrome',
              viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
            },
          },
          {
            name: `Mozilla Firefox - ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}`,
            use: {
              ...devices['Desktop Firefox'],
              viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
            },
          },
        ]
      : [
          {
            name: 'Google Chrome',
            use: {
              ...devices['Desktop Chrome'],
              channel: 'chrome',
              viewport: { width: 1920, height: 1080 },
            },
          },

          {
            name: 'Google Chrome - 1366x768',
            use: {
              ...devices['Desktop Chrome'],
              channel: 'chrome',
              viewport: { width: 1366, height: 768 },
            },
          },

          {
            name: 'Mozilla Firefox',
            use: {
              ...devices['Desktop Firefox'],
              viewport: { width: 1920, height: 1080 },
            },
          },

          {
            name: 'Mozilla Firefox - 1366x768',
            use: {
              ...devices['Desktop Firefox'],
              viewport: { width: 1366, height: 768 },
            },
          },
        ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
