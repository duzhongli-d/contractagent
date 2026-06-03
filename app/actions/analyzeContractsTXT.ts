'use server';

import { writeFile, readFile, unlink } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import pdfParse from 'pdf-parse';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';
import { TOKENS_PER_QUERY } from '@/config';
import PostHogClient from '@/posthog';
import { openai } from '@/openai';

// Constants for file validation
const ALLOWED_FILE_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Doing this because pdf-parse is not maintained and the types are not up to date
interface ExtractTextFromPDF {
    (filePath: string): Promise<string>;
}

// Take the interface from the pdf-parse and append pageData to the Result interface
interface extendedResult extends pdfParse.Result {
    pageData: PageData[];
}

const extractTextFromPDF: ExtractTextFromPDF = async (filePath: string): Promise<string> => {
    try {
        const dataBuffer = await readFile(filePath);
        const pdfData = await pdfParse(dataBuffer) as extendedResult;
        const joinedPageData = pdfData.pageData.join('\n');
        return joinedPageData;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to extract text from PDF: ${error.message}`);
        } else {
            throw new Error('Failed to extract text from PDF: Unknown error');
        }
    }
};


export async function analyzeTXTContract(formData:FormData) {

    // check if the user has any document_quota_left before proceeding, needs to check in the database based on the users clerk id
    // if the user has no document_quota_left, return an error message to the user and redirect them to the payment page
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
        return { error: 'User ID is missing' };
    }

    const userQuota = await prisma.userQuota.findUnique({
        where: { clerk_user_id: userId },
    });
    if (!userQuota) {
        return { data: null, error: 'User quota not found.' };
    }
    if (userQuota.document_quota_left === 0) {
        return { data: null, error: 'Du er tom for tokens, for å analysere flere dokumenter må du kjøpe flere.' };
    }

    const file = formData.get('contract') as File | null;

    if (!file) {
        return { error: 'Please upload a valid file.' };
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return { error: 'Only PDF files are allowed.' };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
        return { error: 'File size exceeds 5MB limit.' };
    }

    // Validate file is not empty
    if (file.size === 0) {
        return { error: 'File is empty.' };
    }

    // save file temporarily
    const filePath = path.join('/tmp', `${randomUUID()}-${file.name}`);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);

    const fileAsText = await extractTextFromPDF(filePath);

    try {
        const thread = await openai.beta.threads.create({
            messages: [
                {
                    role: 'user',
                    content: 'Please analyse this contract.',
                },
                {
                    role: 'user',
                    content: fileAsText,
                }
            ]
        });

        if (!process.env.OPENAI_ASSISTANT_ID) {
            throw new Error('OPENAI_ASSISTANT_ID is not defined');
        }
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: process.env.OPENAI_ASSISTANT_ID,
        });

        // Poll for completion with timeout and max retries
        const MAX_RETRIES = 30;
        const INITIAL_DELAY = 2000;
        const MAX_DELAY = 10000;
        const BACKOFF_MULTIPLIER = 1.5;
        let retries = 0;
        let runStatus;

        do {
            if (retries >= MAX_RETRIES) {
                throw new Error('Analysis timeout after ' + MAX_RETRIES + ' attempts');
            }

            await new Promise((resolve) => setTimeout(resolve, Math.min(INITIAL_DELAY * Math.pow(BACKOFF_MULTIPLIER, retries), MAX_DELAY)));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

            if (runStatus.status === 'failed') {
                throw new Error('Analysis failed: ' + (runStatus.last_error?.message || 'Unknown error'));
            }

            retries++;
        } while (runStatus.status !== 'completed');

        const messages = await openai.beta.threads.messages.list(thread.id);

        const responseObj = messages.data.filter((msg: any) => msg.role === 'assistant');

        // We need to update the user's document_quota_left in the database as well as increment documents_analysed field
        const updatedUserQueryObj = await prisma.userQuota.update({
            where: { clerk_user_id: userId },
            data: {
                document_quota_left: { decrement: TOKENS_PER_QUERY },
                documents_analysed: { increment: 1 },
            },
        });

        // Verify the update was successful
        if (!updatedUserQueryObj || updatedUserQueryObj.document_quota_left < 0) {
            throw new Error('Failed to update user quota. Please try again.');
        }

        console.log(`Updated user query object:`, updatedUserQueryObj);

        const posthog = PostHogClient();
        posthog.capture({
            distinctId: userId as string,
            event: 'Document Analyzed',
            properties: {
                document_type: 'contract',
                document_name: file.name,
            },
        });
        await posthog.shutdown();

        revalidatePath('/');

        return { data: responseObj[0], error: null };

    }
    catch (error) {
        // Log full error for debugging
        console.error('Contract analysis error:', error);

        // Sanitize error message for client
        let errorMessage = 'An error occurred during analysis. Please try again.';
        if (error instanceof Error) {
            // Don't expose internal error details to client
            if (error.message.includes('OPENAI_ASSISTANT_ID')) {
                errorMessage = 'Server configuration error. Please contact support.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Analysis timeout. Please try again with a smaller document.';
            } else if (error.message.includes('Failed to extract text')) {
                errorMessage = 'Could not read PDF file. Please ensure the file is not corrupted.';
            }
        }

        return { data: null, error: errorMessage };
    } finally {
        // Properly cleanup temporary file
        try {
            await unlink(filePath);
        } catch (err) {
            console.error('Failed to delete temp file:', err);
        }
    }
}

type PageData = string;
