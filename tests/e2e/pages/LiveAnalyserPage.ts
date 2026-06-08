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
    // Match Analyze (en), Analyser (nb), or 开始分析 (zh)
    return this.page.getByRole('button', { name: /analys|analyze|开始分析/i });
  }

  get fileNameDisplay() {
    // File name display appears after selecting a file (with FileText icon)
    return this.page.locator('.flex.items-center.space-x-2 span');
  }

  get loadingSpinner() {
    return this.page.locator('.animate-spin');
  }

  get loadingText() {
    return this.page.getByText(/analyzing/i);
  }

  get errorCard() {
    return this.page.getByText(/error/i).first();
  }

  get resultsSection() {
    return this.page.locator('.mt-4.p-4.bg-gray-100');
  }

  get uploadNewButton() {
    // The "disclaimer" toggle button is the closest to "upload new" functionality
    return this.page.locator('button:has-text("disclaimer"), button:has-text("Disclaimer")');
  }

  get disclaimerCheckbox() {
    return this.page.locator('#agree');
  }

  get tokenIndicator() {
    // Token indicator may be in header - make it optional
    return this.page.getByText(/tokens? left/i).first();
  }

  get errorMessage() {
    // Error messages appear in red alert cards
    return this.page.locator('.bg-red-50, [role="alert"]');
  }

  get emptyFileError() {
    return this.page.getByText(/empty| tom | not valid/i).first();
  }

  get invalidTypeError() {
    return this.page.getByText(/pdf|file type|mime/i).first();
  }

  get cancelButton() {
    // Cancel button in disclaimer modal - matches across locales
    return this.page.getByRole('button', { name: /cancel|avbryt|取消/i }).first();
  }

  get homeLink() {
    // Logo or home link in header
    return this.page.locator('a[href*="/"], a:has-text("LegalEdge")').first();
  }

  async acceptDisclaimer() {
    // Click the checkbox label to check it (works across locales)
    await this.page.locator('label[for="agree"]').click();
    // Then click the accept button - match all locale variations
    await this.page.getByRole('button', { name: /godta og fortsett|accept and continue|接受并继续/i }).click();
  }

  async uploadPdf(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }
}
