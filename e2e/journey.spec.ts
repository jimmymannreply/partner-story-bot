import { test, expect } from "@playwright/test";

test.describe("Partner Story Bot journey", () => {
  test("landing to journey start", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("start-my-story")).toBeVisible();
    await page.getByTestId("start-my-story").click();
    await expect(page.getByTestId("context-bar")).toBeVisible();
    await expect(page.getByTestId("stage-stepper")).toBeVisible();
    await expect(page.getByTestId("right-rail")).toBeVisible();
  });

  test("partner page entry point", async ({ page }) => {
    await page.goto("/partner");
    await page.getByTestId("share-your-story").click();
    await expect(page.getByTestId("stage-panel")).toBeVisible();
  });

  test("collect context stage flow", async ({ page }) => {
    await page.goto("/journey");

    await page.getByTestId("sign-in-button").click();
    await expect(page.getByText("Signed in successfully")).toBeVisible({
      timeout: 5000,
    });

    await page.getByTestId("confirm-profile").click();
    await page.getByTestId("confirm-designations").click();

    await page.getByTestId("engagement-eng-1").click();
    await page.getByTestId("select-engagement").click();

    await page.getByTestId("affidavit-checkbox").check();
    await page.getByTestId("approval-Approved for public use").click();
    await page.getByTestId("accept-consent").click();

    await expect(page.getByTestId("stage-capture")).toBeVisible();
  });

  test("capture action with text input", async ({ page }) => {
    await page.goto("/journey");

    await page.getByTestId("stage-capture").click();
    const input = page.getByTestId("action-materials").getByTestId("input-row-text");
    await input.fill("We have an existing case study PDF with customer quotes.");
    await page.getByTestId("action-materials").getByTestId("complete-materials").click();
    await expect(
      page.getByTestId("action-materials").getByText("Complete")
    ).toBeVisible();
  });

  test("side tasks panel opens", async ({ page }) => {
    await page.goto("/journey");
    await page.getByTestId("side-tasks-button").click();
    await expect(page.getByTestId("mock-face-scan")).toBeVisible();
  });

  test("demo banner dismisses", async ({ page }) => {
    await page.goto("/journey");
    await expect(page.getByTestId("demo-banner")).toBeVisible();
    await page.getByTestId("demo-banner").getByRole("button").click();
    await expect(page.getByTestId("demo-banner")).not.toBeVisible();
  });

  test("no console errors on landing", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.getByTestId("start-my-story").click();
    await page.waitForTimeout(1000);
    expect(errors).toEqual([]);
  });
});
