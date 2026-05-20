import { Page } from '@playwright/test'

export class HomePage {

  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('https://automationexercise.com/')
  }

  async clickSignupLogin() {
    await this.page.click('a[href="/login"]')
  }
}