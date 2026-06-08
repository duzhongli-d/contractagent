import { test, expect } from '../setup';
import { LiveAnalyserPage } from './pages/LiveAnalyserPage';

test.describe('LiveAnalyser Locale Switching', () => {
  test('liveAnalyser page loads in en locale', async ({ authenticatedPage: page }) => {
    const analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('en');
    // File input should be present
    await expect(analyserPage.fileInput).toBeAttached();
    // Disclaimer modal should appear (auth-protected page)
    await expect(analyserPage.disclaimerModal).toBeVisible();
  });

  test('liveAnalyser page loads in zh locale', async ({ authenticatedPage: page }) => {
    const analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('zh');
    // File input should be present
    await expect(analyserPage.fileInput).toBeAttached();
    // Disclaimer modal should appear (auth-protected page)
    await expect(analyserPage.disclaimerModal).toBeVisible();
  });

  test('liveAnalyser page loads in nb locale', async ({ authenticatedPage: page }) => {
    const analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('nb');
    // File input should be present
    await expect(analyserPage.fileInput).toBeAttached();
    // Disclaimer modal should appear (auth-protected page)
    await expect(analyserPage.disclaimerModal).toBeVisible();
  });

  test('analyze button text changes per locale', async ({ authenticatedPage: page }) => {
    // Test English locale button text
    let analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('en');
    await analyserPage.acceptDisclaimer();
    await expect(analyserPage.analyzeButton).toContainText(/analyze/i);

    // Test Norwegian locale button text
    analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('nb');
    await analyserPage.acceptDisclaimer();
    await expect(analyserPage.analyzeButton).toContainText(/analys/i);

    // Test Chinese locale button text
    analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('zh');
    await analyserPage.acceptDisclaimer();
    await expect(analyserPage.analyzeButton).toContainText(/分析/i);
  });
});