import { expect, test } from "@playwright/test";

test("revealing, hiding and editing preserve the generated ladder", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Show solution" }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Generate ladder", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your ladder" }),
  ).toBeFocused();
  const rungs = await page.locator(".ladder-svg g").innerHTML();
  await page.getByRole("button", { name: "Show solution" }).click();
  const results = await page.locator(".result-list").innerText();
  await expect(page.locator(".result-row")).toHaveCount(4);
  await page.locator(".result-row").first().click();
  await expect(page.locator(".result-row").first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".solution-path").nth(1)).toHaveAttribute(
    "opacity",
    "0.08",
  );
  await page.getByRole("button", { name: "Copy results" }).click();
  await expect(
    page.getByText("Results copied.", { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "1. Ana →",
  );
  await page.getByRole("button", { name: "Hide solution" }).click();
  await expect(page.locator(".result-row")).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Participant 1", exact: true })
    .fill("New name");
  await page.getByRole("button", { name: "Show solution" }).click();
  expect(await page.locator(".ladder-svg g").innerHTML()).toBe(rungs);
  expect(await page.locator(".result-list").innerText()).toBe(results);
  await page.getByRole("button", { name: "Generate a new ladder" }).click();
  await expect(page.locator(".ladder-labels").first()).toContainText(
    "New name",
  );
  await expect(page.locator(".result-row")).toHaveCount(0);
});

test("blank names are recoverable and maximum settings remain playable on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Participant 1", exact: true })
    .fill("   ");
  await expect(
    page.getByRole("button", { name: "Generate ladder", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByText(
      "Give every participant and outcome a name of 1 to 40 characters.",
    ),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Participant 1", exact: true })
    .fill("A".repeat(40));
  await page.getByRole("combobox", { name: "Participants", exact: true }).selectOption("12");
  await page.getByRole("combobox", { name: "Minimum rungs", exact: true }).selectOption("6");
  await expect(page.getByRole("textbox")).toHaveCount(24);
  await page
    .getByRole("button", { name: "Generate ladder", exact: true })
    .click();
  await page.getByRole("button", { name: "Show solution" }).click();
  await expect(page.locator(".result-row")).toHaveCount(12);
  const outcomes = await page.locator(".result-row strong").allTextContents();
  expect(new Set(outcomes).size).toBe(12);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator(".ladder-scroll")
      .evaluate((el) => el.scrollWidth > el.clientWidth),
  ).toBe(true);
  await page.getByRole("combobox", { name: "Participants", exact: true }).selectOption("2");
  await page.getByRole("button", { name: "Generate a new ladder" }).click();
  await page.getByRole("button", { name: "Show solution" }).click();
  await expect(page.locator(".result-row")).toHaveCount(2);
  expect(errors).toEqual([]);
});

test("clipboard rejection reports a recovery path", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error("Permission denied")),
      },
    });
  });
  await page
    .getByRole("button", { name: "Generate ladder", exact: true })
    .click();
  await page.getByRole("button", { name: "Show solution" }).click();
  await page.getByRole("button", { name: "Copy results" }).click();
  await expect(
    page.getByText("Copy unavailable. Select and copy the results below."),
  ).toBeVisible();
});
