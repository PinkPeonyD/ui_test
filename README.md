# UI Testing Project - DemoQA Automation

Automated testing project for [DemoQA](https://demoqa.com) web application using Playwright and Page Object Model pattern.

##  Installation

1. Clone the repository:
```bash
git clone https://github.com/PinkPeonyD/ui_test.git
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

### Basic Commands

**Run all tests (headless mode):**
```bash
npm test
```

**Run tests with visible browser:**
```bash
npm run test-headed
```

**Run tests in UI mode (interactive):**
```bash
npm run test-ui
```

```bash
VIEWPORT_WIDTH=1280 VIEWPORT_HEIGHT=720 npx playwright test
```

```bash
VIEWPORT_WIDTH=1440 VIEWPORT_HEIGHT=900 npx playwright test
```

```bash
WORKERS=2 npx playwright test
```

```bash
WORKERS=1 npx playwright test
```

```bash
WORKERS=10 npx playwright test
```

```bash
RUN_THIS="Text Box" npx playwright test
```

```bash
RUN_THIS="Select Menu" npx playwright test
```

```bash
RUN_THIS="Form" npx playwright test
```

```bash
VIEWPORT_WIDTH=1280 VIEWPORT_HEIGHT=720 WORKERS=2 RUN_THIS="Text Box" npx playwright test
```

```bash
VIEWPORT_WIDTH=1920 VIEWPORT_HEIGHT=1080 WORKERS=4 npx playwright test
```

### Running Specific Tests

**Run a specific test file:**
```bash
npx playwright test tests/automationPracticeFormSimple.spec.js
```

**Run a specific test by name:**
```bash
npx playwright test -g "Fill required fields only"
```

**Run in a specific browser:**
```bash
npx playwright test --project="Google Chrome"
```

**Run with headed mode:**
```bash
npx playwright test tests/automationPracticeFormSimple.spec.js --headed
```

**Run with debugging:**
```bash
npx playwright test --debug
```

### View Reports

**Open HTML report:**
```bash
npx playwright show-report
```
