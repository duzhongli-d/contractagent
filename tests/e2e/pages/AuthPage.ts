import { Page } from '@playwright/test';

export class AuthPage {
  constructor(private page: Page) {}

  async signIn(email: string, password: string) {
    await this.page.goto('/en/signin');
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByRole('button', { name: /sign in/i }).click();
    await this.page.waitForURL(/\/liveAnalyser/);
  }

  async signUp(email: string, password: string, firstName: string, lastName: string) {
    await this.page.goto('/en/signin');
    // Navigate to register tab if available
    await this.page.getByText(/register|sign up|create account/i).click();
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByLabel(/first name/i).fill(firstName);
    await this.page.getByLabel(/last name/i).fill(lastName);
    await this.page.getByRole('button', { name: /sign up|register/i }).click();
  }
}
