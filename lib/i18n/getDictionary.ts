import 'server-only';
import { Locale } from './config';

const dictionaries: Record<Locale, () => Promise<any>> = {
	en: () => import('@/locales/en/common.json'),
	zh: () => import('@/locales/zh/common.json'),
	nb: () => import('@/locales/nb/common.json'),
};

export const getDictionary = async (locale: Locale) => {
	const dictionaryLoader = dictionaries[locale];
	if (!dictionaryLoader) {
		throw new Error(`Unsupported locale: ${locale}`);
	}
	const module = await dictionaryLoader();
	return module.default;
};
