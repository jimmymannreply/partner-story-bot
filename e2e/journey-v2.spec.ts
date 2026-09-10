import { test, expect } from "@playwright/test";

test.describe("Partner Story Bot V2", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/v2");
    await page.evaluate(() => localStorage.clear());
  });

  test("v2 landing to manual entry", async ({ page }) => {
    await page.getByTestId("v2-start-my-story").click();
    await expect(page.getByTestId("v2-action-manual-entry")).toBeVisible();
    await page.getByTestId("v2-manual-companyName").fill("Contoso Solutions");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByTestId("v2-manual-headquarters")).toBeVisible();
  });

  test("v2 addon drawer opens", async ({ page }) => {
    await page.getByTestId("v2-start-my-story").click();
    await page.getByTestId("addon-drawer-open").click();
    await expect(page.getByTestId("addon-drawer")).toBeVisible();
  });
});
