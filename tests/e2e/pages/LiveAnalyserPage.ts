import { Page, Locator } from '@playwright/test';

export class LiveAnalyserPage {
  constructor(private page: Page) {}

  async goto(locale = 'nb') {
    await this.page.goto(`/${locale}/liveAnalyser`);
  }

  get disclaimerModal() {
    return this.page.locator('[data-testid="disclaimer-modal"]');
  }

  get fileInput() {
    return this.page.locator('input[type="file"]');
  }

  get analyzeButton() {
    return this.page.getByRole('button', { name: /analyze/i });
  }

  async acceptDisclaimer() {
    await this.page.getByRole('button', { name: /accept|i agree/i }).click();
  }

  async uploadPdf(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }
}
