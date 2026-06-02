'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { createCheckoutSession } from '@/app/actions/stripe';
import { toast } from 'sonner';

interface StripeCheckoutButtonProps {
	tokenCount: number;
	totalAmount: number;
	dictionary: {
		minimumAmountError: string;
		redirectingToStripe: string;
		checkoutWithStripe: string;
	};
}

export default function StripeCheckoutButton({
	tokenCount,
	totalAmount,
	dictionary,
}: StripeCheckoutButtonProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleCheckout = async () => {
		setIsLoading(true);
        if (totalAmount < 6) {
            toast.error(dictionary.minimumAmountError);
            setIsLoading(false);
            return;
        }
		try {
            // create a formData object with the totalAmount as the prop "totalAmount" and uiMode as hosted
            const data = new FormData();
            data.append('totalAmount', totalAmount.toString());
            data.append('uiMode', 'hosted'); // ? Dont plan to use embedded mode, so hosted is hardcoded
            data.append('tokenCount', tokenCount.toString());
            // call the createCheckoutSession function with the data object
            const { client_secret, url } = await createCheckoutSession(data); // ? client_secret is used for embedded mode, keeping it incase we want to use it in the future
            // if embedded mode, set the client_secret
            // if (uiMode === 'embedded') return setClientSecret(client_secret);
            // redirect to the url
    		window.location.assign(url as string);

		} catch (error) {
			console.error('Error during checkout:', error);
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleCheckout}
			className='w-full bg-blue-600 hover:bg-blue-700 h-12 text-base'
			disabled={isLoading}>
			{isLoading ? (
				<>
					<Loader2 className='mr-2 h-5 w-5 animate-spin' />
					{dictionary.redirectingToStripe}
				</>
			) : (
				<>{dictionary.checkoutWithStripe.replace('{amount}', totalAmount.toFixed(2))}</>
			)}
		</Button>
	);
}
