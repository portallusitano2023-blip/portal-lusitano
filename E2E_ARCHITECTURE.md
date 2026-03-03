# E2E Testing Architecture

## Overview

This project uses **Playwright** for end-to-end (E2E) testing with full CI/CD integration via GitHub Actions.

## Project Structure

```
portal-lusitano/
├── playwright.config.ts          # Playwright main configuration
├── .github/workflows/
│   └── e2e.yml                   # GitHub Actions E2E workflow
├── __tests__/
│   ├── checkout.spec.ts          # Main checkout flow tests
│   ├── playwright.setup.ts       # Shared test setup utilities
│   └── test-helpers.ts           # Reusable test helper functions
├── E2E_TESTING.md                # User guide for running tests
├── PLAYWRIGHT_SETUP.md           # Setup completion summary
└── E2E_ARCHITECTURE.md           # This file
```

## Configuration Details

### playwright.config.ts

**Base URL**: `http://localhost:3000`

**Browsers Tested**:

- ✅ Chromium (Desktop Chrome)
- ✅ Firefox (Desktop Firefox)
- ✅ WebKit (Desktop Safari)

**Test Execution**:

- **Local**: Parallel workers, no retries, reuse existing server
- **CI**: Single worker, 2 retries, fresh build

**Artifacts**:

- Screenshots: Captured on failure only
- Videos: Recorded on failure only
- Traces: Recorded on first retry

**Web Server**:

- Auto-starts: `npm run dev`
- Timeout: 120 seconds
- Reuses existing server on local runs

### GitHub Actions Workflow (.github/workflows/e2e.yml)

**Triggers**:

- Push to `main` and `develop` branches
- Pull requests to `main` and `develop` branches

**Steps**:

1. Checkout repository
2. Setup Node.js 20
3. Install npm dependencies
4. Install Playwright browsers (with system deps)
5. Build application
6. Run E2E tests with CI=true
7. Upload test report artifacts (30-day retention)

**Timeout**: 60 minutes

## Test Files

### checkout.spec.ts

Main test suite covering critical checkout flow:

**Tests**:

1. `should navigate to product and add to cart` - Product discovery flow
2. `should complete checkout flow with product` - Full cart → checkout journey
3. `should have proper page structure` - UI integrity checks

**Locator Strategy**:

- Uses flexible selectors (attribute, text, role)
- Multiple fallback options for robustness
- Language-aware (Portuguese/English)

### playwright.setup.ts

Shared test setup and utilities:

- Base test extension point
- Can add authentication fixtures
- Centralized test configuration

### test-helpers.ts

Reusable test utilities:

- `navigateTo()` - Navigate and verify page
- `clickElement()` - Find and click with fallbacks
- `waitForElement()` - Wait with visibility check
- `takeScreenshot()` - Timestamped screenshots

## Package.json Scripts

```json
{
  "e2e": "playwright test", // Run all tests (parallel)
  "e2e:run": "playwright test --workers=1", // Run sequentially
  "e2e:headed": "playwright test --headed", // Show browser window
  "e2e:debug": "playwright test --debug" // Debug mode
}
```

## Running Tests

### Local Development

```bash
# Install dependencies and browsers
npm install
npx playwright install

# Run all tests
npm run e2e

# Watch browser while tests run
npm run e2e:headed

# Debug specific test
npm run e2e:debug

# View test report
npx playwright show-report
```

### CI/CD Pipeline

Tests run automatically on:

- Every push to `main` or `develop`
- Every pull request to `main` or `develop`

Reports are uploaded as artifacts (available for 30 days).

## Test Execution Flow

```
Start CI Workflow
    ↓
Checkout Code
    ↓
Setup Node.js & Dependencies
    ↓
Install Playwright Browsers
    ↓
Build Next.js App
    ↓
Run Playwright Tests
    ├─ Chromium
    ├─ Firefox
    └─ WebKit
    ↓
Generate HTML Report
    ↓
Upload Artifacts
    ↓
End
```

## Best Practices

### Writing Tests

✅ **Do**:

- Use `data-testid` attributes for reliable selection
- Test complete user workflows
- Use semantic locators (role, text)
- Wait for navigation with `waitForURL`
- Isolate tests - no dependencies between them

❌ **Don't**:

- Rely on CSS classes (brittle)
- Test implementation details
- Use hard-coded delays (use waitFor instead)
- Leave state between tests
- Create test interdependencies

### Selectors

**Order of preference**:

1. `data-testid` attribute
2. `role` attribute
3. Semantic HTML (form labels, button text)
4. CSS classes with `[class*=""]` matching
5. Last resort: CSS/XPath

**Example**:

```typescript
// Good
page.locator('[data-testid="checkout-button"]');
page.locator('button:has-text("Finalizar Compra")');
page.locator('input[type="email"]');

// Avoid
page.locator(".btn-primary.checkout"); // brittle CSS
page.locator("div:nth-child(3)"); // fragile HTML structure
```

## Debugging

### View Failing Test

```bash
npm run e2e:debug
```

Playwright Inspector will open:

- Step through test line by line
- Inspect page DOM
- Evaluate JavaScript
- See element selectors

### Check Test Report

```bash
npm run e2e
npx playwright show-report
```

Opens interactive HTML report with:

- Test status (passed/failed)
- Screenshots of failures
- Video recordings
- Execution time

### Local vs CI Differences

**Local (reuseExistingServer: true)**:

- Uses existing dev server if running
- No retries
- All workers run in parallel
- Helpful for development

**CI (reuseExistingServer: false)**:

- Fresh build for each run
- 2 automatic retries
- Single worker (stability)
- Reports uploaded

## Extending Tests

### Adding New Test Suite

```typescript
// __tests__/payment.spec.ts
import { test, expect } from "@playwright/test";
import { testHelpers } from "./test-helpers";

test.describe("Payment Flow", () => {
  test("should process payment", async ({ page }) => {
    await testHelpers.navigateTo(page, "/checkout");
    // ... test implementation
  });
});
```

### Adding Page Object Models (Optional)

For more complex tests, consider page objects:

```typescript
class CheckoutPage {
  constructor(private page: Page) {}

  async fillEmail(email: string) {
    await this.page.fill('[data-testid="email"]', email);
  }

  async clickCheckout() {
    await this.page.click('[data-testid="checkout-button"]');
  }
}
```

## Troubleshooting

### Tests Pass Locally but Fail in CI

1. Check Node.js version: `node --version`
2. Clear cache: `rm -rf node_modules playwright-report`
3. Rebuild: `npm install && npm run build`
4. Check for environment variables: See CI logs

### Browser Won't Launch

```bash
# Install system dependencies (Linux)
npx playwright install-deps

# Reinstall browsers
rm -rf ~/.cache/ms-playwright
npx playwright install
```

### Tests Timeout

- Increase timeout in `playwright.config.ts`
- Check network: `page.waitForLoadState('networkidle')`
- Verify dev server: `npm run dev` works

### Flaky Tests

- Add waits: `await page.waitForURL()`
- Check element visibility: `await expect(element).toBeVisible()`
- Increase timeouts for slow operations
- Check for race conditions

## Monitoring & Reports

### GitHub Actions

After each workflow run:

1. Check workflow status: **Actions** tab → **E2E Tests** workflow
2. View detailed logs: Click workflow run → View logs
3. Download reports: Click run → **Artifacts** → Download
4. View HTML report: Extract artifact → Open `index.html`

### Local Reports

```bash
# Run tests with full output
npm run e2e:run

# View detailed HTML report
npx playwright show-report
```

## Performance Considerations

- **Parallel execution**: Default runs ~3x faster
- **Single worker CI**: Ensures stability, slightly slower
- **Web server reuse**: Saves ~10-15 seconds on local runs
- **Browser cache**: Cleared between test runs for isolation

## Security

- ✅ No sensitive data in test files
- ✅ Environment variables for credentials (not in repo)
- ✅ Tests run in isolated browser contexts
- ✅ No external API calls from tests (mock if needed)

## Future Enhancements

- [ ] Add visual regression testing (Percy, Applitools)
- [ ] Implement performance budget checks
- [ ] Add mobile device testing
- [ ] Create test data fixtures
- [ ] Generate coverage reports
- [ ] Add cross-browser compatibility matrix

---

**Last Updated**: 2024
**Playwright Version**: 1.48.2+
**Node Version**: 20+
