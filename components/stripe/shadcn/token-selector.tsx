'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus } from 'lucide-react';
import { CURRENCY } from '@/config';

interface TokenSelectorProps {
	tokenCount: number;
	setTokenCount: (count: number) => void;
	pricePerToken: number;
	currency: string;
	dictionary?: {
		title: string;
		description: string;
		subtotal: string;
		tokensXPrice: string;
		volumeDiscount: string;
		discountOf: string;
		totalPrice: string;
		discountIncluded: string;
		tokens: string;
		perDocument: string;
	};
}

export default function TokenSelector({
	tokenCount,
	setTokenCount,
	pricePerToken,
	currency,
	dictionary,
}: TokenSelectorProps) {
	const [inputValue, setInputValue] = useState(tokenCount.toString());

	useEffect(() => {
		setInputValue(tokenCount.toString());
	}, [tokenCount]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);

		const numValue = Number.parseInt(value);
		if (!isNaN(numValue) && numValue >= 6 && numValue <= 1000) {
			setTokenCount(numValue);
		}
	};

	const handleSliderChange = (value: number[]) => {
		setTokenCount(value[0]);
	};

	const decrementTokens = () => {
		if (tokenCount > 6) {
			setTokenCount(tokenCount - 10);
		}
	};

	const incrementTokens = () => {
		if (tokenCount < 1000) {
			setTokenCount(tokenCount + 10);
		}
	};

	const presetAmounts = [6, 50, 100, 500, 1000];

	const getDiscountInfo = (count: number) => {
		if (count >= 1000) {
			return { rate: 15, pricePerToken: pricePerToken * 0.85 };
		} else if (count >= 500) {
			return { rate: 10, pricePerToken: pricePerToken * 0.9 };
		} else if (count >= 100) {
			return { rate: 5, pricePerToken: pricePerToken * 0.95 };
		}
		return { rate: 0, pricePerToken: pricePerToken };
	};

	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<h2 className='text-lg font-medium'>{dictionary?.title || 'Select Token Amount'}</h2>
				<p className='text-sm text-gray-500'>
					{dictionary?.description || `Select how many tokens you want to buy. Each Token costs ${pricePerToken} ${CURRENCY.toUpperCase()} and allows you to analyze one document.`}
					{dictionary?.perDocument ? ` ${dictionary.perDocument}` : ''}
				</p>
			</div>

			<div className='flex items-center gap-4'>
				<Button
					variant='outline'
					size='icon'
					onClick={decrementTokens}
					disabled={tokenCount <= 6}>
					<Minus className='h-4 w-4' />
				</Button>

				<div className='flex-1'>
					<Input
						type='number'
						min='6'
						max='1000'
						value={inputValue}
						onChange={handleInputChange}
						onBlur={() => {
							const numValue = Number.parseInt(inputValue);
							if (isNaN(numValue) || numValue < 6) {
								setTokenCount(6);
							} else if (numValue > 1000) {
								setTokenCount(1000);
							}
						}}
						className='text-center bg-white'
					/>
				</div>

				<Button
					variant='outline'
					size='icon'
					onClick={incrementTokens}
					disabled={tokenCount >= 1000}>
					<Plus className='h-4 w-4' />
				</Button>
			</div>

			<div className='space-y-4'>
				<Slider
					value={[tokenCount]}
					min={6}
					max={1000}
					step={10}
					onValueChange={handleSliderChange}
					className='py-4'
				/>

				<div className='flex justify-between text-xs text-gray-500'>
					<span>6</span>
					<span>1000</span>
				</div>
			</div>

			<div className='grid grid-cols-5 gap-2'>
				{presetAmounts.map((amount) => (
					<Button
						key={amount}
						variant='outline'
						onClick={() => setTokenCount(amount)}
						className={tokenCount === amount ? 'border-blue-600 bg-blue-50' : ''}>
						{amount}
					</Button>
				))}
			</div>

			<Card className='bg-blue-50 border-blue-200'>
				<CardContent className='p-4'>
					<div className='space-y-4'>
						<div className='flex justify-between items-center'>
							<div>
								<p className='text-sm font-medium'>{dictionary?.subtotal || 'Subtotal'}</p>
								<p className='text-xs text-gray-500'>
									{tokenCount} {dictionary?.tokens || 'tokens'} × {pricePerToken} {currency}
								</p>
							</div>
							<p className='text-lg font-medium'>
								{tokenCount * pricePerToken} {currency}
							</p>
						</div>

						{getDiscountInfo(tokenCount).rate > 0 && (
							<div className='flex justify-between items-center text-green-600'>
								<div>
									<p className='text-sm font-medium'>{dictionary?.volumeDiscount || 'Volume Discount'}</p>
									<p className='text-xs'>
										{dictionary?.discountOf || `${getDiscountInfo(tokenCount).rate}% off`}
									</p>
								</div>
								<p className='text-lg font-medium'>
									-
									{(
										(tokenCount *
											pricePerToken *
											getDiscountInfo(tokenCount).rate) /
										100
									).toFixed(2)}{' '}
									{currency}
								</p>
							</div>
						)}

						<div className='flex justify-between items-center pt-2 border-t'>
							<div>
								<p className='text-sm font-bold'>{dictionary?.totalPrice || 'Total Price'}</p>
								{getDiscountInfo(tokenCount).rate > 0 && (
									<p className='text-xs text-green-600'>
										{dictionary?.discountIncluded || `${getDiscountInfo(tokenCount).rate}% discount included`}
									</p>
								)}
							</div>
							<p className='text-2xl font-bold text-blue-600'>
								{(tokenCount * getDiscountInfo(tokenCount).pricePerToken).toFixed(
									2,
								)}{' '}
								{currency}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
