import type React from 'react';
import { Locale, locales } from '@/lib/i18n/config';
import { BuytokensForm } from './BuytokensForm';

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

interface BuytokensPageProps {
	params: Promise<{ locale: string }>;
}

export default async function BuytokensPage({ params }: BuytokensPageProps) {
	const resolvedParams = await params;
	const locale = resolvedParams.locale;
	const validLocale: Locale = (locales.includes(locale as Locale) ? locale : 'en') as Locale;

	let dictionary: BuytokensDict | null = null;
	try {
		const dictModule = await import(`@/locales/${validLocale}/common.json`);
		dictionary = dictModule.default.buytokens;
	} catch (error) {
		console.error('Failed to load dictionary for locale:', validLocale);
		const fallbackModule = await import('@/locales/en/common.json');
		dictionary = fallbackModule.default.buytokens;
	}

	if (!dictionary) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='animate-pulse text-muted-foreground'>Loading...</div>
			</div>
		);
	}

	return <BuytokensForm dictionary={dictionary} />;
}