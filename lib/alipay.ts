import { AlipaySdk } from 'alipay-sdk';
import { ALIPAY_APP_ID, ALIPAY_PRIVATE_KEY, ALIPAY_PUBLIC_KEY, ALIPAY_ALIPAY_PUBLIC_KEY, ALIPAY_SANDBOX } from '@/config/alipay';

let alipaySdk: AlipaySdk | null = null;

export function getAlipaySdk(): AlipaySdk {
  if (!alipaySdk) {
    alipaySdk = new AlipaySdk({
      appId: ALIPAY_APP_ID,
      privateKey: ALIPAY_PRIVATE_KEY,
      signType: 'RSA2',
      // 沙箱环境下使用 gateway = 'https://openapi-sandbox.dl.alipaydev.com/gateway.do'
      gateway: ALIPAY_SANDBOX ? 'https://openapi-sandbox.dl.alipaydev.com/gateway.do' : 'https://openapi.alipay.com/gateway.do',
    });
  }
  return alipaySdk;
}

// 验证签名 - Alipay会将sign参数一起发送过来
export function verifyAlipayNotification(params: Record<string, string>, _sign: string): boolean {
  const sdk = getAlipaySdk();
  return sdk.checkNotifySign(params, false);
}