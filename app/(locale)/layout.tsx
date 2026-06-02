import type React from 'react';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { Locale, defaultLocale, locales } from '@/lib/i18n/config';
import { LocaleProvider } from '@/hooks/useLocale';
import LocaleLayoutClient from '@/components/LocaleLayoutClient';

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
	const resolvedParams = await params;
	const locale = resolvedParams.locale || defaultLocale;
	const validLocale: Locale = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale;

	const dict = await getDictionary(validLocale);

	return {
		title: {
			default: `LegalEdge AI - ${dict.hero.title}`,
			template: `%s | LegalEdge AI`,
		},
		description: dict.hero.description,
	};
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale?: string }>;
}) {
	const resolvedParams = await params;
	const locale = resolvedParams.locale || defaultLocale;
	const validLocale: Locale = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale;
	const dict = await getDictionary(validLocale);

	return (
		<LocaleProvider initialLocale={validLocale}>
			<LocaleLayoutClient initialDictionary={dict}>
				{children}
			</LocaleLayoutClient>
		</LocaleProvider>
	);
}
