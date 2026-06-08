import { test, expect } from '../setup';
import { BuytokensPage } from './pages/BuytokensPage';

test.describe('Token Purchase Flow', () => {
  test('checkout button is visible', async ({ authenticatedPage: page }) => {
    const buytokensPage = new BuytokensPage(page);
    await buytokensPage.goto('nb');

    await expect(buytokensPage.checkoutButton).toBeVisible();
  });

  test('discount shown for 100+ tokens', async ({ authenticatedPage: page }) => {
    const buytokensPage = new BuytokensPage(page);
    await buytokensPage.goto('nb');

    // Click preset amount 100
    await buytokensPage.clickPresetAmount(100);
    await page.waitForTimeout(300);

    // Order summary shows "Volumrabatt (5%)"
    await expect(page.getByText(/Volumrabatt \(5%\)/)).toBeVisible();
  });

  test('10% discount shown for 500+ tokens', async ({ authenticatedPage: page }) => {
    const buytokensPage = new BuytokensPage(page);
    await buytokensPage.goto('nb');

    await buytokensPage.clickPresetAmount(500);
    await page.waitForTimeout(300);

    await expect(page.getByText(/Volumrabatt \(10%\)/)).toBeVisible();
  });

  test('15% discount shown for 1000+ tokens', async ({ authenticatedPage: page }) => {
    const buytokensPage = new BuytokensPage(page);
    await buytokensPage.goto('nb');

    await buytokensPage.clickPresetAmount(1000);
    await page.waitForTimeout(300);

    await expect(page.getByText(/Volumrabatt \(15%\)/)).toBeVisible();
  });
});
