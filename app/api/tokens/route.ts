import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { setUpTokensForFirstTimeUser } from '@/app/actions/tokens';
import { START_TOKENS } from '@/config';

export async function GET() {
	const { userId } = await auth();
	try {
		if (!userId) {
			return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
		}

		const userQuota = await prisma.userQuota.findUnique({
			where: { clerk_user_id: userId },
		});

		if (!userQuota) {
			// User doesn't exist yet - initialize them
			await setUpTokensForFirstTimeUser(userId);
			return NextResponse.json({ tokens: START_TOKENS });
		}

		return NextResponse.json({ tokens: userQuota.document_quota_left });
	} catch (error: any) {
		console.error(`Unexpected token fetch error: ${JSON.stringify(error)}`);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
