import { Page, Locator } from '@playwright/test';

export class AccountSetupPage {
  page: Page;

  // locators
  mrsRadio: Locator;
  password: Locator;
  days: Locator;
  months: Locator;
  years: Locator;

  newsletter: Locator;
  optin: Locator;

  firstName: Locator;
  lastName: Locator;

  address: Locator;
  country: Locator;
  state: Locator;
  city: Locator;
  zipcode: Locator;
  mobile: Locator;

  createAccountBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.mrsRadio = page.locator('#id_gender2');
    this.password = page.locator('#password');
    this.days = page.locator('#days');
    this.months = page.locator('#months');
    this.years = page.locator('#years');

    this.newsletter = page.getByRole('checkbox', { name: 'Sign up for our newsletter!' });
    this.optin = page.locator('#optin');

    this.firstName = page.locator('#first_name');
    this.lastName = page.locator('#last_name');

    this.address = page.locator('#address1');
    this.country = page.getByLabel('Country *');
    this.state = page.getByRole('textbox', { name: 'State *' });
    this.city = page.getByRole('textbox', { name: 'City' });
    this.zipcode = page.locator('#zipcode');
    this.mobile = page.getByRole('textbox', { name: 'Mobile Number *' });

    this.createAccountBtn = page.getByRole('button', { name: 'Create Account' });
  }

  async fillBasicInfo(password: string, day: string, month: string, year: string) {
    await this.mrsRadio.check();
    await this.password.fill(password);
    await this.days.selectOption(day);
    await this.months.selectOption(month);
    await this.years.selectOption(year);
  }

  async setPreferences() {
    await this.newsletter.check();
    await this.optin.check();
  }

  async fillPersonalDetails(first: string, last: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
  }

  async fillAddress(address: string, country: string, state: string, city: string, zip: string, mobile: string) {
    await this.address.fill(address);
    await this.country.selectOption(country);
    await this.state.fill(state);
    await this.city.fill(city);
    await this.zipcode.fill(zip);
    await this.mobile.fill(mobile);
  }

  async submit() {
    await this.createAccountBtn.click();
  }
}