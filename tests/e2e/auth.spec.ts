import { test, expect } from '../setup';
import { HomePage } from './pages/HomePage';

test.describe('Authentication Flow', () => {
  // Note: This test may fail if the middleware doesn't properly protect locale-based routes
  // The middleware config matches "/liveAnalyser/:path*" but app uses "/[locale]/liveAnalyser"
  test('homepage loads without authentication', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto('nb');

    // Homepage should load successfully (public route)
    await expect(page.getByRole('heading', { name: /AI-drevet juridisk kontraktsanalyse: Raskere\. Smartere\. Mer pålitelig\./i })).toBeVisible();
  });
});
