'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type TokenContextType = {
	tokenCount: number | null;
	refresh: () => Promise<void>;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
	const { data: session, status } = useSession();
	const [tokenCount, setTokenCount] = useState<number | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

	const fetchTokenCount = async () => {
		try {
			const res = await fetch('/api/tokens');
			const data = await res.json();
			setTokenCount(data.tokens);
		} catch (error) {
			console.error('Failed to fetch token count:', error);
		}
	};

	useEffect(() => {
		if (status === 'loading') {
            return;
        }

        if (status !== 'authenticated') {
            return;
        }

        if (!isInitialized) {
            fetchTokenCount();
            setIsInitialized(true);
        }

		// Poll for token updates every 10 seconds (via /api/tokens endpoint)
		const intervalId = setInterval(fetchTokenCount, 10000);

		return () => {
            clearInterval(intervalId);
		};
	}, [status, session, isInitialized]);

	return (
		<TokenContext.Provider value={{ tokenCount, refresh: fetchTokenCount }}>
			{children}
		</TokenContext.Provider>
	);
};

export const useTokenCount = () => {
	const ctx = useContext(TokenContext);
	if (!ctx) throw new Error('useTokenCount must be used within TokenProvider');
	return ctx;
};
