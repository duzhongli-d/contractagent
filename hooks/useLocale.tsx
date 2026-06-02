'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';

type LocaleContextType = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_KEY = 'locale-preference';

export const LocaleProvider = ({ children, initialLocale = 'en' as Locale }: { children: React.ReactNode; initialLocale?: Locale }) => {
	const [locale, setLocaleState] = useState<Locale>(initialLocale);

	useEffect(() => {
		const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
		if (saved && (saved === 'en' || saved === 'zh' || saved === 'nb')) {
			setLocaleState(saved);
		}
	}, []);

	const setLocale = (newLocale: Locale) => {
		setLocaleState(newLocale);
		localStorage.setItem(LOCALE_KEY, newLocale);
	};

	return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
	const context = useContext(LocaleContext);
	if (context === undefined) {
		throw new Error('useLocale must be used within a LocaleProvider');
	}
	return context;
};

export const useLocaleSwitch = () => {
	const router = useRouter();
	const pathname = usePathname();

	const switchLocale = (newLocale: Locale) => {
		const segments = pathname.split('/');
		if (segments.length > 1) {
			segments[1] = newLocale;
		}
		const newPath = segments.join('/');
		router.push(newPath);
	};

	return { switchLocale };
};
