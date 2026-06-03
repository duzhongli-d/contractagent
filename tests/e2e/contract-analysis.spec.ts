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

  test('user must accept disclaimer before uploading', async ({ page }) => {
    const analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('nb');

    // File input should be disabled until disclaimer accepted
    await expect(analyserPage.fileInput).toBeDisabled();

    // Accept disclaimer
    await analyserPage.acceptDisclaimer();

    // File input should now be enabled
    await expect(analyserPage.fileInput).toBeEnabled();
  });

  test('upload non-PDF file shows error', async ({ page }) => {
    const analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('nb');
    await analyserPage.acceptDisclaimer();

    // Upload a text file instead of PDF
    // Note: This test may pass client-side validation if the app checks file type
    await analyserPage.uploadPdf('tests/e2e/fixtures/sample.txt');

    // Should show error for invalid file type
    await expect(page.getByText(/pdf only|only pdf/i)).toBeVisible({ timeout: 5000 });
  });

  test('pdf upload triggers analysis', async ({ page }) => {
    const analyserPage = new LiveAnalyserPage(page);
    await analyserPage.goto('nb');
    await analyserPage.acceptDisclaimer();

    // Upload a valid PDF (requires tests/e2e/fixtures/sample.pdf to exist)
    await analyserPage.uploadPdf('tests/e2e/fixtures/sample.pdf');

    // Should trigger analysis (analyze button should become active or show loading)
    await expect(analyserPage.analyzeButton.or(page.getByText(/analyzing/i))).toBeVisible({ timeout: 5000 });
  });
});
