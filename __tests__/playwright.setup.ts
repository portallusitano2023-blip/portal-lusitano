// playwright.setup.ts - Shared test utilities and setup
import { test as base } from "@playwright/test";

type TestFixtures = {
  authenticatedPage: any;
};

export const test = base.extend<TestFixtures>({
  authenticatedPage: async (
    { page }: { page: import("@playwright/test").Page },
    use: (fixture: import("@playwright/test").Page) => Promise<void>
  ) => {
    // Setup: navigate to app
    await page.goto("/");
    // You can add authentication setup here if needed
    await use(page);
    // Cleanup if needed
  },
});

export { expect } from "@playwright/test";
