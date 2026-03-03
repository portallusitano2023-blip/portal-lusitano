#!/usr/bin/env node

/**
 * Quick Reference: Playwright E2E Testing Commands
 *
 * Copy this file to your terminal for quick access to common E2E testing commands
 */

const commands = {
  Install: {
    "Install dependencies": "npm install",
    "Install Playwright browsers": "npx playwright install",
  },

  "Run Tests": {
    "All tests (parallel)": "npm run e2e",
    "All tests (sequential)": "npm run e2e:run",
    "With visible browser": "npm run e2e:headed",
    "Debug mode (step-through)": "npm run e2e:debug",
    "Specific test file": "npx playwright test __tests__/checkout.spec.ts",
    "Specific test by name": "npx playwright test -g 'should navigate'",
    "Single browser": "npx playwright test --project=chromium",
  },

  Reports: {
    "View HTML report": "npx playwright show-report",
    "Open trace": "npx playwright show-trace path/to/trace.zip",
  },

  Development: {
    "Start dev server": "npm run dev",
    "Build for testing": "npm run build",
    "Run type check": "npm run type-check",
  },

  "CI/CD": {
    "Simulate CI locally": "CI=true npm run e2e:run",
    "View GitHub Actions": "Open .github/workflows/e2e.yml",
  },

  Debugging: {
    "Clear cache": "rm -rf ~/.cache/ms-playwright node_modules",
    "Reinstall browsers": "npx playwright install --force",
    "Check Playwright version": "npx playwright --version",
  },

  Documentation: {
    "E2E Guide": "cat E2E_TESTING.md",
    "Setup Summary": "cat PLAYWRIGHT_SETUP.md",
    Architecture: "cat E2E_ARCHITECTURE.md",
    "Playwright Docs": "https://playwright.dev",
  },
};

// Print formatted reference
console.log("\n╔════════════════════════════════════════════════════════════╗");
console.log("║         PLAYWRIGHT E2E QUICK REFERENCE                    ║");
console.log("╚════════════════════════════════════════════════════════════╝\n");

Object.entries(commands).forEach(([category, items]) => {
  console.log(`\n📋 ${category}:`);
  console.log("─".repeat(60));

  Object.entries(items).forEach(([description, command]) => {
    console.log(`  ${description}:`);
    console.log(`    $ ${command}\n`);
  });
});

console.log("\n" + "═".repeat(60));
console.log("💡 TIP: Use 'npm run e2e:headed' to watch tests in browser");
console.log("🐛 DEBUG: Use 'npm run e2e:debug' to step through tests");
console.log("📊 REPORTS: Use 'npx playwright show-report' to view results");
console.log("═".repeat(60) + "\n");

// Test status check
console.log("📌 Current Test Files:");
console.log("  ✓ __tests__/checkout.spec.ts - Checkout flow tests");
console.log("  ✓ __tests__/test-helpers.ts - Reusable test utilities");
console.log("  ✓ __tests__/playwright.setup.ts - Shared setup");

console.log("\n📌 Configuration:");
console.log("  ✓ playwright.config.ts - Main config");
console.log("  ✓ .github/workflows/e2e.yml - CI/CD workflow");

console.log("\n✨ All set! Start testing with: npm run e2e\n");

export {};
