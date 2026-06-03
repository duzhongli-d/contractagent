import { Page, expect } from '@playwright/test';

export class BuytokensPage {
  constructor(private page: Page) {}

  async goto(locale = 'nb') {
    await this.page.goto(`/${locale}/buytokens`);
  }

  get tokenSlider() {
    return this.page.locator('[data-slot="slider"]');
  }

  get checkoutButton() {
    return this.page.getByRole('button', { name: /alipay|pay with|使用支付宝|betal med/i });
  }

  get tokenInput() {
    return this.page.locator('input[type="number"]').first();
  }

  async setTokenCount(count: number) {
    // Use the number input field
    await this.tokenInput.fill(String(count));
    await this.tokenInput.blur();
  }

  async clickPresetAmount(amount: number) {
    await this.page.getByRole('button', { name: String(amount), exact: true }).click();
  }

  get discountBadge() {
    return this.page.locator('[data-testid="discount-badge"]');
  }
}
