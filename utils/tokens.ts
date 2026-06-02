import { createAdminClient } from "@/appwrite/config";
import { Query } from "node-appwrite";

const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string;

export async function addTokens(clerk_user_id: string, tokensToAdd: number) {
    if (!clerk_user_id) {
        throw new Error('User ID is required');
    }
    const { databases } = await createAdminClient();

    const userQuota = await databases.listDocuments(dbId, collectionId, [
        Query.equal('clerk_user_id', clerk_user_id),
    ]);

    if (userQuota.documents.length === 0) {
        throw new Error('User quota not found');
    }

    const currentDoc = userQuota.documents[0];
    await databases.updateDocument(dbId, collectionId, currentDoc.$id, {
        document_quota_left: currentDoc.document_quota_left + tokensToAdd,
    });
}