import { prisma } from '@/lib/db';

export async function addTokens(clerk_user_id: string, tokensToAdd: number) {
    if (!clerk_user_id) {
        throw new Error('User ID is required');
    }

    const userQuota = await prisma.userQuota.findUnique({
        where: { clerk_user_id },
    });

    if (!userQuota) {
        throw new Error('User quota not found');
    }

    await prisma.userQuota.update({
        where: { clerk_user_id },
        data: {
            document_quota_left: { increment: tokensToAdd },
        },
    });
}
