'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/en/liveAnalyser';
	const error = searchParams.get('error');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		if (error) {
			setErrorMessage(error);
		}
	}, [error]);

	const handleSignIn = (provider?: string) => {
		signIn(provider, { callbackUrl });
	};

	return (
		<div className='flex min-h-screen items-center justify-center'>
			<div className='w-full max-w-md p-8 space-y-6'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold'>Sign In to LegalEdge</h1>
					<p className='mt-2 text-muted-foreground'>
						Choose your sign-in method
					</p>
				</div>

				{errorMessage && (
					<div className='p-4 bg-red-50 text-red-700 rounded-lg'>
						<p className='font-medium'>Authentication Error</p>
						<p className='text-sm'>{errorMessage}</p>
					</div>
				)}

				<div className='space-y-4'>
					<Button
						onClick={() => handleSignIn('google')}
						className='w-full'
						size='lg'>
						Continue with Google
					</Button>

					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<span className='w-full border-t' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-background px-2 text-muted-foreground'>
								Or continue with
							</span>
						</div>
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							const email = (e.target as HTMLFormElement).email.value;
							signIn('email', { email, callbackUrl });
						}}
						className='space-y-4'>
						<input
							type='email'
							name='email'
							placeholder='Email address'
							required
							className='w-full px-4 py-2 border rounded-lg'
						/>
						<Button type='submit' variant='outline' className='w-full'>
							Sign in with Email
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}