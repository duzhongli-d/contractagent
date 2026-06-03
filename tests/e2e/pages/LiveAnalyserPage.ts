import { Page, Locator } from '@playwright/test';

export class LiveAnalyserPage {
  constructor(private page: Page) {}

  async goto(locale = 'nb') {
    await this.page.goto(`/${locale}/liveAnalyser`);
  }

  get disclaimerModal() {
    return this.page.locator('[role="dialog"]');
  }

  get fileInput() {
    return this.page.locator('input[type="file"]');
  }

  get analyzeButton() {
    return this.page.getByRole('button', { name: /analyze/i });
  }

  async acceptDisclaimer() {
    // Click the checkbox label to check it (works across locales)
    await this.page.locator('label[for="agree"]').click();
    // Then click the accept button
    await this.page.getByRole('button', { name: /godta og fortsett|accept and continue|accept/i }).click();
  }

  async uploadPdf(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }
}
