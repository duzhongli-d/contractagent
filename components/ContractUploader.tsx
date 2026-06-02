'use client';
import { useState } from 'react';
import { analyzeTXTContract } from '@/app/actions/analyzeContractsTXT';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import DisclaimerModal from './DisclaimerModal';
import { Button } from './ui/button';
import { Spinner } from './ui/Spinner';
import { AlertTriangle, CheckCircle, Info, FileText, Upload, Check, Shield } from 'lucide-react';
import { toast } from 'sonner';

// Define types for response data
interface ContractAnalysisResult {
	data?: {
		content: Array<{
			text: {
				value: string;
			};
		}>;
	} | null;
	error?: string | null;
}

interface ParsedAnalysisResult {
	contract_type?: string;
	critical_clauses?: string[];
	suggestions?: string[];
	unusual_clauses?: string[];
}

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

interface liveAnalyserDict {
	upload: {
		title: string;
		description: string;
		selectFile: string;
		analyzing: string;
		analyze: string;
		disclaimer: string;
	};
	results: {
		title: string;
		subtitle: string;
		error: string;
		risks: string;
		suggestions: string;
		unusual: string;
		totalAnalyzed: string;
		pages: string;
		words: string;
		documentTab: string;
		feedbackTab: string;
		risk: string;
		suggestion: string;
		unusualClause: string;
		section: string;
		downloadReport: string;
		uploadNew: string;
	};
	disclaimerModal: DisclaimerDict;
}

interface ContractUploaderProps {
	dictionary: liveAnalyserDict;
}

export default function ContractUploader({ dictionary }: ContractUploaderProps) {
	const [file, setFile] = useState<File | null>(null);
	const [result, setResult] = useState<ContractAnalysisResult | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [accepted, setAccepted] = useState<boolean>(false);
	const [parsedResult, setParsedResult] = useState<ParsedAnalysisResult | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setFile(event.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) {
			toast.error(dictionary.upload.selectFile || 'Please select a file first.');
			return;
		}
        if (!accepted) {
			toast.error(dictionary.upload.disclaimer || 'Please accept the disclaimer first.');
            return;
        }

		setLoading(true);
		setResult(null); // Clear previous results
		const formData = new FormData();
		formData.append('contract', file);

		try {
			const response = (await analyzeTXTContract(formData)) as ContractAnalysisResult;
			setResult(response);

			// Safely parse the JSON response
			try {
				if (response.data?.content?.[0]?.text?.value) {
					const parsed = JSON.parse(response.data.content[0].text.value);
					setParsedResult(parsed);
				} else if (response.error) {
					// Error is already set in response
					setParsedResult(null);
				} else {
					console.error('Invalid response format:', response);
					setParsedResult(null);
				}
			} catch (parseError) {
				console.error('Failed to parse analysis result:', parseError);
				setParsedResult(null);
			}
		} catch (error) {
			// Handle server action errors
			console.error('Analysis failed:', error);
			setResult({
				error: error instanceof Error ? error.message : 'An unexpected error occurred during analysis.',
				data: null
			});
			setParsedResult(null);
		} finally {
			setLoading(false);
		}
	};

    if (result?.error) {
        return (
            <div className='container mx-auto p-4'>
                <Card className='max-w-lg mx-auto my-8 px-4 py-8'>
                    <CardHeader>
                        <h2 className='text-2xl font-bold mb-4'>{dictionary.results.error || 'Error'}</h2>
                    </CardHeader>
                    <CardContent>
                        <p>{result.error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

	return (
		<div className='container mx-auto p-4'>
			{!accepted && <DisclaimerModal onAccept={() => setAccepted(true)} dictionary={dictionary.disclaimerModal} />}
			<Card className='max-w-lg mx-auto my-8 px-4 py-8'>
				<CardHeader>
					<CardTitle className='text-2xl font-bold'>{dictionary.upload.title}</CardTitle>
					<CardDescription>
						{dictionary.upload.description}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='relative mb-4'>
						<input
							type='file'
							accept='application/pdf'
							onChange={handleFileChange}
							disabled={loading}
							className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
							id='contract-file'
						/>
						<Button
							type='button'
							variant='outline'
							asChild
							className='w-full cursor-pointer'>
							<label htmlFor='contract-file' className='flex items-center justify-center cursor-pointer'>
								<Upload className='mr-2 h-4 w-4' />
								{file ? file.name : dictionary.upload.selectFile}
							</label>
						</Button>
					</div>
					{file && (
						<div className='flex items-center space-x-2 my-2 text-sm text-muted-foreground'>
							<FileText size={16} />
							<span>{file.name}</span>
						</div>
					)}
					{/* Disclaimer Status Indicator */}
					<div className={`flex items-center gap-2 my-3 p-3 rounded-lg text-sm ${accepted ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
						{accepted ? (
							<>
								<Check size={16} className='text-green-600' />
								<span>{dictionary.disclaimerModal.checkbox}</span>
							</>
						) : (
							<>
								<Shield size={16} className='text-yellow-600' />
								<span>{dictionary.disclaimerModal.title}</span>
							</>
						)}
					</div>
					<Button
						onClick={handleUpload}
						disabled={loading || !file || !accepted}
						className='w-full mb-4'>
						{loading ? (
							<span className='flex items-center justify-center gap-2'>
								<Spinner className='h-4 w-4 animate-spin' />
								{dictionary.upload.analyzing}
							</span>
						) : (
							dictionary.upload.analyze
						)}
					</Button>
					<div className='w-full flex justify-center'>
						<Button
							type='button'
							variant='ghost'
							size='sm'
							className='mx-auto focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md text-muted-foreground hover:text-foreground'
							onClick={() => setAccepted(false)}>
							{accepted ? (
								<>
									<Check size={14} className='mr-1' />
									{dictionary.upload.disclaimer}
								</>
							) : (
								<>
									<Shield size={14} className='mr-1' />
									{dictionary.upload.disclaimer}
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
			{result && parsedResult && (
				<div className='mt-4 p-4 bg-gray-100 rounded-lg'>
					<h3 className='text-xl font-semibold mb-2'>{dictionary.results.title}: {parsedResult.contract_type}</h3>
					<h2 className='text-lg font-semibold mt-6'>{dictionary.results.documentTab}</h2>
					{parsedResult.critical_clauses?.map((clause: string, index: number) => {
						return (
							<div className='my-4' key={`${index}critical`}>
								<h3 className='font-semibold flex items-center'>
									<AlertTriangle className='h-5 w-5 text-yellow-500 mr-2' />
									{dictionary.results.risk} {index + 1}
								</h3>
								<p>{clause}</p>
							</div>
						);
					})}
					<h2 className='text-lg font-semibold mt-6'>{dictionary.results.suggestion}</h2>
					{parsedResult.suggestions?.map((suggestion: string, index: number) => {
						return (
							<div className='my-4' key={`${index}suggestions`}>
								<h3 className='font-semibold flex items-center'>
									<CheckCircle className='h-5 w-5 text-green-500 mr-2' />
									{dictionary.results.suggestion} {index + 1}
								</h3>
								<p>{suggestion}</p>
							</div>
						);
					})}
					<h2 className='text-lg font-semibold mt-6'>{dictionary.results.unusualClause}</h2>
					{parsedResult.unusual_clauses?.map((clause: string, index: number) => {
						return (
							<div className='my-4' key={`${index}unusual`}>
								<h3 className='font-semibold flex items-center'>
									<Info className='h-5 w-5 text-blue-500 mr-2' />
									{dictionary.results.unusualClause} {index + 1}
								</h3>
								<p>{clause}</p>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
