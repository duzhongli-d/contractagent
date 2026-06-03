import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto(locale = 'nb') {
    await this.page.goto(`/${locale}`);
  }

  async clickAnalyzeButton() {
    await this.page.getByRole('button', { name: /analyze|analyser/i }).first().click();
  }

  get localeSwitcher() {
    return this.page.locator('[data-testid="locale-switcher"]');
  }
}
