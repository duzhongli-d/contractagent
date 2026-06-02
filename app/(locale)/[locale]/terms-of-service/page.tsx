import Link from 'next/link';

interface TermsDict {
	title: string;
	effectiveDate: string;
	welcome: string;
	agreement: string;
	serviceDescription: string;
	serviceDescriptionText: string;
	eligibility: string;
	eligibilityText: string;
	account: string;
	accountText: string;
	acceptableUse: string;
	acceptableUseText: string;
	unlawful: string;
	noRight: string;
	reverseEngineer: string;
	disrupt: string;
	userContent: string;
	userContentText: string;
	note: string;
	intellectualProperty: string;
	intellectualPropertyText: string;
	disclaimer: string;
	disclaimerText: string;
	noWarranties: string;
	noWarrantiesText: string;
	limitation: string;
	limitationText: string;
	termination: string;
	terminationText: string;
	modifications: string;
	modificationsText: string;
	governingLaw: string;
	governingLawText: string;
	contact: string;
	contactText: string;
	moreInfo: string;
}

interface TermsPageProps {
	params: Promise<{ locale: string }>;
}

export default async function TermsOfServicePage(props: TermsPageProps) {
	const resolvedParams = await props.params;
	const locale = resolvedParams.locale;
	const dictModule = await import(`@/locales/${locale}/common.json`);
	const dict: TermsDict = dictModule.default.legal.terms;

	return (
		<div className='container mx-auto px-4 py-12'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-3xl font-serif font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8'>
					{dict.title}
				</h1>

				<div className='prose prose-slate max-w-none'>
					<p>{dict.effectiveDate}</p>

					<p className='mt-4'>{dict.welcome}</p>
					<p>{dict.agreement}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.serviceDescription}</h2>
					<p>{dict.serviceDescriptionText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.eligibility}</h2>
					<p>{dict.eligibilityText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.account}</h2>
					<p>{dict.accountText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.acceptableUse}</h2>
					<p>{dict.acceptableUseText}</p>
					<ul className='list-disc pl-6 mb-4'>
						<li>{dict.unlawful}</li>
						<li>{dict.noRight}</li>
						<li>{dict.reverseEngineer}</li>
						<li>{dict.disrupt}</li>
					</ul>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.userContent}</h2>
					<p>{dict.userContentText}</p>
					<div className='bg-muted/30 p-4 rounded-md my-4'>
						<p className='italic'>
							<strong>{dict.note}</strong>
						</p>
					</div>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.intellectualProperty}</h2>
					<p>{dict.intellectualPropertyText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.disclaimer}</h2>
					<p>{dict.disclaimerText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.noWarranties}</h2>
					<p>{dict.noWarrantiesText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.limitation}</h2>
					<p>{dict.limitationText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.termination}</h2>
					<p>{dict.terminationText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.modifications}</h2>
					<p>{dict.modificationsText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.governingLaw}</h2>
					<p>{dict.governingLawText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.contact}</h2>
					<p>{dict.contactText}</p>
					<p>
						上海xx科技有限公司
						<br />
						地址：上海xx街xx号
						<br />
						Email: eric.du@halooffice.com
						<br />
						Phone: +86180 1792 6742
					</p>

					<div className='border-t border-border mt-8 pt-8'>
						<p>
							{dict.moreInfo}{' '}
							<Link href={`/${locale}/privacy-policy`} className='text-primary hover:underline'>
								Privacy Policy
							</Link>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
