import { test, expect } from '../setup';
import { BuytokensPage } from './pages/BuytokensPage';

test.describe('Token Purchase Flow', () => {
  test('discount badge shows for 100+ tokens', async ({ page }) => {
    const buytokensPage = new BuytokensPage(page);
    await buytokensPage.goto('nb');

    // Set token count to 100
    await buytokensPage.setTokenCount(100);

    // Discount badge should appear (5% off)
    await expect(buytokensPage.discountBadge).toBeVisible();
    await expect(buytokensPage.discountBadge).toContainText('5%');
  });

  test('10% discount badge shows for 500+ tokens', async ({ page }) => {
    const buytokensPage = new BuytokensPage(page);
    await buytokensPage.goto('nb');

    await buytokensPage.setTokenCount(500);

    await expect(buytokensPage.discountBadge).toContainText('10%');
  });

  test('15% discount badge shows for 1000+ tokens', async ({ page }) => {
    const buytokensPage = new BuytokensPage(page);
    await buytokensPage.goto('nb');

    await buytokensPage.setTokenCount(1000);

    await expect(buytokensPage.discountBadge).toContainText('15%');
  });

  test('checkout button is visible', async ({ page }) => {
    const buytokensPage = new BuytokensPage(page);
    await buytokensPage.goto('nb');

    await expect(buytokensPage.checkoutButton).toBeVisible();
  });
});
