'use client';

import type Stripe from 'stripe';

import React, { useState } from 'react';

import CustomDonationInput from './CustomDonationInput';
import StripeTestCards from './stripeTestCards';

import { formatAmountForDisplay } from '@/utils/stripeHelpers';
import * as config from '@/config';
import { createCheckoutSession } from '@/app/actions/stripe';
import getStripe from '@/utils/getStripe';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { Button } from '../ui/button';

interface CheckoutFormProps {
	uiMode: Stripe.Checkout.SessionCreateParams.UiMode;
}

export default function CheckoutForm(props: CheckoutFormProps) {
	const [loading] = useState<boolean>(false);
	const [input, setInput] = useState<{ totalAmount: number }>({
		totalAmount: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
	});
	const [clientSecret, setClientSecret] = useState<string | null>(null);

	const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e): void =>
		setInput({
			...input,
			[e.currentTarget.name]: e.currentTarget.value,
		});

	const formAction = async (data: FormData): Promise<void> => {
		const uiMode = data.get('uiMode') as Stripe.Checkout.SessionCreateParams.UiMode;
		const { client_secret, url } = await createCheckoutSession(data);

		if (uiMode === 'embedded') return setClientSecret(client_secret);

		window.location.assign(url as string);
	};

	return (
		<>
            <form
                action={formAction}
                className="flex flex-col gap-4 p-6 bg-white shadow-md rounded-md w-fit"
            >
                <input type="hidden" name="uiMode" value={props.uiMode} />
                <CustomDonationInput
                    className="checkout-style w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="totalAmount"
                    min={config.MIN_AMOUNT}
                    max={config.MAX_AMOUNT}
                    step={config.AMOUNT_STEP}
                    currency={config.CURRENCY}
                    onChange={handleInputChange}
                    value={input.totalAmount}
                />
                <StripeTestCards />
                <Button
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading}
                >
                    {/* Kjøp {formatAmountForDisplay(input.customDonation, config.CURRENCY)} */}
                    Kjøp
                </Button>
            </form>
			{clientSecret ? (
				<EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
					<EmbeddedCheckout />
				</EmbeddedCheckoutProvider>
			) : null}
		</>
	);
}
