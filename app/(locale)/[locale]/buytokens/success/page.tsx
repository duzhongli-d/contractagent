import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { CNY_PER_TOKEN } from '@/config';
import { prisma } from '@/lib/db';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface BuytokensSuccessDict {
	title: string;
	subtitle: string;
	thankYou: string;
	tokensBought: string;
	basePrice: string;
	totalPaid: string;
	orderDetails: string;
	orderId: string;
	date: string;
	paymentMethod: string;
	goToAnalysis: string;
	goToHome: string;
}

export default async function ResultPage(props: { searchParams: SearchParams }) {
	const searchParams = await props.searchParams;
	const locale = 'nb';

	const dictModule = await import(`@/locales/${locale}/common.json`);
	const dict: BuytokensSuccessDict = dictModule.default.buytokens.success;

	const outTradeNo = searchParams.out_trade_no;

	if (!outTradeNo || typeof outTradeNo !== 'string') {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
				<Card className='w-full max-w-md'>
					<CardHeader className='text-center'>
						<CardTitle className='text-2xl text-red-600'>Missing order number</CardTitle>
						<CardDescription>Please provide a valid out_trade_no</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button asChild className='w-full'>
							<Link href={`/${locale}/buytokens`}>Go back to purchase page</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	// Get order from database
	const order = await prisma.alipayOrder.findUnique({
		where: { outTradeNo },
	});

	if (!order) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
				<Card className='w-full max-w-md'>
					<CardHeader className='text-center'>
						<CardTitle className='text-2xl text-red-600'>Order not found</CardTitle>
						<CardDescription>The order could not be found in our system.</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button asChild className='w-full'>
							<Link href={`/${locale}/buytokens`}>Go back to purchase page</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='text-center'>
					<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
						<CheckCircle className='h-10 w-10 text-green-600' />
					</div>
					<CardTitle className='text-2xl'>{dict.title}</CardTitle>
					<p className='text-sm text-gray-500 mt-2'>
						{dict.subtitle}
					</p>
					<CardDescription>{dict.thankYou}</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='rounded-lg bg-blue-50 p-4'>
						<div className='text-center space-y-2'>
							<p className='text-sm text-gray-500'>{dict.tokensBought}</p>
							<p className='text-3xl font-bold text-blue-600'>
								{order.tokenCount} Tokens
							</p>

							<div className='text-sm'>
								<p className='text-gray-500'>{dict.basePrice}: {CNY_PER_TOKEN} CNY</p>

								<p className='font-medium mt-1'>
									{dict.totalPaid}: {order.amount} CNY
								</p>
							</div>
						</div>
					</div>

					<div className='space-y-2'>
						<h3 className='text-sm font-medium'>{dict.orderDetails}</h3>
						<div className='flex justify-between text-sm'>
							<span className='text-gray-500'>{dict.orderId}</span>
							<span>{order.outTradeNo.slice(-12)}-...</span>
						</div>
						<div className='flex justify-between text-sm'>
							<span className='text-gray-500'>{dict.date}</span>
							<span>{order.createdAt.toLocaleString()}</span>
						</div>
						<div className='flex justify-between text-sm'>
							<span className='text-gray-500'>{dict.paymentMethod}</span>
							<span>Alipay</span>
						</div>
					</div>
				</CardContent>
				<CardFooter className='flex flex-col gap-4'>
					<Button asChild className='w-full bg-blue-600 hover:bg-blue-700'>
						<Link href={`/${locale}/liveAnalyser`}>
							{dict.goToAnalysis} <ArrowRight className='ml-2 h-4 w-4' />
						</Link>
					</Button>
					<Button variant='outline' asChild className='w-full'>
						<Link href={`/${locale}`}>{dict.goToHome}</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
