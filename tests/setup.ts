import { test as base, Page } from '@playwright/test';

type MyFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  // Auth.js authenticated page fixture
  // Signs in via the Test User sandbox provider for E2E testing
  authenticatedPage: async ({ page, baseURL }, use) => {
    // Navigate to signin page (sandbox providers visible when NEXT_PUBLIC_AUTH_SANDBOX=true)
    await page.goto('/en/signin');

    // Click the "Test User" button in the sandbox section
    await page.getByRole('button', { name: /test user/i }).click();

    // Wait for redirect to liveAnalyser
    await page.waitForURL(/\/liveAnalyser/, { timeout: 10000 });

    await use(page);
  },
});

export { expect } from '@playwright/test';
