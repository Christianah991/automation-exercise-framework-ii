import { test, expect } from '../fixtures/base';

import { HomePage } from '../pages/HomePage';
import { LoginSignupPage } from '../pages/LoginSignupPage';
import { AccountSetupPage } from '../pages/AccountSetupPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { PaymentPage } from '../pages/PaymentPage';

import { userData } from '../testdata/userData';
import { productData } from '../testdata/productData';
import { paymentData } from '../testdata/paymentData';

test.beforeEach(async ({ page }) => {
  const home = new HomePage(page);
  await home.openHomePage();
});

test('User registration journey', async ({ page }) => {
  const home = new HomePage(page);
  const login = new LoginSignupPage(page);
  const account = new AccountSetupPage(page);
  const user = userData.newUser();

  await home.verifyHomePageVisible();
  await home.goToLogin();

  await login.startSignup(user.name, user.email);
  await account.verifyAccountInfoPageVisible();
  await account.fillBasicInfo(user.password, user.day, user.month, user.year);
  await account.setPreferences();
  await account.fillPersonalDetails(user.firstName, user.lastName);
  await account.fillAddress(user.address, user.country, user.state, user.city, user.zipcode, user.mobile);
  await account.submit();

  await account.verifyAccountCreated();
  await account.continueAfterSignup();
  await account.deleteAccount();
  await account.verifyAccountDeleted();
  await account.continueAfterDeletion();
});

test.only('Place order and download invoice', async ({ page }) => {
  const home = new HomePage(page);
  const login = new LoginSignupPage(page);
  const products = new ProductsPage(page);
  const cart = new CartPage(page);
  const payment = new PaymentPage(page);
  const user = userData.existingUser;

  await home.goToLogin();
  await login.login(user.email, user.password);

  await home.goToProducts();

  await products.openProduct(0);
  await products.setQuantity(4);
  await products.addToCart();
  await products.continueShopping();

  await products.openProductById(5);
  await products.setQuantity(5);
  await products.addToCart();
  await products.continueShopping();

  await home.goToCart();
  await cart.proceedToCheckout();
  await cart.addMessage('Please ring flat');
  await cart.placeOrder();

  await payment.expectOnPaymentPage();
  await payment.fillPayment({
    nameOnCard: paymentData.nameOnCard,
    cardNumber: paymentData.cardNumber,
    cvc: paymentData.cvc,
    expiryMonth: paymentData.expiryMonth,
    expiryYear: paymentData.expiryYear,
  });
  await payment.confirmOrder();

  const download = await payment.downloadInvoice();
  expect(download.suggestedFilename()).toContain('invoice');
});

test('Search products and verify cart after login', async ({ page }) => {
  const home = new HomePage(page);
  const login = new LoginSignupPage(page);
  const products = new ProductsPage(page);
  const cart = new CartPage(page);
  const user = userData.existingUser;

  const addedProducts: string[] = [];

  for (const query of productData.queries) {
    await home.goToProducts();
    await products.search(query);
    await products.verifySearchResults();
    const productName = await products.addFromSearchResults(1);
    addedProducts.push(productName);
  }

  await home.goToCart();
  const before = await cart.getItemsCount();

  await home.goToLogin();
  await login.login(user.email, user.password);

  await home.goToCart();
  const after = await cart.getItemsCount();
  expect(after).toBeGreaterThanOrEqual(before);

  for (const name of addedProducts) {
    await expect(page.getByText(name)).toBeVisible();
  }
});

test('Remove all items from cart', async ({ page }) => {
  const home = new HomePage(page);
  const products = new ProductsPage(page);
  const cart = new CartPage(page);

  await home.goToProducts();
  await products.addFromSearchResults(3);

  await home.goToCart();
  await cart.expectItemsCount(3);
  await cart.removeAllItems();
  await cart.expectItemsCount(0);
});