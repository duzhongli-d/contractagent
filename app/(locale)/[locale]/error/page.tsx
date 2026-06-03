'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get('error');

	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<h1 className='text-2xl font-bold'>Authentication Error</h1>
			<p className='mt-2 text-muted-foreground'>
				{error || 'An error occurred during authentication.'}
			</p>
			<Link
				href='/en/signin'
				className='mt-4 text-blue-600 hover:underline'>
				Return to Sign In
			</Link>
		</div>
	);
}