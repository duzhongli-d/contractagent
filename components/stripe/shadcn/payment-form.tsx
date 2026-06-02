'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PaymentFormProps {
	onSubmit: (e: React.FormEvent) => void;
	isProcessing: boolean;
	totalAmount: number;
	dictionary?: {
		redirectedSecureCheckout: string;
		securePaymentProcessing: string;
		noDataStored: string;
		supportPaymentMethods: string;
		redirectingToStripe: string;
		checkoutWithStripe: string;
	};
}

export default function PaymentForm({
	onSubmit,
	isProcessing,
	totalAmount,
	dictionary,
}: PaymentFormProps) {
	const dict = dictionary || {
		redirectedSecureCheckout: "You'll be redirected to Stripe's secure checkout page to complete your purchase.",
		securePaymentProcessing: 'Secure payment processing',
		noDataStored: 'No data is stored with us.',
		supportPaymentMethods: 'Support for all major payment methods',
		redirectingToStripe: 'Redirecting to Stripe...',
		checkoutWithStripe: `Checkout with Stripe • ${totalAmount.toFixed(2)} NOK`,
	};

	return (
		<div className='space-y-6'>
			<div className='rounded-lg border p-4 bg-gray-50'>
				<p className='text-sm text-gray-500 mb-2'>{dict.redirectedSecureCheckout}</p>
				<ul className='text-sm space-y-2'>
					<li className='flex items-center gap-2'>
						<svg
							className='h-4 w-4 text-green-500'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M5 13l4 4L19 7'
							/>
						</svg>
						{securePaymentProcessing}
					</li>
					<li className='flex items-center gap-2'>
						<svg
							className='h-4 w-4 text-green-500'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M5 13l4 4L19 7'
							/>
						</svg>
						{dict.noDataStored}
					</li>
					<li className='flex items-center gap-2'>
						<svg
							className='h-4 w-4 text-green-500'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M5 13l4 4L19 7'
							/>
						</svg>
						{dict.supportPaymentMethods}
					</li>
				</ul>
			</div>

			<form onSubmit={onSubmit}>
				<Button
					type='submit'
					className='w-full bg-blue-600 hover:bg-blue-700 h-12 text-base'
					disabled={isProcessing}>
					{isProcessing ? (
						<>
							<Loader2 className='mr-2 h-5 w-5 animate-spin' />
							{dict.redirectingToStripe}
						</>
					) : (
						<>{dict.checkoutWithStripe}</>
					)}
				</Button>
			</form>
		</div>
	);
}

// Default fallback values for backward compatibility
const securePaymentProcessing = 'Secure payment processing';
