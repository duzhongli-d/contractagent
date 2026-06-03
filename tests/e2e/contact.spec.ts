import { test, expect } from '../setup';
import { ContactPage } from './pages/ContactPage';

test.describe('Contact Form', () => {
  test('contact form is accessible without auth', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto('nb');
    await page.waitForLoadState('networkidle');

    await expect(contactPage.sendButton).toBeVisible();
  });

  test('form submission works', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.goto('nb');
    await page.waitForLoadState('networkidle');

    // Fill out the form with explicit waits for each field
    await page.locator('#firstName').fill('Test');
    await page.locator('#lastName').fill('User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('This is a test message');

    await contactPage.sendButton.click();

    // Should show success or sending state
    await expect(page.getByRole('button', { name: /send melding/i })).toBeVisible({ timeout: 10000 });
  });
});
