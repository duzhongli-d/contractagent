'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/useLocale';
import { Locale, locales } from '@/lib/i18n/config';

interface DemoBannerDict {
	title: string;
	description: string;
	close: string;
}

export function DemoBanner() {
	const [isVisible, setIsVisible] = useState(true);
	const [dictionary, setDictionary] = useState<DemoBannerDict | null>(null);
	const { locale } = useLocale();

	useEffect(() => {
		const bannerDismissed = localStorage.getItem('demoBannerDismissed');
		if (bannerDismissed) {
			setIsVisible(false);
		}
	}, []);

	useEffect(() => {
		const loadDictionary = async () => {
			try {
				const dictModule = await import(`@/locales/${locale}/common.json`);
				setDictionary(dictModule.default.demoBanner);
			} catch (error) {
				// Fallback to English
				const enModule = await import('@/locales/en/common.json');
				setDictionary(enModule.default.demoBanner);
			}
		};
		loadDictionary();
	}, [locale]);

	const dismissBanner = () => {
		setIsVisible(false);
		localStorage.setItem('demoBannerDismissed', 'true');
	};

	if (!isVisible || !dictionary) return null;

	return (
		<Alert className='rounded-none border-b'>
			<AlertDescription className='flex items-center justify-between'>
				<span>
					<strong>{dictionary.title}</strong> {dictionary.description}
				</span>
				<Button variant='destructiveOutline' size='sm' className='ml-2' onClick={dismissBanner}>
					<X className='h-4 w-4' />
					<span className='sr-only'>{dictionary.close}</span>
				</Button>
			</AlertDescription>
		</Alert>
	);
}
