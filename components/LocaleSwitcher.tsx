'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Locale, locales } from '@/lib/i18n/config';
import { useState, useEffect } from 'react';

interface LocaleDict {
	english: string;
	chinese: string;
	norwegian: string;
}

export default function LocaleSwitcher() {
	const pathname = usePathname();
	const router = useRouter();
	const [localeNames, setLocaleNames] = useState<Record<string, string>>({
		en: 'English',
		zh: '中文',
		nb: 'Norsk',
	});

	// Get locale from URL pathname
	const getLocaleFromPath = (): Locale => {
		const segments = pathname.split('/');
		const pathLocale = segments[1];
		if (locales.includes(pathLocale as Locale)) {
			return pathLocale as Locale;
		}
		return 'zh'; // default
	};

	const currentLocale = getLocaleFromPath();

	// Load locale names from dictionary
	useEffect(() => {
		const loadLocaleNames = async () => {
			try {
				const dictModule = await import(`@/locales/${currentLocale}/common.json`);
				if (dictModule.default.localeNames) {
					setLocaleNames(dictModule.default.localeNames);
				}
			} catch (error) {
				// Use defaults
			}
		};
		loadLocaleNames();
	}, [currentLocale]);

	const switchLocale = (newLocale: Locale) => {
		const segments = pathname.split('/');
		if (segments.length > 1) {
			segments[1] = newLocale;
		}
		const newPath = segments.join('/');
		router.push(newPath);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='sm' className='gap-2' data-testid='locale-switcher'>
					<Globe className='h-4 w-4' />
					<span className='uppercase'>{currentLocale}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => switchLocale('en')}>
					<span className={currentLocale === 'en' ? 'font-bold' : ''}>{localeNames.en || 'English'}</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => switchLocale('zh')}>
					<span className={currentLocale === 'zh' ? 'font-bold' : ''}>{localeNames.zh || '中文'}</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => switchLocale('nb')}>
					<span className={currentLocale === 'nb' ? 'font-bold' : ''}>{localeNames.nb || 'Norsk'}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
