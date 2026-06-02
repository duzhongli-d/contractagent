import { NextResponse, NextRequest } from 'next/server';
import { createAdminClient } from '@/appwrite/config';
import { auth } from '@clerk/nextjs/server';
import { setUpTokensForFirstTimeUser } from '@/app/actions/tokens';
import { START_TOKENS } from '@/config';
import { Query } from 'node-appwrite';

const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string;

// This is for fetching the users document_quota_left from the appwrite database. It needs to validate the user first.
export async function GET() {
	const { userId } = await auth();
	try {
		if (!userId) {
			return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
		}

		const { databases } = await createAdminClient();
		const result = await databases.getDocument(dbId, collectionId, userId, [
			Query.select(['document_quota_left', '$id']),
		]);
		return NextResponse.json({ tokens: result.document_quota_left });
	} catch (error: any) {
		// ✅ Handle expected 404 case first
		if (error.code === 404 && error.type === 'document_not_found') {
			try {
				if (!userId) {
					throw new Error('User ID is missing');
				}
				await setUpTokensForFirstTimeUser(userId);
				return NextResponse.json({ tokens: START_TOKENS });
			} catch (setupError) {
				console.error('Failed to initialize user token doc:', setupError);
				return NextResponse.json({ error: 'Failed to set up tokens' }, { status: 500 });
			}
		}

		// ❌ Unexpected error
		console.error(`Unexpected token fetch error: ${JSON.stringify(error)}`);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
