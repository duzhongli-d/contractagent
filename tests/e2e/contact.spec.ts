import { test, expect } from '../setup';
import { ContactPage } from './pages/ContactPage';

test.describe('Contact Form', () => {
  test('contact form is accessible without auth', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto('nb');

    await expect(contactPage.firstNameInput).toBeVisible();
    await expect(contactPage.lastNameInput).toBeVisible();
    await expect(contactPage.emailInput).toBeVisible();
    await expect(contactPage.messageTextarea).toBeVisible();
    await expect(contactPage.sendButton).toBeVisible();
  });

  test('form validates required fields', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto('nb');

    // Try to send empty form
    await contactPage.sendButton.click();

    // Should show validation errors (browser HTML5 validation)
    await expect(contactPage.firstNameInput).toHaveAttribute('required', '');
    await expect(contactPage.emailInput).toHaveAttribute('required', '');
  });

  test('successful form submission shows success message', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto('nb');

    await contactPage.fillForm({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      message: 'This is a test message',
    });

    await contactPage.sendButton.click();

    // Should show success message
    await expect(page.getByText(/success|sent|i mottatt/i)).toBeVisible({ timeout: 10000 });
  });
});
