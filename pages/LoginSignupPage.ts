import { Page, Locator, expect } from '@playwright/test';

export class LoginSignupPage {

  page: Page;

  signupOrLoginLink: Locator;
  signupNameInput: Locator;
  signupEmailInput: Locator;
  signupButton: Locator;
  enterAccountInfoText: Locator;

  constructor(page: Page) {

    this.page = page;

    // Locators
    this.signupOrLoginLink =
      page.locator('a[href="/login"]');

    this.signupNameInput =
      page.locator('input[data-qa="signup-name"]');

    this.signupEmailInput =
      page.locator('input[data-qa="signup-email"]');

    this.signupButton =
      page.locator('button[data-qa="signup-button"]');

    this.enterAccountInfoText =
      page.getByText(/enter account information/i);
  }

  // Actions
  async navigateToLoginSignupPage() {
    await this.signupOrLoginLink.click();
  }

  async enterSignupDetails(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
  }

  async clickSignupButton() {
    await this.signupButton.click();
  }

  async verifyAccountInfoPageVisible() {
    await expect(this.enterAccountInfoText).toBeVisible();
  }

  async startSignup(name: string, email: string) {
    await this.enterSignupDetails(name, email);
    await this.clickSignupButton();
  }
}