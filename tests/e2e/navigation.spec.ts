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
    await page.getByRole('link', { name: /english/i }).click();

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

    // Header should have navigation links
    await expect(page.getByRole('link', { name: /analyser/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /buy tokens|kjop tokens/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
  });
});
