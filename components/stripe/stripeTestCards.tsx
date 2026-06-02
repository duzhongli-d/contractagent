export default function StripeTestCards() {
	return (
        <div className='p-4 bg-gray-100 rounded-md shadow-md text-gray-700 w-fit'>
            Use any of the{' '}
            <a
                href='https://stripe.com/docs/testing#cards'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 underline hover:text-blue-700'>
                Stripe test cards
            </a>{' '}
            for this demo, e.g. <br /> With all other fields filled randomly.
            <div className='flex gap-1 mt-2'>
                <span className='px-2 py-1 bg-gray-200 rounded-md'>4242</span>
                <span className='px-2 py-1 bg-gray-200 rounded-md'>4242</span>
                <span className='px-2 py-1 bg-gray-200 rounded-md'>4242</span>
                <span className='px-2 py-1 bg-gray-200 rounded-md'>4242</span>
            </div>
        </div>
	);
}
