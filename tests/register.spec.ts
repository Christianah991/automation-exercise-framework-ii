import { test, expect } from '@playwright/test';

import { LoginSignupPage } from '../pages/LoginSignupPage';
import { AccountSetupPage } from '../pages/AccountSetupPage';

import { signupData } from '../data/signupData';

test('User registration journey', async ({ page }) => {

  test.setTimeout(60000);

  // Create Page Objects
  const loginSignupPage = new LoginSignupPage(page);

  const accountSetupPage = new AccountSetupPage(page);

  // Step 1 - Navigate to website
  await page.goto('https://automationexercise.com/');

  // Step 2 - Verify homepage
  await expect(page).toHaveTitle(/Automation Exercise/);

  // Handle consent popup
  const consentButton =
    page.getByRole('button', { name: /consent|accept/i });

  if (await consentButton.isVisible()) {
    await consentButton.click();
  }

  // Step 3 - Navigate to Signup/Login page
  await loginSignupPage.navigateToLoginSignupPage();

  // Step 4 - Start signup
  await loginSignupPage.startSignup(
    signupData.name,
    signupData.email
  );

  // Step 5 - Verify account info page
  await loginSignupPage.verifyAccountInfoPageVisible();

  // Step 6 - Fill account setup info
  await accountSetupPage.fillBasicInfo(
    signupData.password,
    signupData.day,
    signupData.month,
    signupData.year
  );

  // Step 7 - Preferences
  await accountSetupPage.setPreferences();

  // Step 8 - Personal details
  await accountSetupPage.fillPersonalDetails(
    signupData.firstName,
    signupData.lastName
  );

  // Step 9 - Address details
  await accountSetupPage.fillAddress(
    signupData.address,
    signupData.country,
    signupData.state,
    signupData.city,
    signupData.zipcode,
    signupData.mobile
  );

  // Step 10 - Submit account
  await accountSetupPage.submit();

  // Step 11 - Verify account created
  await expect(
    page.getByText(/account created/i)
  ).toBeVisible();

  // Step 12 - Continue
  await page.locator('.btn.btn-primary').click();

  // Step 13 - Delete account
  await page.getByRole('link', { name: /delete account/i }).click();

  // Step 14 - Verify account deleted
  await expect(
    page.getByText(/account deleted/i)
  ).toBeVisible();

});

test.only('Log in', async ({ page }) => {

  test.setTimeout(60000);
  //step 1/2
  await page.goto('https://automationexercise.com/')

  // Step 3
  await expect(page).toHaveTitle(/Automation Exercise/);

// Consent popup (SAFE)
const consent = page.getByRole('button', { name: /consent|accept/i });
if (await consent.isVisible().catch(() => false)) {
  await consent.click();
}

// Login
await page.click('a[href="/login"]');

await page.locator("[data-qa='login-email']").fill('test401@hotmail.com');
await page.getByRole('textbox', { name: /password/i }).fill('Test123');
await page.getByRole('button', { name: /login/i }).click();

await expect(page.getByText(/logged in as/i)).toBeVisible();

// -----------------------------
// PRODUCT 1
// -----------------------------
await page.getByRole('link', { name: /view product/i }).first().click();

await page.waitForURL(/product_details/);

const qty = page.locator('#quantity');
await expect(qty).toBeVisible();
await qty.fill('2');

const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
await expect(addToCartBtn).toBeVisible();
await addToCartBtn.click();

await expect(page.locator('.modal-title')).toHaveText('Added!');

const continueBtn = page.getByRole('button', { name: /continue shopping/i });
await expect(continueBtn).toBeVisible();
await continueBtn.click();

// -----------------------------
// PRODUCT 2
// -----------------------------
await page.goto('https://automationexercise.com/product_details/5');

await page.waitForURL(/product_details/);

const qty2 = page.locator('#quantity');
await expect(qty2).toBeVisible();
await qty2.fill('1');

const addToCartBtn2 = page.getByRole('button', { name: /add to cart/i });
await expect(addToCartBtn2).toBeVisible();
await addToCartBtn2.click();

await expect(page.locator('.modal-title')).toHaveText('Added!');

await page.getByRole('button', { name: /continue shopping/i }).click();

// -----------------------------
// CART
// -----------------------------
await page.getByRole('link', { name: /cart/i }).click();

await expect(page.getByText(/shopping cart/i)).toBeVisible();

// -----------------------------
// CHECKOUT (FIXED POSITION)
// -----------------------------
await page.getByText(/proceed to checkout/i).click();

await expect(page.getByText(/address details/i)).toBeVisible();

await page.locator('textarea[name="message"]').fill('Please ring flat');

await page.getByRole('link', { name: /place order/i }).click();

// -----------------------------
// PAYMENT
// -----------------------------

await expect(
  page.getByRole('heading', { name: /payment/i })
).toBeVisible();

await page.locator('input[name="name_on_card"]').fill('Missq');
await page.locator('input[name="card_number"]').fill('213342443');

await page.getByRole('textbox', { name: /cvc|ex/i }).fill('54');
await page.getByRole('textbox', { name: /mm/i }).fill('08');
await page.getByRole('textbox', { name: /yyyy/i }).fill('1999');

await page.getByRole('button', { name: /pay and confirm order/i }).click();

  /*
  await page.getByText('Order Placed!').click();
  await page.getByText('Order Placed!').click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download Invoice' }).click();
  const download = await downloadPromise; */
});
  //step 6
  




/* await page.locator('input[data-qa="signup-email"]')
    .fill(`test${Date.now()}@email.com`) */
