'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DemoBanner } from '@/components/Demo-banner';
import { Locale, locales, defaultLocale } from '@/lib/i18n/config';

interface LocaleLayoutClientProps {
	children: React.ReactNode;
	initialDictionary: Record<string, any>;
}

export default function LocaleLayoutClient({
	children,
	initialDictionary,
}: LocaleLayoutClientProps) {
	const pathname = usePathname();
	const [dictionary, setDictionary] = useState(initialDictionary);

	// Get locale from URL pathname
	const getLocaleFromPath = (): Locale => {
		const segments = pathname.split('/');
		const pathLocale = segments[1];
		if (locales.includes(pathLocale as Locale)) {
			return pathLocale as Locale;
		}
		return defaultLocale;
	};

	const currentLocale = getLocaleFromPath();

	useEffect(() => {
		// Fetch new dictionary when locale changes
		const loadDictionary = async () => {
			try {
				const dictModule = await import(`@/locales/${currentLocale}/common.json`);
				setDictionary(dictModule.default);
			} catch (error) {
				console.error('Failed to load dictionary for locale:', currentLocale);
			}
		};

		loadDictionary();
	}, [currentLocale]);

	return (
		<>
			<Header dictionary={dictionary} />
			<DemoBanner />
			{children}
			<Footer dictionary={dictionary} />
		</>
	);
}
