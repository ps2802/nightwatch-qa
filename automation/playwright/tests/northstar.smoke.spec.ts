import { expect, test } from "@playwright/test";
import { captureEvidence } from "./utils/evidence";

test.describe("Northstar smoke coverage", () => {
  test("board is the default route and main product surface @northstar", async ({
    page,
  }, testInfo) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/board$/);

    const navItems = page.locator('nav[aria-label="Primary"] a');
    await expect(navItems).toHaveCount(6);
    await expect(navItems).toHaveText([
      "Dashboard",
      "Board",
      "Approvals",
      "Campaigns",
      "Analytics",
      "Settings",
    ]);

    await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Needs approval" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Live campaigns" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Performance snapshot" })).toBeVisible();

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toContain("command center");
    expect(bodyText).not.toContain("Northstar is");
    expect(bodyText).not.toContain("wave focus");
    expect(bodyText).not.toContain("pilot readiness");
    expect(bodyText).not.toContain("signals");

    await captureEvidence(page, testInfo, "northstar-board");
  });

  test("board validates real-read loading and empty states @northstar", async ({
    page,
  }, testInfo) => {
    await page.goto("/board?phase2aDelayMs=1200");

    await expect(page.getByText("Loading").first()).toBeVisible();
    await expect(page.getByText("Approve launch week subject line")).toBeVisible();

    await page.goto(
      "/board?boardHomeScenario=empty&approvalSummaryScenario=empty&campaignSummaryScenario=empty",
    );

    await expect(page.getByText("No priorities match the current search.")).toBeVisible();
    await expect(page.getByText("No pending approvals match the current search.")).toBeVisible();
    await expect(page.getByText("No live campaigns match the current search.")).toBeVisible();

    await captureEvidence(page, testInfo, "northstar-board-empty");
  });

  test("board validates real-read error and partial failure states @northstar", async ({
    page,
  }, testInfo) => {
    await page.goto("/board?boardHomeScenario=error");
    await expect(page.getByText("Board priorities are unavailable right now.")).toBeVisible();

    await page.goto("/board?campaignSummaryScenario=error");
    await expect(page.getByText("Campaign summaries are unavailable right now.")).toBeVisible();

    await page.goto("/board?approvalSummaryScenario=error&campaignSummaryScenario=empty");
    await expect(page.getByText("Approval summaries are unavailable right now.")).toBeVisible();
    await expect(page.getByText("No live campaigns match the current search.")).toBeVisible();
    await expect(page.getByText("Approve launch week subject line")).toBeVisible();

    await captureEvidence(page, testInfo, "northstar-board-degraded");
  });

  test("approvals review opens responsive detail and updates local state @northstar", async ({
    page,
  }, testInfo) => {
    await page.goto("/approvals");

    await page.getByRole("button", { name: "Waiting on me" }).click();
    await page.getByRole("button", { name: "Preview" }).first().click();
    const reviewDialog = page.getByRole("dialog").filter({ hasText: "Final draft" });

    if (testInfo.project.name === "mobile-chrome") {
      await expect(reviewDialog).toBeVisible();
      await reviewDialog.getByRole("button", { name: "Approve" }).click();
    } else {
      await expect(reviewDialog).toBeVisible();
      await reviewDialog.getByRole("button", { name: "Approve" }).click();
    }

    await expect(page.getByText("1 waiting")).toBeVisible();
    await page.getByRole("button", { name: "Approved" }).click();
    await expect(page.getByText("Launch week subject line")).toBeVisible();

    await captureEvidence(page, testInfo, "northstar-approvals");
  });

  test("create campaign flow makes a local draft and campaign tabs render @northstar", async ({
    page,
  }, testInfo) => {
    await page.goto("/campaigns/new");

    await page.getByRole("button", { name: "Email" }).click();
    await page.getByRole("button", { name: "Next step" }).click();

    await page
      .getByPlaceholder("Example: Re-activate dormant trials before Friday")
      .fill("Win back inactive workspace owners");
    await page.getByRole("button", { name: "Next step" }).click();

    await page
      .getByPlaceholder("Example: Dormant trial users from the last 14 days")
      .fill("Inactive workspace owners from the last 21 days");
    await page.getByRole("button", { name: "Next step" }).click();

    await page
      .getByPlaceholder("Relevant context, proof point, or constraint.")
      .fill("Lead with the fastest path back to value.");
    await page.getByRole("button", { name: "Next step" }).click();

    await expect(page.getByRole("heading", { name: "Generated plan" })).toBeVisible();
    await page.getByRole("button", { name: "Next step" }).click();
    await page.getByRole("button", { name: "Create draft" }).click();

    await page.waitForURL(/\/campaigns\/campaign-/);
    await expect(page.getByRole("tab", { name: "Overview" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Win back inactive workspace owners" }),
    ).toBeVisible();

    await page.getByRole("tab", { name: "Assets" }).click();
    await expect(page.getByRole("heading", { name: "Assets" })).toBeVisible();

    await page.getByRole("tab", { name: "Performance" }).click();
    await expect(page.getByText("Channel-appropriate status and movement.")).toBeVisible();

    await captureEvidence(page, testInfo, "northstar-campaign-draft");
  });

  test("analytics and settings expose decision-ready signals @northstar", async ({
    page,
  }, testInfo) => {
    await page.goto("/analytics");

    await expect(page.getByRole("heading", { name: "By campaign" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "By channel" })).toBeVisible();
    await expect(page.getByText("Use this page to decide where to push next.")).toBeVisible();

    await page.getByRole("button", { name: "7d" }).click();
    await expect(page.getByText("Short-term movement is positive but still narrow.")).toBeVisible();

    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Connected accounts" })).toBeVisible();
    await expect(page.getByText(/^Connected$/)).toBeVisible();
    await expect(page.getByText(/^Needs reconnect$/)).toBeVisible();
    await expect(page.getByText(/^Not connected$/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Notification preferences" })).toBeVisible();

    await captureEvidence(page, testInfo, "northstar-analytics-settings");
  });
});
