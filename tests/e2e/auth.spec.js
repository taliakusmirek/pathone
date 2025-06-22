const { test, expect } = require("@playwright/test");

// Test data
const testUser = {
    firstName: "Test",
    lastName: "User",
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
        await page
            .getByPlaceholder("Enter your first name")
            .fill(testUser.firstName);
        await page
            .getByPlaceholder("Enter your last name")
            .fill(testUser.lastName);
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

        // Check if user name is displayed in welcome message
        await expect(
            page.getByText(
                `Welcome back, ${testUser.firstName} ${testUser.lastName}!`
            )
        ).toBeVisible();
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

    test("should display user name in dashboard and pre-populate eligibility form", async ({
        page,
    }) => {
        // Login first
        await page.getByPlaceholder("Enter your email").fill(testUser.email);
        await page
            .getByPlaceholder("Enter your password")
            .fill(testUser.password);

        // Submit form
        await page.getByRole("button", { name: "Sign In" }).click();

        // Wait for redirect to dashboard
        await page.waitForURL("**/dashboard", { timeout: 10000 });

        // Check if user name is displayed in welcome message
        await expect(
            page.getByText(
                `Welcome back, ${testUser.firstName} ${testUser.lastName}!`
            )
        ).toBeVisible();

        // Navigate to eligibility form
        await page.getByRole("button", { name: "Start Assessment" }).click();

        // Check if form is pre-populated with user data
        const nameField = page.getByPlaceholder("Enter your full name");
        const emailField = page.getByPlaceholder("Enter your email address");

        await expect(nameField).toHaveValue(
            `${testUser.firstName} ${testUser.lastName}`
        );
        await expect(emailField).toHaveValue(testUser.email);
    });

    test("should validate required fields and prevent progression", async ({
        page,
    }) => {
        // Login first
        await page.getByPlaceholder("Enter your email").fill(testUser.email);
        await page
            .getByPlaceholder("Enter your password")
            .fill(testUser.password);
        await page.getByRole("button", { name: "Sign In" }).click();
        await page.waitForURL("**/dashboard", { timeout: 10000 });

        // Navigate to eligibility form
        await page.getByRole("button", { name: "Start Assessment" }).click();

        // Clear pre-populated fields to test validation
        await page.getByPlaceholder("Enter your full name").fill("");
        await page.getByPlaceholder("Enter your country of origin").fill("");

        // Try to proceed to next step
        await page.getByRole("button", { name: "Next" }).click();

        // Check if validation errors are displayed
        await expect(page.getByText("Full name is required")).toBeVisible();
        await expect(
            page.getByText("Country of origin is required")
        ).toBeVisible();

        // Check if Next button is disabled
        await expect(page.getByRole("button", { name: "Next" })).toBeDisabled();

        // Fill required fields
        await page.getByPlaceholder("Enter your full name").fill("Test User");
        await page
            .getByPlaceholder("Enter your country of origin")
            .fill("South Korea");
        await page.getByPlaceholder("Enter your age").fill("30");

        // Now Next button should be enabled
        await expect(page.getByRole("button", { name: "Next" })).toBeEnabled();

        // Should be able to proceed to step 2
        await page.getByRole("button", { name: "Next" }).click();
        await expect(page.getByText("Step 2 of 7: Education")).toBeVisible();
    });

    test("should track application status progress after form submission", async ({
        page,
    }) => {
        // Sign up a new user for this test
        const uniqueEmail = `status-test-${Date.now()}@example.com`;

        await page.getByRole("button", { name: "Sign up here" }).click();
        await page.getByPlaceholder("Enter your first name").fill("Status");
        await page.getByPlaceholder("Enter your last name").fill("Test");
        await page.getByPlaceholder("Enter your email").fill(uniqueEmail);
        await page.getByPlaceholder("Create a password").fill("Password123!");
        await page
            .getByPlaceholder("Confirm your password")
            .fill("Password123!");
        await page.getByRole("button", { name: "Create Account" }).click();

        // Wait for redirect to dashboard
        await page.waitForURL("**/dashboard", { timeout: 10000 });

        // Check initial status - should show 0/5 completed
        await expect(page.getByText("0/5")).toBeVisible();
        await expect(page.getByText("0%")).toBeVisible();

        // Navigate to eligibility tab
        await page.getByRole("button", { name: "Eligibility" }).click();

        // Complete the eligibility form quickly
        await page.getByPlaceholder("Enter your full name").fill("Status Test");
        await page
            .getByPlaceholder("Enter your email address")
            .fill(uniqueEmail);
        await page
            .getByPlaceholder("Enter your country of origin")
            .fill("Canada");
        await page.getByPlaceholder("Enter your age").fill("28");
        await page.getByRole("button", { name: "Next" }).click();

        // Step 2 - Education
        await page.selectOption("select", "masters");
        await page.getByRole("button", { name: "Next" }).click();

        // Step 3 - Startup achievements
        await page.locator("select").first().selectOption("50k-500k");
        await page.locator("select").nth(1).selectOption("1000-10000");
        await page.getByRole("button", { name: "Next" }).click();

        // Continue through remaining steps quickly
        await page.getByRole("button", { name: "Next" }).click(); // Step 4
        await page.getByRole("button", { name: "Next" }).click(); // Step 5
        await page.getByRole("button", { name: "Next" }).click(); // Step 6

        // Submit form
        await page
            .getByRole("button", { name: "Submit & Check Eligibility" })
            .click();

        // Wait for result page
        await page.waitForURL("**/result", { timeout: 15000 });

        // Navigate back to dashboard
        await page.goto("http://localhost:3000/dashboard");

        // Status should now show eligibility as completed (1/5, 20%)
        await page.waitForTimeout(2000); // Allow time for status to update
        await expect(page.getByText("1/5")).toBeVisible();
        await expect(page.getByText("20%")).toBeVisible();

        // Check that eligibility step shows as completed
        await expect(page.getByText("Eligibility Assessment")).toBeVisible();
    });
});
