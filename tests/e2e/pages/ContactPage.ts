import { Page } from '@playwright/test';

export class ContactPage {
  constructor(private page: Page) {}

  async goto(locale = 'nb') {
    await this.page.goto(`/${locale}/contact`);
  }

  get firstNameInput() {
    return this.page.locator('#firstName');
  }

  get lastNameInput() {
    return this.page.locator('#lastName');
  }

  get emailInput() {
    return this.page.locator('#email');
  }

  get messageTextarea() {
    return this.page.locator('#message');
  }

  get sendButton() {
    return this.page.getByRole('button', { name: /send/i });
  }

  async fillForm(data: { firstName: string; lastName: string; email: string; message: string }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.messageTextarea.fill(data.message);
  }
}
