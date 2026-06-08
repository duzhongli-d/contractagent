'use server';

import type { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { CURRENCY, MIN_AMOUNT } from '@/config';
import { formatAmountForStripe } from '@/utils/stripeHelpers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/auth';
import PostHogClient from '@/posthog';

export async function createCheckoutSession(
	data: FormData,
): Promise<{ client_secret: string | null; url: string | null }> {
	// Check if the totalAmount is more than 10, we dont want to ever accept less than 10 NOK
	if (Number(data.get('totalAmount') as string) < MIN_AMOUNT) {
		throw new Error('Minimum totalAmount is 10 NOK');
	}
	const ui_mode = data.get('uiMode') as Stripe.Checkout.SessionCreateParams.UiMode;

	const origin: string = (await headers()).get('origin') as string;

	const session = await auth();
	const userId = session?.user?.id;

	const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
		mode: 'payment',
		submit_type: 'pay',
		line_items: [
			{
				quantity: 1,
				price_data: {
					currency: CURRENCY,
					product_data: {
						name: `Tokens ${data.get('tokenCount')}`,
					},
					unit_amount: formatAmountForStripe(
						Number(data.get('totalAmount') as string),
						CURRENCY,
					),
				},
			},
		],
		...(ui_mode === 'hosted' && {
			success_url: `${origin}/buytokens/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/buytokens`,
		}),
		...(ui_mode === 'embedded' && {
			return_url: `${origin}/donate-with-embedded-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
		}),
		ui_mode,
		client_reference_id: userId ? userId : undefined,
	});

	const posthog = PostHogClient();
	posthog.capture({
		distinctId: userId!,
		event: 'checkout_session_created',
		properties: { 
            checkoutSessionId: checkoutSession.id,
            origin,
            amount: Number(data.get('totalAmount')) / 100, 
        },
	});
	await posthog.shutdown();

	return {
		client_secret: checkoutSession.client_secret,
		url: checkoutSession.url,
	};
}

export async function createPaymentIntent(data: FormData): Promise<{ client_secret: string }> {
	const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
		amount: formatAmountForStripe(Number(data.get('customDonation') as string), CURRENCY),
		automatic_payment_methods: { enabled: true },
		currency: CURRENCY,
	});

	return { client_secret: paymentIntent.client_secret as string };
}
