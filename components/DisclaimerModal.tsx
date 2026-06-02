'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface DisclaimerDict {
	title: string;
	description: string;
	items: {
		noSensitive: string;
		automatedAnalysis: string;
		noLegalAdvice: string;
		noLiability: string;
	};
	checkbox: string;
	cancel: string;
	accept: string;
}

interface DisclaimerModalProps {
	onAccept: () => void;
	dictionary: DisclaimerDict;
}

// Helper component to render HTML content
function HTMLContent({ html }: { html: string }) {
	return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function DisclaimerModal({ onAccept, dictionary }: DisclaimerModalProps) {
	const [open, setOpen] = useState(true);
	const [agreed, setAgreed] = useState(false);

	const handleAccept = () => {
		if (agreed) {
			setOpen(false);
			onAccept();
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            >
				<DialogHeader>
					<DialogTitle>{dictionary.title}</DialogTitle>
					<p>
						<HTMLContent html={dictionary.description} />
					</p>
					<ul className='mt-2 list-disc list-inside text-sm space-y-1'>
						<li><HTMLContent html={dictionary.items.noSensitive} /></li>
						<li><HTMLContent html={dictionary.items.automatedAnalysis} /></li>
						<li><HTMLContent html={dictionary.items.noLegalAdvice} /></li>
						<li><HTMLContent html={dictionary.items.noLiability} /></li>
					</ul>
					<div className='mt-4 flex items-center space-x-2'>
						<Checkbox id='agree' checked={agreed} onCheckedChange={(checked) => setAgreed(checked === true)} />
						<label htmlFor='agree' className='text-sm'>
							{dictionary.checkbox}
						</label>
					</div>
				</DialogHeader>
				<div className='flex justify-end gap-2'>
                    <Link href='/'>
					<Button variant='outline' onClick={() => setOpen(false)}>
						{dictionary.cancel}
					</Button>
                    </Link>
					<Button onClick={handleAccept} disabled={!agreed}>
						{dictionary.accept}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
