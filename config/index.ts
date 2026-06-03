// CURRENCY CONFIG
export const CURRENCY = 'cny';
export const MIN_AMOUNT = 10.0;
export const MAX_AMOUNT = 500.0;
export const AMOUNT_STEP = 2.0;
// END CURRENCY CONFIG

// TOKEN CONFIG
export const TOKENS_PER_QUERY = 1;
export const TOKENS_PER_PREMIUM_QUERY = 4;
export const START_TOKENS = 2;
export const CNY_PER_TOKEN = 1;
// END TOKEN CONFIG

// DISCOUNT TIERS FOR TOKEN PURCHASES
export const DISCOUNT_TIERS = {
	HIGH_VOLUME: {
		threshold: 1000,
		discount: 0.15, // 15% discount
	},
	MEDIUM_VOLUME: {
		threshold: 500,
		discount: 0.10, // 10% discount
	},
	LOW_VOLUME: {
		threshold: 100,
		discount: 0.05, // 5% discount
	},
};

// COMPANY CONTACT INFO
export const COMPANY_INFO = {
	name: 'LegalEdge',
	address: '上海xx街xx号',
	city: '上海',
	postalCode: '200000',
	country: '中国',
	email: 'eric.du@halooffice.com',
	phone: '+86 180 1792 6742',
	supportEmail: 'eric.du@halooffice.com',
	salesEmail: 'eric.du@halooffice.com',
};

