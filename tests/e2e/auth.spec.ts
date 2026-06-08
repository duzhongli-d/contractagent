import { test, expect } from '../setup';
import { HomePage } from './pages/HomePage';
import { LiveAnalyserPage } from './pages/LiveAnalyserPage';

test.describe('Authentication Flow', () => {
  test('homepage loads without authentication', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto('nb');

    // Homepage should load successfully (public route)
    await expect(page.getByRole('heading', { name: /AI-drevet juridisk kontraktsanalyse: Raskere\. Smartere\. Mer pålitelig\./i })).toBeVisible();
  });

  test('unauthenticated user redirected to sign-in for liveAnalyser', async ({ page }) => {
    await page.goto('/nb/liveAnalyser');
    // Should redirect to sign-in page
    await expect(page).toHaveURL(/\/en\/signin/);
  });

  test('unauthenticated user redirected with callbackUrl preserved', async ({ page }) => {
    await page.goto('/nb/liveAnalyser');
    // URL should contain callbackUrl parameter with original path
    await expect(page.url()).toContain('callbackUrl=');
    // The callbackUrl should contain the original pathname
    const callbackUrl = new URL(page.url()).searchParams.get('callbackUrl');
    expect(callbackUrl).toContain('/nb/liveAnalyser');
  });

  test('unauthenticated user redirected for buytokens route', async ({ page }) => {
    await page.goto('/nb/buytokens');
    // Should redirect to sign-in page
    await expect(page).toHaveURL(/\/en\/signin/);
  });
});
