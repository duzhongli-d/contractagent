'use client';
import { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { sendEmail } from '@/app/actions/resend';
import { Locale, locales } from '@/lib/i18n/config';
import { COMPANY_INFO } from '@/config';

interface ContactDict {
	title: string;
	subtitle: string;
	email: string;
	support: string;
	sales: string;
	phone: string;
	phoneUnavailable: string;
	hours: string;
	sendMessage: string;
	fillForm: string;
	firstName: string;
	lastName: string;
	emailField: string;
	phoneOptional: string;
	inquiryType: string;
	selectInquiry: string;
	general: string;
	supportOption: string;
	billingOption: string;
	partnership: string;
	message: string;
	placeholderMessage: string;
	send: string;
	availability: string;
	availabilityDesc: string;
	weekdays: string;
	time: string;
	urgent: string;
	success: string;
	error: string;
}

type ContactFormState = {
	success: boolean;
	data: any;
	error: any;
};

function ContactForm({ dictionary }: { dictionary: ContactDict }) {
	const [response, formAction, isPending] = useActionState(sendEmail, {
		success: false,
		data: null,
		error: undefined,
	} as ContactFormState);

	return (
		<div className='container mx-auto px-4 py-12'>
			<div className='text-center mb-12'>
				<h1 className='text-3xl font-serif font-bold tracking-tighter sm:text-4xl md:text-5xl'>
					{dictionary.title}
				</h1>
				<p className='mt-4 text-muted-foreground max-w-2xl mx-auto'>
					{dictionary.subtitle}
				</p>
			</div>

			<div className='grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12'>
				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='flex items-center'>
							<Mail className='mr-2 h-5 w-5 text-primary' />
							{dictionary.email}
						</CardTitle>
					</CardHeader>
					<CardContent className=''>
						<h3>{dictionary.support}</h3>
						<Link
							href={`mailto:${COMPANY_INFO.supportEmail}`}
							className='text-muted-foreground hover:text-primary'>
							{COMPANY_INFO.email}
						</Link>
						<br />
						<h3>{dictionary.sales}</h3>
						<Link
							href={`mailto:${COMPANY_INFO.salesEmail}`}
							className='text-muted-foreground hover:text-primary'>
							{COMPANY_INFO.email}
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='flex items-center'>
							<Phone className='mr-2 h-5 w-5 text-primary' />
							{dictionary.phone}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-muted-foreground line-through'>{dictionary.phoneUnavailable}</p>
						<p className='text-muted-foreground'>{dictionary.hours}</p>
					</CardContent>
				</Card>
			</div>

			<div className='grid gap-8 md:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>{dictionary.sendMessage}</CardTitle>
						<CardDescription>
							{dictionary.fillForm}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form action={formAction} className='space-y-4'>
							<div className='grid gap-4 md:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='firstName'>{dictionary.firstName}</Label>
									<Input id='firstName' name='firstName' placeholder='John' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='lastName'>{dictionary.lastName}</Label>
									<Input id='lastName' name='lastName' placeholder='Doe' />
								</div>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='email'>{dictionary.emailField}</Label>
								<Input
									id='email'
									name='email'
									type='email'
									placeholder='john.doe@example.com'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='phone'>{dictionary.phoneOptional}</Label>
								<Input
									id='phone'
									name='phone'
									type='tel'
									placeholder='+86 234 567 8900'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='inquiry-type'>{dictionary.inquiryType}</Label>
								<Select defaultValue='general' name='inq_type'>
									<SelectTrigger id='inquiry-type' name='inq_type'>
										<SelectValue placeholder={dictionary.selectInquiry} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='general'>
											{dictionary.general}
										</SelectItem>
										<SelectItem value='sales'>{dictionary.sales}</SelectItem>
										<SelectItem value='support'>{dictionary.supportOption}</SelectItem>
										<SelectItem value='billing'>{dictionary.billingOption}</SelectItem>
										<SelectItem value='partnership'>{dictionary.partnership}</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='message'>{dictionary.message}</Label>
								<Textarea
									id='message'
									name='message'
									placeholder={dictionary.placeholderMessage}
									className='min-h-[120px]'
								/>
							</div>
							<Button type='submit' disabled={isPending} className='w-full'>
								{isPending ? (
									<span className='flex items-center gap-2'>
										<svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
											<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
											<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
										</svg>
										{dictionary.send}...
									</span>
								) : (
									dictionary.send
								)}
							</Button>
						</form>
						{response.success && (
							<div className='mt-4 p-4 bg-green-50 text-green-700 rounded-lg'>
								<p>{dictionary.success}</p>
							</div>
						)}
						{response.error !== undefined && (
							<div className='mt-4 p-4 bg-red-50 text-red-700 rounded-lg'>
								<p>{dictionary.error}</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{dictionary.availability}</CardTitle>
						<CardDescription>
							{dictionary.availabilityDesc}
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='flex items-start space-x-3'>
							<Clock className='h-5 w-5 text-primary mt-0.5' />
							<div>
								<p className='font-medium'>{dictionary.weekdays}</p>
								<p className='text-muted-foreground'>{dictionary.time}</p>
							</div>
						</div>
						<div className='pt-4 border-t'>
							<p className='text-sm text-muted-foreground'>
								{dictionary.urgent}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

interface ContactPageProps {
	params: Promise<{ locale: string }>;
	dictionary: ContactDict;
}

export default async function ContactPage({ params }: ContactPageProps) {
	const resolvedParams = await params;
	const locale = resolvedParams.locale;
	const validLocale: Locale = (locales.includes(locale as Locale) ? locale : 'en') as Locale;

	// Server-side dictionary loading
	let dictionary: ContactDict | null = null;
	try {
		const dictModule = await import(`@/locales/${validLocale}/common.json`);
		dictionary = dictModule.default.contact;
	} catch (error) {
		console.error('Failed to load dictionary for locale:', validLocale);
		// Fallback to English
		const fallbackModule = await import('@/locales/en/common.json');
		dictionary = fallbackModule.default.contact;
	}

	if (!dictionary) {
		return (
			<div className='container mx-auto px-4 py-12'>
				<div className='flex justify-center items-center min-h-[400px]'>
					<div className='animate-pulse text-muted-foreground'>Loading...</div>
				</div>
			</div>
		);
	}

	return <ContactForm dictionary={dictionary} />;
}
