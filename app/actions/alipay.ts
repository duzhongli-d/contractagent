'use server';

import { getAlipaySdk } from '@/lib/alipay';
import { CNY_PER_TOKEN } from '@/config';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

interface CreateOrderData {
  tokenCount: number;
  basePrice: number;
}

export async function createAlipayOrder(data: CreateOrderData): Promise<{ success: boolean; payUrl?: string; error?: string }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const { tokenCount, basePrice } = data;

    // 最低金额检查 (1 CNY)
    if (basePrice < 1) {
      return { success: false, error: 'Minimum amount is 1 CNY' };
    }

    const sdk = getAlipaySdk();

    // 生成订单号: ORDER-{user_id}-{timestamp}
    const outTradeNo = `ORDER-${userId}-${Date.now()}`;

    // 计算总金额 (CNY_PER_TOKEN = 1)
    const totalAmount = tokenCount * CNY_PER_TOKEN;

    // 根据客户端判断支付方式
    const productCode = 'FAST_INSTANT_TRADE_PAY';

    const bizContent = {
      outTradeNo,
      productCode,
      totalAmount: totalAmount.toString(),
      subject: `购买 ${tokenCount} Tokens`,
      body: `LegalEdge AI - 购买 ${tokenCount} Tokens`,
    };

    const result = await sdk.exec('alipay.trade.app.pay', {
      bizContent,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/buytokens/success`,
    });

    if (result && result.code === '10000') {
      // 沙箱环境返回的是支付链接
      return { success: true, payUrl: result.payUrl };
    }

    return { success: false, error: result?.msg || 'Failed to create order' };
  } catch (error) {
    console.error('Alipay order creation failed:', error);
    return { success: false, error: 'Internal server error' };
  }
}