'use client';

import HeaderClient from './HeaderClient';
import { useTokenCount } from '@/context/TokenContext';

type HeaderProps = {
	dictionary: any;
};

export default function Header({ dictionary }: HeaderProps) {
	const { tokenCount } = useTokenCount();

	return (
		<header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<HeaderClient dictionary={dictionary} userTokens={tokenCount} />
		</header>
	);
}
