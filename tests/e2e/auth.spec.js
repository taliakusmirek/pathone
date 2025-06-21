const { test, expect } = require("@playwright/test");

// Test data
const testUser = {
    email: "test-e2e@example.com",
    password: "TestPassword123",
};

test.describe("Authentication Flow", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to auth page before each test
        await page.goto("http://localhost:3000/auth");
    });

    test("should display login form by default", async ({ page }) => {
        // Check if login form is displayed
        await expect(
            page.getByRole("heading", { name: "Welcome Back" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Sign In" })
        ).toBeVisible();
        await expect(page.getByText("Don't have an account?")).toBeVisible();
    });

    test("should switch to signup form", async ({ page }) => {
        // Click on "Sign up here" link
        await page.getByRole("button", { name: "Sign up here" }).click();

        // Check if signup form is displayed
        await expect(
            page.getByRole("heading", { name: "Create Account" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Create Account" })
        ).toBeVisible();
        await expect(page.getByText("Already have an account?")).toBeVisible();
    });

    test("should successfully sign up a new user", async ({ page }) => {
        // Switch to signup form
        await page.getByRole("button", { name: "Sign up here" }).click();

        // Fill signup form with valid data
        await page.getByPlaceholder("Enter your email").fill(testUser.email);
        await page
            .getByPlaceholder("Create a password")
            .fill(testUser.password);
        await page
            .getByPlaceholder("Confirm your password")
            .fill(testUser.password);

        // Submit form
        await page.getByRole("button", { name: "Create Account" }).click();

        // Wait for redirect or success indication
        await page.waitForURL("**/dashboard", { timeout: 10000 });
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test("should successfully login with existing user", async ({ page }) => {
        // Fill login form
        await page.getByPlaceholder("Enter your email").fill(testUser.email);
        await page
            .getByPlaceholder("Enter your password")
            .fill(testUser.password);

        // Submit form
        await page.getByRole("button", { name: "Sign In" }).click();

        // Wait for redirect to dashboard
        await page.waitForURL("**/dashboard", { timeout: 10000 });
        await expect(page).toHaveURL(/.*dashboard/);
    });
});
