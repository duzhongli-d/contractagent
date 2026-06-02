import type React from 'react';
import { Locale, locales } from '@/lib/i18n/config';
import { UploadForm } from './UploadForm';

interface UploadDict {
	title: string;
	subtitle: string;
	document: string;
	analyzing: string;
	startAnalysis: string;
}

interface UploadPageProps {
	params: Promise<{ locale: string }>;
}

export default async function UploadPage({ params }: UploadPageProps) {
	const resolvedParams = await params;
	const locale = resolvedParams.locale;
	const validLocale: Locale = (locales.includes(locale as Locale) ? locale : 'en') as Locale;

	let dictionary: UploadDict | null = null;
	try {
		const dictModule = await import(`@/locales/${validLocale}/common.json`);
		dictionary = dictModule.default.upload;
	} catch (error) {
		console.error('Failed to load dictionary for locale:', validLocale);
		const fallbackModule = await import('@/locales/en/common.json');
		dictionary = fallbackModule.default.upload;
	}

	if (!dictionary) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='flex justify-center items-center min-h-[400px]'>
					<div className='animate-pulse text-muted-foreground'>Loading...</div>
				</div>
			</div>
		);
	}

	return <UploadForm dictionary={dictionary} locale={validLocale} />;
}