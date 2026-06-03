import { test as base, Page } from '@playwright/test';

type MyFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  // Authenticated page fixture - TODO: Implement Clerk authentication fixture
  // Will use Clerk test helpers or cookie injection
  authenticatedPage: async ({ page, baseURL }, use) => {
    // Placeholder: authenticated page fixture
    // Will be implemented after Clerk test setup is configured
    await use(page);
  },
});

export { expect } from '@playwright/test';
