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

##  Code Quality

### ESLint

**Check code for errors:**
```bash
npm run lint
```

**Automatically fix errors:**
```bash
npm run lint:fix
```

### Prettier

**Format all files:**
```bash
npm run prettier
```

### Full check before commit

```bash
npm run prettier && npm run lint && npm test
```
