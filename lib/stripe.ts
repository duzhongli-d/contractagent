import 'server-only';

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2025-02-24.acacia',
	appInfo: {
		name: 'LegalEdge',
		url: 'https://legaledge.kaktusfamilien.com',
	},
});
