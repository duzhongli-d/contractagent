import Link from 'next/link';

interface PrivacyDict {
	title: string;
	lastUpdated: string;
	introduction: string;
	introductionText: string;
	informationCollect: string;
	informationCollectText: string;
	personalInfo: string;
	documentInfo: string;
	usageInfo: string;
	howWeUse: string;
	howWeUseText: string;
	provideServices: string;
	processTransactions: string;
	respondRequests: string;
	sendNotices: string;
	monitorTrends: string;
	detectIssues: string;
	protectActivity: string;
	documentSecurity: string;
	documentSecurityText: string;
	documentRetentionText: string;
	sharing: string;
	sharingText: string;
	serviceProviders: string;
	legalRequirements: string;
	businessTransfers: string;
	noSell: string;
	yourRights: string;
	yourRightsText: string;
	accessRight: string;
	correctionRight: string;
	deletionRight: string;
	restrictionRight: string;
	portabilityRight: string;
	exerciseRights: string;
	cookies: string;
	cookiesText: string;
	dataSecurity: string;
	dataSecurityText: string;
	securityNote: string;
	internationalTransfers: string;
	internationalTransfersText: string;
	safeguardsText: string;
	childrenPrivacy: string;
	childrenPrivacyText: string;
	changes: string;
	changesText: string;
	contact: string;
	contactText: string;
}

interface PrivacyPageProps {
	params: Promise<{ locale: string }>;
}

export default async function PrivacyPage(props: PrivacyPageProps) {
	const resolvedParams = await props.params;
	const locale = resolvedParams.locale;
	const dictModule = await import(`@/locales/${locale}/common.json`);
	const dict: PrivacyDict = dictModule.default.legal.privacy;

	return (
		<div className='container mx-auto px-4 py-12'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-3xl font-serif font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8'>
					{dict.title}
				</h1>

				<div className='prose prose-slate max-w-none'>
					<p>{dict.lastUpdated}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.introduction}</h2>
					<p>{dict.introductionText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.informationCollect}</h2>
					<p>{dict.informationCollectText}</p>
					<ul className='list-disc pl-6 mb-4'>
						<li><strong>Personal Information:</strong> {dict.personalInfo}</li>
						<li><strong>Document Information:</strong> {dict.documentInfo}</li>
						<li><strong>Usage Information:</strong> {dict.usageInfo}</li>
					</ul>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.howWeUse}</h2>
					<p>{dict.howWeUseText}</p>
					<ul className='list-disc pl-6 mb-4'>
						<li>{dict.provideServices}</li>
						<li>{dict.processTransactions}</li>
						<li>{dict.respondRequests}</li>
						<li>{dict.sendNotices}</li>
						<li>{dict.monitorTrends}</li>
						<li>{dict.detectIssues}</li>
						<li>{dict.protectActivity}</li>
					</ul>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.documentSecurity}</h2>
					<p>{dict.documentSecurityText}</p>
					<p>{dict.documentRetentionText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.sharing}</h2>
					<p>{dict.sharingText}</p>
					<ul className='list-disc pl-6 mb-4'>
						<li><strong>Service Providers:</strong> {dict.serviceProviders}</li>
						<li><strong>Legal Requirements:</strong> {dict.legalRequirements}</li>
						<li><strong>Business Transfers:</strong> {dict.businessTransfers}</li>
					</ul>
					<p>{dict.noSell}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.yourRights}</h2>
					<p>{dict.yourRightsText}</p>
					<ul className='list-disc pl-6 mb-4'>
						<li>{dict.accessRight}</li>
						<li>{dict.correctionRight}</li>
						<li>{dict.deletionRight}</li>
						<li>{dict.restrictionRight}</li>
						<li>{dict.portabilityRight}</li>
					</ul>
					<p>{dict.exerciseRights}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.cookies}</h2>
					<p>{dict.cookiesText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.dataSecurity}</h2>
					<p>{dict.dataSecurityText}</p>
					<p>{dict.securityNote}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.internationalTransfers}</h2>
					<p>{dict.internationalTransfersText}</p>
					<p>{dict.safeguardsText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.childrenPrivacy}</h2>
					<p>{dict.childrenPrivacyText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.changes}</h2>
					<p>{dict.changesText}</p>

					<h2 className='text-2xl font-semibold mt-8 mb-4'>{dict.contact}</h2>
					<p>{dict.contactText}</p>
					<p>
						LegalEdge
						<br />
						上海xx科技有限公司
						<br />
						地址：上海xx街xx号
						<br />
						Email: eric.du@halooffice.com
						<br />
						Phone: +86 180 1792 6742
					</p>
				</div>
			</div>
		</div>
	);
}
