'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import TokenSelector from '@/components/stripe/shadcn/token-selector';
import StripeCheckoutButton from '@/components/stripe/shadcn/stripe-checkout-button';
import { NOKPERTOKEN, DISCOUNT_TIERS } from '@/config';

interface BuytokensDict {
	title: string;
	subtitle: string;
	backHome: string;
	orderSummary: string;
	tokensPrice: string;
	volumeDiscount: string;
	total: string;
	securePayment: string;
	completePurchase: string;
	redirectStripe: string;
	payWith: string;
	minimumAmountError: string;
	redirectingToStripe: string;
	checkoutWithStripe: string;
	redirectedSecureCheckout: string;
	noDataStored: string;
	supportPaymentMethods: string;
	perUnit: string;
	tokens: string;
	tokenSelector: {
		title: string;
		description: string;
		subtotal: string;
		tokensXPrice: string;
		volumeDiscount: string;
		discountOf: string;
		totalPrice: string;
		discountIncluded: string;
		tokens: string;
		perDocument: string;
	};
}

export function BuytokensForm({ dictionary }: { dictionary: BuytokensDict }) {
	const [tokenCount, setTokenCount] = useState(100);

	const getDiscountedPrice = (count: number) => {
		let pricePerToken = NOKPERTOKEN;

		if (count >= DISCOUNT_TIERS.HIGH_VOLUME.threshold) {
			pricePerToken = NOKPERTOKEN * (1 - DISCOUNT_TIERS.HIGH_VOLUME.discount);
		} else if (count >= DISCOUNT_TIERS.MEDIUM_VOLUME.threshold) {
			pricePerToken = NOKPERTOKEN * (1 - DISCOUNT_TIERS.MEDIUM_VOLUME.discount);
		} else if (count >= DISCOUNT_TIERS.LOW_VOLUME.threshold) {
			pricePerToken = NOKPERTOKEN * (1 - DISCOUNT_TIERS.LOW_VOLUME.discount);
		}

		return count * pricePerToken;
	};

	const totalPrice = getDiscountedPrice(tokenCount);

	return (
		<div className='min-h-screen bg-background'>
			<div className='container py-8'>
				<Link
					href='/'
					className='inline-flex items-center text-sm font-medium text-primary hover:underline mb-6 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md'>
					<ArrowLeft className='mr-2 h-4 w-4' />
					{dictionary.backHome}
				</Link>

				<div className='grid gap-8 md:grid-cols-2'>
					<div>
						<h1 className='text-3xl font-bold mb-6'>{dictionary.title}</h1>
						<TokenSelector
							tokenCount={tokenCount}
							setTokenCount={setTokenCount}
							pricePerToken={2}
							currency='NOK'
							dictionary={{
								title: dictionary.tokenSelector.title,
								description: dictionary.tokenSelector.description,
								subtotal: dictionary.tokenSelector.subtotal,
								tokensXPrice: dictionary.tokenSelector.tokensXPrice,
								volumeDiscount: dictionary.tokenSelector.volumeDiscount,
								discountOf: dictionary.tokenSelector.discountOf,
								totalPrice: dictionary.tokenSelector.totalPrice,
								discountIncluded: dictionary.tokenSelector.discountIncluded,
								tokens: dictionary.tokenSelector.tokens,
								perDocument: dictionary.tokenSelector.perDocument,
							}}
						/>

						<Card className='mt-8'>
							<CardHeader>
								<CardTitle>{dictionary.orderSummary}</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex justify-between'>
									<span className='text-gray-500'>
										{tokenCount} {dictionary.tokens} ({NOKPERTOKEN} NOK {dictionary.perUnit})
									</span>
									<span>{tokenCount * 2} NOK</span>
								</div>

								{tokenCount >= 100 && (
									<div className='flex justify-between text-green-600'>
										<span>
											{dictionary.volumeDiscount}
											{tokenCount >= 1000
												? ' (15%)'
												: tokenCount >= 500
												? ' (10%)'
												: ' (5%)'}
										</span>
										<span>-{(tokenCount * 2 - totalPrice).toFixed(2)} NOK</span>
									</div>
								)}

								<div className='flex justify-between border-t pt-4'>
									<span className='font-medium'>{dictionary.total}</span>
									<span className='font-bold text-blue-600'>
										{totalPrice.toFixed(2)} NOK
									</span>
								</div>
							</CardContent>
						</Card>

						<div className='mt-6 flex items-center gap-2 text-sm text-gray-500'>
							<Shield className='h-4 w-4' />
							<span>{dictionary.securePayment}</span>
						</div>
					</div>

					<div>
						<Card>
							<CardHeader>
								<CardTitle>{dictionary.completePurchase}</CardTitle>
								<CardDescription>
									{dictionary.redirectStripe}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<StripeCheckoutButton
									tokenCount={tokenCount}
									totalAmount={totalPrice}
									dictionary={{
										minimumAmountError: dictionary.minimumAmountError,
										redirectingToStripe: dictionary.redirectingToStripe,
										checkoutWithStripe: dictionary.checkoutWithStripe,
									}}
								/>
							</CardContent>
							<CardFooter className='flex flex-col gap-4 border-t pt-6'>
								<div className='flex items-center justify-center gap-2'>
									<div className='flex gap-2'>
									</div>
									<span className='text-sm text-gray-500'>
										{dictionary.payWith}
									</span>
								</div>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}