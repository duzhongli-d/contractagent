import { Page } from '@playwright/test';

export class ContactPage {
  constructor(private page: Page) {}

  async goto(locale = 'nb') {
    await this.page.goto(`/${locale}/contact`);
  }

  get firstNameInput() {
    return this.page.getByLabel(/first name/i);
  }

  get lastNameInput() {
    return this.page.getByLabel(/last name/i);
  }

  get emailInput() {
    return this.page.getByLabel(/email/i);
  }

  get messageTextarea() {
    return this.page.getByLabel(/message/i);
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
