'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { START_TOKENS } from '@/config';

export async function getTokens(clerk_user_id: string) {
    if (!clerk_user_id) {
        return 0;
    }
    const userQuota = await prisma.userQuota.findUnique({
        where: { clerk_user_id },
    });
    if (!userQuota) {
        return START_TOKENS;
    }
    return userQuota.document_quota_left;
}

export async function setUpTokensForFirstTimeUser(clerk_user_id: string) {
    await prisma.userQuota.upsert({
        where: { clerk_user_id },
        update: {},
        create: {
            clerk_user_id,
            document_quota_left: START_TOKENS,
            documents_analysed: 0,
        },
    });
    revalidatePath('/');
}
