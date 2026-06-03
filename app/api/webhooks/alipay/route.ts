import { NextRequest, NextResponse } from 'next/server';
import { verifyAlipayNotification } from '@/lib/alipay';
import { addTokens } from '@/utils/tokens';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};

    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    const sign = params.sign || '';

    // Verify signature
    const verified = await verifyAlipayNotification(params, sign);
    if (!verified) {
      console.error('Alipay signature verification failed');
      return NextResponse.json({ msg: 'fail' }, { status: 400 });
    }

    const tradeStatus = params.trade_status;

    // Only process successful trades
    if (tradeStatus !== 'TRADE_SUCCESS') {
      return NextResponse.json({ msg: 'success' });
    }

    const outTradeNo = params.out_trade_no;
    const alipayTradeNo = params.trade_no;
    const totalAmount = parseFloat(params.total_amount || '0');

    // Idempotency check - check if order already processed
    const existingOrder = await prisma.alipayOrder.findUnique({
      where: { alipayTradeNo },
    });
    if (existingOrder) {
      return NextResponse.json({ msg: 'success' });
    }

    // Parse clerk_user_id from order number
    // Format: ORDER-{user_id}-{timestamp}
    const parts = outTradeNo.split('-');
    if (parts.length < 3) {
      console.error('Invalid out_trade_no format:', outTradeNo);
      return NextResponse.json({ msg: 'fail' });
    }
    const clerkUserId = parts.slice(1, -1).join('-'); // Remove 'ORDER' and timestamp
    const tokenCount = Math.floor(totalAmount); // 1 CNY = 1 Token

    // Add tokens
    await addTokens(clerkUserId, tokenCount);

    // Record order
    await prisma.alipayOrder.create({
      data: {
        outTradeNo,
        alipayTradeNo,
        clerkUserId,
        tokenCount,
        amount: totalAmount,
        status: 'success',
      },
    });

    return NextResponse.json({ msg: 'success' });
  } catch (error) {
    console.error('Alipay webhook error:', error);
    return NextResponse.json({ msg: 'fail' }, { status: 500 });
  }
}