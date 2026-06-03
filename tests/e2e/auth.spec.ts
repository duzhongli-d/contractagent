import { test, expect } from '../setup';
import { HomePage } from './pages/HomePage';

test.describe('Authentication Flow', () => {
  test('unauthenticated user is redirected to sign-in when accessing protected route', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto('nb');

    // Try to access protected route directly
    await page.goto('/nb/liveAnalyser');

    // Should redirect to Clerk sign-in
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('homepage loads without authentication', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto('nb');

    // Homepage should load successfully (public route)
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
