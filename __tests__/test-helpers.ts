// test-helpers.ts - Shared test utilities
import { Page, expect } from "@playwright/test";

export const testHelpers = {
  /**
   * Navigate and verify page loaded
   */
  async navigateTo(page: Page, path: string) {
    await page.goto(path);
    await expect(page).toHaveURL(new RegExp(path));
  },

  /**
   * Find and click element by multiple selectors
   */
  async clickElement(page: Page, selectors: string[]) {
    for (const selector of selectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible()) {
        await element.click();
        return;
      }
    }
    throw new Error(`Could not find clickable element with selectors: ${selectors.join(", ")}`);
  },

  /**
   * Wait for element and verify visibility
   */
  async waitForElement(page: Page, selector: string, timeout = 5000) {
    const element = page.locator(selector).first();
    await expect(element).toBeVisible({ timeout });
    return element;
  },

  /**
   * Take screenshot with descriptive name
   */
  async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({ path: `screenshots/${name}-${timestamp}.png` });
  },
};
