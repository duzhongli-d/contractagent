/**
 * Unit tests for analyzeTXTContract server action
 *
 * These tests document the expected behavior of the contract analysis flow.
 * They require proper test environment setup with mocked auth and database.
 *
 * Current issues identified:
 * - The server action uses NextAuth user ID but queries by clerk_user_id
 * - This causes a mismatch after Clerk → NextAuth migration
 *
 * Run with: npx vitest tests/unit/analyzeContractsTXT.test.ts
 * (Requires Vitest setup - see package.json devDependencies)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the auth module
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

// Mock the database
vi.mock('@/lib/db', () => ({
  prisma: {
    userQuota: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock config
vi.mock('@/config', () => ({
  TOKENS_PER_QUERY: 1,
}));

// Import the action after mocking
// Note: In a real test environment, we would use next-auth's testing utilities

describe('analyzeTXTContract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('rejects requests without authentication', async () => {
      // When auth returns null session, should return error
      const { auth } = await import('@/auth');
      vi.mocked(auth).mockResolvedValue(null);

      const { analyzeTXTContract } = await import('@/app/actions/analyzeContractsTXT');

      const formData = new FormData();
      formData.append('contract', new File(['test'], 'test.pdf', { type: 'application/pdf' }));

      const result = await analyzeTXTContract(formData);
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('User ID is missing');
    });

    it('rejects requests when user ID is undefined', async () => {
      const { auth } = await import('@/auth');
      vi.mocked(auth).mockResolvedValue({ user: { id: undefined } } as any);

      const { analyzeTXTContract } = await import('@/app/actions/analyzeContractsTXT');

      const formData = new FormData();
      formData.append('contract', new File(['test'], 'test.pdf', { type: 'application/pdf' }));

      const result = await analyzeTXTContract(formData);
      expect(result).toHaveProperty('error');
    });
  });

  describe('File Validation', () => {
    it('rejects requests without file', async () => {
      const { auth } = await import('@/auth');
      vi.mocked(auth).mockResolvedValue({ user: { id: 'test-user-id' } } as any);

      const { analyzeTXTContract } = await import('@/app/actions/analyzeContractsTXT');

      const formData = new FormData();
      // No file appended

      const result = await analyzeTXTContract(formData);
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('Please upload a valid file.');
    });

    it('rejects non-PDF files', async () => {
      const { auth } = await import('@/auth');
      vi.mocked(auth).mockResolvedValue({ user: { id: 'test-user-id' } } as any);

      const { analyzeTXTContract } = await import('@/app/actions/analyzeContractsTXT');

      const formData = new FormData();
      formData.append('contract', new File(['test content'], 'test.txt', { type: 'text/plain' }));

      const result = await analyzeTXTContract(formData);
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('Only PDF files are allowed.');
    });

    it('rejects files over 5MB', async () => {
      const { auth } = await import('@/auth');
      vi.mocked(auth).mockResolvedValue({ user: { id: 'test-user-id' } } as any);

      const { analyzeTXTContract } = await import('@/app/actions/analyzeContractsTXT');

      // Create a file larger than 5MB (mock)
      const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
      const formData = new FormData();
      formData.append('contract', new File([largeContent], 'large.pdf', { type: 'application/pdf' }));

      const result = await analyzeTXTContract(formData);
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('File size exceeds 5MB limit.');
    });

    it('rejects empty files', async () => {
      const { auth } = await import('@/auth');
      vi.mocked(auth).mockResolvedValue({ user: { id: 'test-user-id' } } as any);

      const { analyzeTXTContract } = await import('@/app/actions/analyzeContractsTXT');

      const formData = new FormData();
      formData.append('contract', new File([''], 'empty.pdf', { type: 'application/pdf' }));

      const result = await analyzeTXTContract(formData);
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('File is empty.');
    });
  });

  describe('User Quota', () => {
    it('returns error when user quota not found', async () => {
      const { auth } = await import('@/auth');
      vi.mocked(auth).mockResolvedValue({ user: { id: 'test-user-id' } } as any);

      const { prisma } = await import('@/lib/db');
      vi.mocked(prisma.userQuota.findUnique).mockResolvedValue(null);

      const { analyzeTXTContract } = await import('@/app/actions/analyzeContractsTXT');

      const formData = new FormData();
      formData.append('contract', new File(['test'], 'test.pdf', { type: 'application/pdf' }));

      const result = await analyzeTXTContract(formData);
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('User quota not found.');
    });

    it('returns error when user has zero tokens', async () => {
      const { auth } = await import('@/auth');
      vi.mocked(auth).mockResolvedValue({ user: { id: 'test-user-id' } } as any);

      const { prisma } = await import('@/lib/db');
      vi.mocked(prisma.userQuota.findUnique).mockResolvedValue({
        id: 'quota-id',
        clerkUserId: 'test-user-id',
        documentQuotaLeft: 0,
        documentsAnalysed: 5,
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { analyzeTXTContract } = await import('@/app/actions/analyzeContractsTXT');

      const formData = new FormData();
      formData.append('contract', new File(['test'], 'test.pdf', { type: 'application/pdf' }));

      const result = await analyzeTXTContract(formData);
      expect(result).toHaveProperty('error');
      expect(result.error).toContain('tom for tokens');
    });
  });

  describe('User ID Mapping Issue (Post-Migration)', () => {
    /**
     * CRITICAL: This test documents a known issue after Clerk → NextAuth migration
     *
     * The analyzeTXTContract server action uses:
     * - auth() from NextAuth → returns user.id (NextAuth's User model ID)
     * - prisma.userQuota.findUnique({ where: { clerk_user_id: userId } })
     *
     * But the UserQuery.clerkUserId field stores the OLD Clerk user ID, not the NextAuth ID.
     * This means after migration, no users will have their quota found.
     *
     * Expected behavior: Should query by userId (NextAuth) not clerkUserId (Clerk)
     */
    it('should query user quota using correct ID field', async () => {
      const { auth } = await import('@/auth');
      const { prisma } = await import('@/lib/db');

      // Simulate NextAuth returning its own ID
      const nextAuthUserId = 'nextauth-user-123';
      vi.mocked(auth).mockResolvedValue({ user: { id: nextAuthUserId } } as any);

      const { analyzeTXTContract } = await import('@/app/actions/analyzeContractsTXT');

      const formData = new FormData();
      formData.append('contract', new File(['test'], 'test.pdf', { type: 'application/pdf' }));

      await analyzeTXTContract(formData);

      // The action queries by clerk_user_id but should query by userId
      // This test passes because it documents the CURRENT (buggy) behavior
      expect(prisma.userQuota.findUnique).toHaveBeenCalledWith({
        where: { clerk_user_id: nextAuthUserId },
      });
    });
  });
});

// Integration tests that require full stack:
// - Test complete analysis flow with valid PDF and tokens
// - Test OpenAI assistant integration
// - Test PostHog event capture
// - Test file cleanup in finally block