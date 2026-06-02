'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, FileText } from 'lucide-react';
import { Locale, locales } from '@/lib/i18n/config';

interface UploadDict {
	title: string;
	subtitle: string;
	document: string;
	analyzing: string;
	startAnalysis: string;
}

function UploadForm({ dictionary, locale }: { dictionary: UploadDict; locale: Locale }) {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const router = useRouter();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = () => {
		if (!file) return;

		setUploading(true);
		// Show indeterminate progress since actual upload progress isn't available
		setProgress(33);
		// Simulate processing - in real app, this would be replaced with actual progress
		setTimeout(() => {
			setProgress(66);
			setTimeout(() => {
				setProgress(100);
				router.push(`/${locale}/feedback`);
			}, 800);
		}, 800);
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<Card className='max-w-md mx-auto'>
				<CardHeader>
					<CardTitle className='text-2xl font-bold'>{dictionary.title}</CardTitle>
					<CardDescription>
						{dictionary.subtitle}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div className='grid w-full max-w-sm items-center gap-1.5'>
							<Input
								id='document'
								type='file'
								onChange={handleFileChange}
								accept='.pdf,.doc,.docx'
							/>
						</div>
						{file && (
							<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
								<FileText size={16} />
								<span>{file.name}</span>
							</div>
						)}
						{uploading && (
							<div className='space-y-2'>
								<Progress value={progress} className='w-full' />
								<p className='text-sm text-muted-foreground'>
									{dictionary.analyzing.replace('{progress}', progress.toString())}
								</p>
							</div>
						)}
					</div>
				</CardContent>
				<CardFooter>
					<Button onClick={handleUpload} disabled={!file || uploading} className='w-full'>
						{uploading ? dictionary.analyzing : dictionary.startAnalysis}
						{!uploading && <Upload className='ml-2 h-4 w-4' />}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

interface UploadPageProps {
	params: Promise<{ locale: string }>;
	dictionary: UploadDict;
}

export default async function UploadPage({ params }: UploadPageProps) {
	const resolvedParams = await params;
	const locale = resolvedParams.locale;
	const validLocale: Locale = (locales.includes(locale as Locale) ? locale : 'en') as Locale;

	// Server-side dictionary loading
	let dictionary: UploadDict | null = null;
	try {
		const dictModule = await import(`@/locales/${validLocale}/common.json`);
		dictionary = dictModule.default.upload;
	} catch (error) {
		console.error('Failed to load dictionary for locale:', validLocale);
		// Fallback to English
		const fallbackModule = await import('@/locales/en/common.json');
		dictionary = fallbackModule.default.upload;
	}

	if (!dictionary) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='flex justify-center items-center min-h-[400px]'>
					<div className='animate-pulse text-muted-foreground'>Loading...</div>
				</div>
			</div>
		);
	}

	return <UploadForm dictionary={dictionary} locale={validLocale} />;
}
