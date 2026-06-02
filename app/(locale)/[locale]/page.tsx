import {
	ArrowRight,
	CheckCircle,
	Shield,
	Clock,
	Brain,
	Upload,
	Search,
	FileCheck,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { Locale, defaultLocale } from '@/lib/i18n/config';

type PageProps = {
	params: any;
};

export default async function Home({ params }: PageProps) {
	const { locale } = await params;
	const validLocale: Locale = (locale as Locale) || defaultLocale;
	const dict = await getDictionary(validLocale);

	return (
		<div className='flex min-h-screen flex-col'>
			<main className='flex-1'>
				{/* Hero Section */}
				<section className='relative overflow-hidden py-24 md:py-40 bg-gradient-to-b from-background to-background/80'>
					{/* Decorative background elements */}
					<div className='absolute inset-0 overflow-hidden pointer-events-none'>
						<div className='absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse'></div>
						<div className='absolute bottom-20 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>
						<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/3 to-blue-600/3 rounded-full blur-3xl'></div>
					</div>
					<div className='container px-4 md:px-8 relative'>
						<div className='grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20 items-center'>
							<div className='flex flex-col justify-center space-y-8'>
								<div className='space-y-4'>
									<h1 className='text-4xl font-serif font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-6xl leading-tight'>
										<span className='text-foreground'>{dict.hero.title}:</span>
										<br />
										<span className='text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600 animate-gradient'>
											{dict.hero.subtitle}
										</span>
									</h1>
									<p className='max-w-[600px] text-muted-foreground md:text-xl leading-relaxed'>
										{dict.hero.description}
									</p>
								</div>
								<div className='flex flex-col gap-4 min-[400px]:flex-row'>
									<Link href={`/${validLocale}/liveAnalyser`}>
										<Button
											size='lg'
											className='bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 h-12 px-8 text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>
											{dict.hero.analyzeButton}{' '}
											<ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
										</Button>
									</Link>
									<Link href={`/${validLocale}/upload`}>
										<Button size='lg' variant='outline' className='border-2 hover:bg-accent transition-colors h-12 px-8 text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>
											{dict.hero.viewDemo}
										</Button>
									</Link>
								</div>
								{/* Trust indicators */}
								<div className='flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 text-sm text-muted-foreground'>
									<div className='flex items-center gap-2'>
										<Shield className='h-5 w-5 text-primary' />
										<span>{dict.hero.trustIndicators.secure}</span>
									</div>
									<div className='flex items-center gap-2'>
										<Clock className='h-5 w-5 text-primary' />
										<span>{dict.hero.trustIndicators.fast}</span>
									</div>
									<div className='flex items-center gap-2'>
										<Brain className='h-5 w-5 text-primary' />
										<span>{dict.hero.trustIndicators.ai}</span>
									</div>
								</div>
							</div>
							<div className='flex items-center justify-center mt-8 lg:mt-0'>
								<div className='relative h-[280px] w-[280px] md:h-[380px] md:w-[380px]'>
									{/* Animated gradient orb */}
									<div className='absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-600/20 to-indigo-600 rounded-full opacity-40 blur-3xl animate-pulse'></div>
									{/* Floating particles */}
									<div className='absolute top-10 right-10 w-3 h-3 bg-primary/40 rounded-full animate-bounce' style={{ animationDelay: '0s' }}></div>
									<div className='absolute bottom-20 left-10 w-2 h-2 bg-blue-600/40 rounded-full animate-bounce' style={{ animationDelay: '0.5s' }}></div>
									<div className='absolute top-1/3 left-5 w-2.5 h-2.5 bg-indigo-600/40 rounded-full animate-bounce' style={{ animationDelay: '1s' }}></div>
									{/* Main card */}
									<div className='relative h-full w-full'>
										{/* Card glow effect */}
										<div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-600/10 rounded-xl blur-xl'></div>
										<div className='relative h-full w-full rounded-xl border border-border/50 bg-background/80 p-4 backdrop-blur-md shadow-2xl'>
											{/* Inner card with accent border */}
											<div className='flex h-full w-full flex-col items-center justify-center rounded-lg border border-border bg-background/95 p-8 shadow-lg relative overflow-hidden'>
												{/* Decorative accent line */}
												<div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-600 to-indigo-600'></div>
												{/* Icon with glow */}
												<div className='relative mb-6'>
													<div className='absolute inset-0 bg-primary/20 rounded-full blur-xl'></div>
													<div className='relative flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-primary/10 to-blue-600/10 border border-primary/20'>
														<Brain className='h-10 w-10 text-primary' />
													</div>
												</div>
												<div className='space-y-3 text-center relative z-10'>
													<h3 className='text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
														{dict.hero.title}
													</h3>
													<p className='text-sm text-muted-foreground max-w-[280px]'>
														{dict.hero.description}
													</p>
												</div>
												{/* Status indicator */}
												<div className='absolute bottom-4 right-4 flex items-center gap-2 text-xs text-muted-foreground'>
													<span className='relative flex h-2 w-2'>
														<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
														<span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
													</span>
													{dict.hero.trustIndicators.ready}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section id='how-it-works' className='py-16 md:py-24 bg-muted/50'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
									{dict.howItWorks.title}
								</div>
								<h2 className='text-3xl font-serif font-bold tracking-tighter sm:text-4xl md:text-5xl'>
									{dict.howItWorks.heading}
								</h2>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									{dict.howItWorks.description}
								</p>
							</div>
						</div>
						<div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12'>
							<div className='flex flex-col items-center space-y-4 rounded-lg border border-border bg-background p-6 shadow-sm transition-all hover:shadow-md'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
									<Upload className='h-8 w-8 text-primary' />
								</div>
								<h3 className='text-xl font-semibold'>{dict.howItWorks.step1.title}</h3>
								<p className='text-center text-muted-foreground'>
									{dict.howItWorks.step1.description}
								</p>
							</div>
							<div className='flex flex-col items-center space-y-4 rounded-lg border border-border bg-background p-6 shadow-sm transition-all hover:shadow-md'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
									<Search className='h-8 w-8 text-primary' />
								</div>
								<h3 className='text-xl font-semibold'>{dict.howItWorks.step2.title}</h3>
								<p className='text-center text-muted-foreground'>
									{dict.howItWorks.step2.description}
								</p>
							</div>
							<div className='flex flex-col items-center space-y-4 rounded-lg border border-border bg-background p-6 shadow-sm transition-all hover:shadow-md'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
									<FileCheck className='h-8 w-8 text-primary' />
								</div>
								<h3 className='text-xl font-semibold'>{dict.howItWorks.step3.title}</h3>
								<p className='text-center text-muted-foreground'>
									{dict.howItWorks.step3.description}
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Disclaimer banner */}
				<section className='bg-primary text-white'>
					<div className='container px-4 py-4'>
						<p className='text-center text-md'>{dict.disclaimer.title}</p>
						<p className='text-center text-sm'>
							{dict.disclaimer.warning1}
						</p>
						<p className='text-center text-sm'>
							{dict.disclaimer.warning2}
						</p>
					</div>
				</section>

				{/* Key Features */}
				<section id='features' className='py-16 md:py-24'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
									{dict.features.title}
								</div>
								<h2 className='text-3xl font-serif font-bold tracking-tighter sm:text-4xl md:text-5xl'>
									{dict.features.heading}
								</h2>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									{dict.features.description}
								</p>
							</div>
						</div>
						<div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12'>
							<div className='flex flex-col space-y-2'>
								<div className='flex items-center space-x-2'>
									<CheckCircle className='h-5 w-5 text-primary' />
									<h3 className='text-xl font-semibold'>{dict.features.items.riskIdentification.title}</h3>
								</div>
								<p className='text-muted-foreground'>
									{dict.features.items.riskIdentification.description}
								</p>
							</div>
							<div className='flex flex-col space-y-2'>
								<div className='flex items-center space-x-2'>
									<CheckCircle className='h-5 w-5 text-primary' />
									<h3 className='text-xl font-semibold'>{dict.features.items.contextualInsights.title}</h3>
								</div>
								<p className='text-muted-foreground'>
									{dict.features.items.contextualInsights.description}
								</p>
							</div>
							<div className='flex flex-col space-y-2'>
								<div className='flex items-center space-x-2'>
									<CheckCircle className='h-5 w-5 text-primary' />
									<h3 className='text-xl font-semibold'>{dict.features.items.speedAccuracy.title}</h3>
								</div>
								<p className='text-muted-foreground'>
									{dict.features.items.speedAccuracy.description}
								</p>
							</div>
							<div className='flex flex-col space-y-2'>
								<div className='flex items-center space-x-2'>
									<CheckCircle className='h-5 w-5 text-primary' />
									<h3 className='text-xl font-semibold'>{dict.features.items.customizable.title}</h3>
								</div>
								<p className='text-muted-foreground'>
									{dict.features.items.customizable.description}
								</p>
							</div>
							<div className='flex flex-col space-y-2'>
								<div className='flex items-center space-x-2'>
									<CheckCircle className='h-5 w-5 text-primary' />
									<h3 className='text-xl font-semibold'>{dict.features.items.secure.title}</h3>
								</div>
								<p className='text-muted-foreground'>
									{dict.features.items.secure.description}
								</p>
							</div>
							<div className='flex flex-col space-y-2'>
								<div className='flex items-center space-x-2'>
									<CheckCircle className='h-5 w-5 text-primary' />
									<h3 className='text-xl font-semibold'>{dict.features.items.integration.title}</h3>
								</div>
								<p className='text-muted-foreground'>
									{dict.features.items.integration.description}
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Why Choose Our AI */}
				<section id='why-choose' className='py-16 md:py-24 bg-muted/50'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
									{dict.whyChoose.title}
								</div>
								<h2 className='text-3xl font-serif font-bold tracking-tighter sm:text-4xl md:text-5xl'>
									{dict.whyChoose.heading}
								</h2>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									{dict.whyChoose.description}
								</p>
							</div>
						</div>
						<div className='mx-auto max-w-5xl py-12'>
							<Tabs defaultValue='time' className='w-full'>
								<TabsList className='grid w-full grid-cols-2'>
									<TabsTrigger value='time'>{dict.whyChoose.timeSavings}</TabsTrigger>
									<TabsTrigger value='cost'>{dict.whyChoose.costEffectiveness}</TabsTrigger>
								</TabsList>
								<TabsContent value='time' className='p-6 border rounded-lg mt-6'>
									<div className='grid gap-6 lg:grid-cols-2'>
										<div className='flex flex-col space-y-4 p-6 bg-background rounded-lg border'>
											<div className='flex items-center space-x-2'>
												<Clock className='h-5 w-5 text-primary' />
												<h3 className='text-xl font-semibold'>
													{dict.whyChoose.traditional.title}
												</h3>
											</div>
											<p className='text-muted-foreground'>
												{dict.whyChoose.traditional.description}
											</p>
											<div className='text-3xl font-bold'>{dict.whyChoose.traditional.timeValue}</div>
										</div>
										<div className='flex flex-col space-y-4 p-6 bg-background rounded-lg border border-primary'>
											<div className='flex items-center space-x-2'>
												<Brain className='h-5 w-5 text-primary' />
												<h3 className='text-xl font-semibold'>
													{dict.whyChoose.ai.title}
												</h3>
											</div>
											<p className='text-muted-foreground'>
												{dict.whyChoose.ai.description}
											</p>
											<div className='text-3xl font-bold text-primary'>
												{dict.whyChoose.ai.timeValue}
											</div>
										</div>
									</div>
								</TabsContent>
								<TabsContent value='cost' className='p-6 border rounded-lg mt-6'>
									<div className='grid gap-6 lg:grid-cols-2'>
										<div className='flex flex-col space-y-4 p-6 bg-background rounded-lg border'>
											<div className='flex items-center space-x-2'>
												<Clock className='h-5 w-5 text-primary' />
												<h3 className='text-xl font-semibold'>
													{dict.whyChoose.traditional.title}
												</h3>
											</div>
											<p className='text-muted-foreground'>
												{dict.whyChoose.traditional.costDescription}
											</p>
											<div className='text-3xl font-bold'>
												{dict.whyChoose.traditional.costValue}
											</div>
											<p className='text-sm text-muted-foreground'>
												{dict.whyChoose.traditional.costPeriod}
											</p>
										</div>
										<div className='flex flex-col space-y-4 p-6 bg-background rounded-lg border border-primary'>
											<div className='flex items-center space-x-2'>
												<Brain className='h-5 w-5 text-primary' />
												<h3 className='text-xl font-semibold'>
													{dict.whyChoose.ai.title}
												</h3>
											</div>
											<p className='text-muted-foreground'>
												{dict.whyChoose.ai.costDescription}
											</p>
											<div className='text-3xl font-bold text-primary'>
												{dict.whyChoose.ai.costValue}
											</div>
											<p className='text-sm text-muted-foreground'>
												{dict.whyChoose.ai.costPeriod}
											</p>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>
						<div className='mx-auto max-w-3xl space-y-8'>
							<div className='space-y-4'>
								<h3 className='text-2xl font-serif font-bold'>
									{dict.whyChoose.testimonials.title}
								</h3>
								<div className='grid gap-6 md:grid-cols-2'>
									{dict.whyChoose.testimonials.reviews.map((review: any, index: number) => (
										<div key={index} className='rounded-lg border bg-background p-6'>
											<div className='flex items-start space-x-4'>
												<div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
													<span className='text-primary font-semibold'>
														{review.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
													</span>
												</div>
												<div className='space-y-1'>
													<h4 className='font-semibold'>{review.name}</h4>
													<p className='text-sm text-muted-foreground'>
														{review.role}
													</p>
												</div>
											</div>
											<p className='mt-4 text-muted-foreground'>
												"{review.comment}"
											</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className='py-16 md:py-24'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h2 className='text-3xl font-serif font-bold tracking-tighter sm:text-4xl md:text-5xl'>
									{dict.cta.title}
								</h2>
								<p className='max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									{dict.cta.description}
								</p>
							</div>
							<div className='flex flex-col gap-2 min-[400px]:flex-row'>
								<Link href={`/${validLocale}/liveAnalyser`}>
									<Button size='lg' className='bg-primary hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>
										{dict.cta.tryAnalysis}{' '}
										<ArrowRight className='ml-2 h-4 w-4' />
									</Button>
								</Link>
								<Link href={`/${validLocale}/upload`}>
									<Button size='lg' variant='outline' className='focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>
										{dict.cta.viewDemo}
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<section id='faq' className='py-16 md:py-24 bg-muted/50'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
									{dict.faq.title}
								</div>
								<h2 className='text-3xl font-serif font-bold tracking-tighter sm:text-4xl md:text-5xl'>
									{dict.faq.heading}
								</h2>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									{dict.faq.description}
								</p>
							</div>
						</div>
						<div className='mx-auto max-w-3xl py-12'>
							<Accordion type='single' collapsible className='w-full'>
								<AccordionItem value='item-1'>
									<AccordionTrigger>
										{dict.faq.questions.accuracy.question}
									</AccordionTrigger>
									<AccordionContent>
										{dict.faq.questions.accuracy.answer}
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value='item-2'>
									<AccordionTrigger>
										{dict.faq.questions.security.question}
									</AccordionTrigger>
									<AccordionContent>
										{dict.faq.questions.security.answer}
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value='item-3'>
									<AccordionTrigger>
										{dict.faq.questions.documentTypes.question}
									</AccordionTrigger>
									<AccordionContent>
										{dict.faq.questions.documentTypes.answer}
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value='item-4'>
									<AccordionTrigger>
										{dict.faq.questions.jurisdictions.question}
									</AccordionTrigger>
									<AccordionContent>
										{dict.faq.questions.jurisdictions.answer}
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value='item-5'>
									<AccordionTrigger>
										{dict.faq.questions.replacement.question}
									</AccordionTrigger>
									<AccordionContent>
										{dict.faq.questions.replacement.answer}
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value='item-6'>
									<AccordionTrigger>
										{dict.faq.questions.integrations.question}
									</AccordionTrigger>
									<AccordionContent>
										{dict.faq.questions.integrations.answer}
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
