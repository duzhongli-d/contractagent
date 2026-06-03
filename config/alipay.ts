// 支付宝配置
export const ALIPAY_SANDBOX = process.env.ALIPAY_SANDBOX === 'true';
export const ALIPAY_APP_ID = process.env.ALIPAY_APP_ID || '';
export const ALIPAY_PRIVATE_KEY = process.env.ALIPAY_PRIVATE_KEY || '';
export const ALIPAY_PUBLIC_KEY = process.env.ALIPAY_PUBLIC_KEY || '';
export const ALIPAY_ALIPAY_PUBLIC_KEY = process.env.ALIPAY_ALIPAY_PUBLIC_KEY || '';
export const ALIPAY_NOTIFY_URL = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/alipay`;