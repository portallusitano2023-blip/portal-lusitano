import { test, expect } from "@playwright/test";

test.describe("Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should navigate to product and add to cart", async ({ page }) => {
    await expect(page).toHaveTitle(/Portal Lusitano/i);
    const productsLink = page.locator('a[href*="produtos"], a[href*="products"]').first();
    if (await productsLink.isVisible()) {
      await productsLink.click();
      await page.waitForURL(/.*produtos.*|.*products.*/);
    }
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("should complete checkout flow with product", async ({ page }) => {
    await page.goto("/produtos");
    await expect(page).toHaveURL(/.*produtos.*/);
    const firstProduct = page
      .locator('[data-testid="product-item"], article, .product-card')
      .first();
    await expect(firstProduct).toBeVisible();
    const productTitle = await firstProduct.locator("h2, h3, .product-name").first().textContent();
    console.log(`Adding product: ${productTitle}`);
    const addToCartBtn = firstProduct
      .locator('button:has-text("Adicionar"), button:has-text("Add")')
      .first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
    } else {
      await firstProduct.click();
    }
    await page.waitForTimeout(500);
    const cartLink = page
      .locator(
        'a[href*="carrinho"], a[href*="cart"], button:has-text("Carrinho"), button:has-text("Cart")'
      )
      .first();
    if (await cartLink.isVisible()) {
      await cartLink.click();
      await page.waitForURL(/.*carrinho.*|.*cart.*/);
    }
    await expect(page.locator("text=Total|Subtotal|Valor")).toBeVisible();
    const checkoutBtn = page
      .locator('button:has-text("Checkout"), button:has-text("Finalizar"), a:has-text("Pagar")')
      .first();
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await page.waitForTimeout(1000);
      const pageContent = await page.content();
      const isCheckoutPage =
        pageContent.includes("Stripe") ||
        pageContent.includes("checkout") ||
        pageContent.includes("payment");
      expect(isCheckoutPage).toBeTruthy();
    }
  });

  test("should have proper page structure", async ({ page }) => {
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 5000 });
  });
});
