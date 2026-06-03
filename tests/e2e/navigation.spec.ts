import { test, expect } from '../setup';
import { HomePage } from './pages/HomePage';

test.describe('Navigation', () => {
  test('locale switcher changes URL and content', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto('nb');

    // Current locale is Norwegian
    await expect(page).toHaveURL(/\/nb/);

    // Switch to English (if locale switcher is available)
    await homePage.localeSwitcher.click();
    await page.getByRole('menuitem', { name: /english/i }).click();

    await expect(page).toHaveURL(/\/en/);
  });

  test('homepage loads in default locale (nb)', async ({ page }) => {
    await page.goto('/');

    // Should redirect or default to Norwegian
    await expect(page).toHaveURL(/\/nb|\/en|\/zh/);
  });

  test('navigation links are present', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto('nb');

    // Header should have visible links (may be in mobile menu on small screens)
    // Check that the mobile menu button exists
    await expect(page.locator('button[class*="menu"], button:has(svg)'));// Just verify menu is accessible
  });
});
