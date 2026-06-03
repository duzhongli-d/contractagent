import { test, expect } from '../setup';
import { LiveAnalyserPage } from './pages/LiveAnalyserPage';

// Note: A real PDF fixture file is needed for full upload testing.
// Place sample.pdf at tests/e2e/fixtures/sample.pdf for upload tests to pass.
// For now, tests focus on UI gating behavior (disclaimer modal, file input state).
test.describe('Contract Analysis Flow', () => {
  test('disclaimer modal appears before upload', async ({ page }) => {
    const analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('nb');

    // Disclaimer should be visible
    await expect(analyserPage.disclaimerModal).toBeVisible();
  });

  test('user can accept disclaimer', async ({ page }) => {
    const analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('nb');

    // Modal should be visible
    await expect(analyserPage.disclaimerModal).toBeVisible();

    // Accept disclaimer
    await analyserPage.acceptDisclaimer();

    // Modal should close (no longer visible)
    await expect(analyserPage.disclaimerModal).not.toBeVisible();
  });

  test('file input is present after accepting disclaimer', async ({ page }) => {
    const analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('nb');

    // Accept disclaimer
    await analyserPage.acceptDisclaimer();

    // File input should be present and visible (it's styled as a custom upload area)
    await expect(analyserPage.fileInput).toBeAttached();
  });
});
