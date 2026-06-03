import { test as base, Page } from '@playwright/test';

type MyFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  // Auth.js authenticated page fixture
  // Signs in via the /en/signin page
  authenticatedPage: async ({ page, baseURL }, use) => {
    const signIn = async (email: string, password: string) => {
      await page.goto('/en/signin');
      await page.getByLabel(/email/i).fill(email);
      await page.getByLabel(/password/i).fill(password);
      await page.getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/liveAnalyser/);
    };

    // Store the signIn function on the page for use in tests
    (page as any).authSignIn = signIn;
    await use(page);
  },
});

export { expect } from '@playwright/test';
