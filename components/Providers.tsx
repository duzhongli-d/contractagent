'use client';

import { SessionProvider } from 'next-auth/react';
import { PostHogProvider } from '@/components/PostHogProvider';
import { TokenProvider } from '@/context/TokenContext';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<PostHogProvider>
				<TokenProvider>
					{children}
					<Toaster richColors />
				</TokenProvider>
			</PostHogProvider>
		</SessionProvider>
	);
}