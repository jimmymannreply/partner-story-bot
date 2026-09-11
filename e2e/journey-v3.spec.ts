import { test, expect } from "@playwright/test";

test.describe("Partner Story Bot V3", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/v3");
    await page.evaluate(() => localStorage.clear());
  });

  test("v3 landing to microsoft contact", async ({ page }) => {
    await page.getByTestId("v3-start").click();
    await expect(page.getByTestId("v3-ms-contact")).toBeVisible();
  });

  test("v3 submissions queue renders", async ({ page }) => {
    await page.goto("/v3/submissions");
    await expect(page.getByTestId("v3-submissions-table")).toBeVisible();
  });
});
