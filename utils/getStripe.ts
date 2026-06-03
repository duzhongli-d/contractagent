import { Stripe } from '@stripe/stripe-js';
import { getStripePromise } from '@/lib/stripe-client';

const getStripe = (): Promise<Stripe | null> => {
    return getStripePromise();
};

export default getStripe;
