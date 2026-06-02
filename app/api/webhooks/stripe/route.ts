import { NextResponse, NextRequest } from "next/server";
import type { Stripe } from 'stripe';
import { headers } from "next/headers";
import { stripe } from '@/lib/stripe';
import { addTokens } from '@/utils/tokens';
import PostHogClient from '@/posthog';

type ConstructedEvent = {
    id: string;
    object: string;
    api_version: string;
    created: number;
    data: {
        object: any;
    };
    livemode: boolean;
    pending_webhooks: number;
    request: { id: null; idempotency_key: null };
    type: string;
};

export async function POST(req: NextRequest) {
    console.log(`Webhook received in /webhooks/stripe`);
	const body = await req.text();
	const sig = (await headers()).get('Stripe-Signature') as string;
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    try {
        const event = stripe.webhooks.constructEvent(body, sig, webhookSecret) as ConstructedEvent;
        const data = event.data.object;
        const amountPaid = data.amount_total / 100;
        const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve( data.id,
			{
				expand: ['line_items', 'payment_intent'],
			},
		);

        const lineItemName = checkoutSession.line_items?.data[0].description;
        if (!lineItemName) {
            throw new Error('No line items found');
        }
        const tokensBought = parseInt(lineItemName.split(' ')[1]);

        await addTokens(data.client_reference_id, tokensBought);

        const posthog = PostHogClient();
        posthog.capture({
            distinctId: data.client_reference_id,
            event: 'purchase',
            properties: {
                amount: amountPaid,
                tokensBought,
                id: data.id,
            },
        });
        await posthog.shutdown();

    } catch (err) {
        console.error(`Webhook Error:`, {
            error: err,
            message: err instanceof Error ? err.message : 'Unknown error',
            stack: err instanceof Error ? err.stack : undefined,
        });
		return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
    }

    return NextResponse.json({ message: "Hello World" });
}
