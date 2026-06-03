import { Page, expect } from '@playwright/test';

export class BuytokensPage {
  constructor(private page: Page) {}

  async goto(locale = 'nb') {
    await this.page.goto(`/${locale}/buytokens`);
  }

  get tokenSlider() {
    return this.page.locator('input[type="range"]');
  }

  get checkoutButton() {
    return this.page.getByRole('button', { name: /checkout|stripe/i });
  }

  async setTokenCount(count: number) {
    await this.tokenSlider.fill(String(count));
  }

  get discountBadge() {
    return this.page.locator('[data-testid="discount-badge"]');
  }
}
