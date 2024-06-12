import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/";

test("should allow user to register", async({ page }) => {
  const testEmail = `test_register_${Math.floor(Math.random() * 90000) + 10000}@test.com`
  await page.goto(UI_URL);


  // Click on the Sign In link
  await page.getByRole("link", { name: "Sign In" }).click();
  
  
  // Click on the Create an Account link
  await page.getByRole("link", { name: "Create an account here" }).click();
  
  // Ensure the Create an Account page is displayed
  await expect(page.getByRole("heading", { name: "Create an Account" })).toBeVisible();

  // Fill in the registration form fields
  await page.locator("[name=name]").fill("test_name");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("123456");
  await page.locator("[name=confirmPassword]").fill("123456");

  // Click the Create Account button
  await page.getByRole("button", { name: "Create Account" }).click();

  // Wait for the registration success message
  await expect(page.getByText("Registered Successfully")).toBeVisible();

  // Check for the presence of post-registration UI elements
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
