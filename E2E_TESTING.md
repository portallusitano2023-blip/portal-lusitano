# E2E Testing with Playwright

This project uses Playwright for end-to-end (E2E) testing to ensure critical user flows work correctly.

## Setup

### Install Dependencies

```bash
npm install
```

Playwright is installed as a dev dependency. You'll also need to install the browser binaries:

```bash
npx playwright install
```

## Running Tests

### Run all E2E tests

```bash
npm run e2e
```

### Run tests in headed mode (see browser)

```bash
npm run e2e:headed
```

### Run tests with debugging

```bash
npm run e2e:debug
```

### Run tests sequentially (single worker)

```bash
npm run e2e:run
```

## Test Configuration

The Playwright configuration is defined in `playwright.config.ts` and includes:

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Screenshots & Videos**: Captured on test failure
- **Traces**: Recorded on retry
- **Timeouts**: Configurable per test
- **Web Server**: Automatically starts the Next.js dev server

## Writing Tests

E2E tests are located in `__tests__/checkout.spec.ts` and follow this pattern:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test("should do something", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Expected Title");
    // Add assertions and interactions
  });
});
```

### Best Practices

1. **Use semantic locators**: Prefer `data-testid`, `role`, or `text` over CSS selectors
2. **Wait for elements**: Use `waitForURL`, `waitForSelector`, or `expect` to wait
3. **Test user flows**: Focus on complete workflows, not implementation details
4. **Clear assertions**: Each test should verify specific user-facing behavior
5. **Isolate tests**: Each test should be independent and not rely on others

## CI/CD Integration

Tests run automatically on:

- **Pushes** to `main` and `develop` branches
- **Pull requests** to `main` and `develop` branches

See `.github/workflows/e2e.yml` for workflow configuration.

### Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## Troubleshooting

### Tests fail locally but pass in CI

- Ensure you have the same Node version as CI (check `.github/workflows/e2e.yml`)
- Clear browser cache: `rm -rf ~/.cache/ms-playwright`
- Rebuild: `npm run build && npm run e2e`

### Browser won't launch

- Ensure browsers are installed: `npx playwright install`
- On Linux, install system dependencies: `npx playwright install-deps`

### Tests timeout

- Increase timeout in config or specific tests
- Check if the dev server is running properly
- Look for network errors or JavaScript errors in the page

## Current Tests

### Checkout Flow (`checkout.spec.ts`)

Tests the primary e-commerce checkout flow:

1. **Product Navigation**: Users can navigate to products
2. **Add to Cart**: Products can be added to cart
3. **Checkout**: Complete checkout process from cart to payment page
4. **Page Structure**: Verifies essential UI elements exist

---

For more information, see the [Playwright Documentation](https://playwright.dev)
