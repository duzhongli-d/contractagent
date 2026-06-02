import Link from 'next/link';
import { Shield } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

type FooterProps = {
	dictionary: any;
};

export default function Footer({ dictionary }: FooterProps) {
	const { locale } = useLocale();

	const getLocalizedHref = (href: string) => {
		if (href === '/') return `/${locale}`;
		return `/${locale}${href}`;
	};

	return (
		<footer className='border-t bg-background'>
			<div className='container px-4 py-12 md:px-6 md:py-16 lg:py-20'>
				<div className='grid gap-8 lg:grid-cols-4'>
					<div className='space-y-4'>
						<div className='flex items-center gap-2'>
							<Shield className='h-6 w-6 text-primary' />
							<span className='text-xl font-semibold tracking-tight'>LegalEdge</span>
						</div>
						<p className='text-sm text-muted-foreground'>
							{dictionary.footer.description}
						</p>
						<div className='flex space-x-4'>
							<Link href='#' className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='h-5 w-5'>
									<path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'></path>
									<rect width='4' height='12' x='2' y='9'></rect>
									<circle cx='4' cy='4' r='2'></circle>
								</svg>
								<span className='sr-only'>LinkedIn</span>
							</Link>
							<Link href='#' className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='h-5 w-5'>
									<path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'></path>
								</svg>
								<span className='sr-only'>Twitter</span>
							</Link>
						</div>
					</div>
					<div className='space-y-4'>
						<h4 className='text-sm font-semibold'>{dictionary.footer.quickLinks}</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link
									href='#features'
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.features.title}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.footer.pricing}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.footer.caseStudies}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.footer.documentation}
								</Link>
							</li>
						</ul>
					</div>
					<div className='space-y-4'>
						<h4 className='text-sm font-semibold'>{dictionary.footer.company}</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.footer.aboutUs}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.footer.blog}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.footer.careers}
								</Link>
							</li>
							<li>
								<Link
									href={getLocalizedHref('/contact')}
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.footer.contact}
								</Link>
							</li>
						</ul>
					</div>
					<div className='space-y-4'>
						<h4 className='text-sm font-semibold'>{dictionary.footer.legal}</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link
									href={getLocalizedHref('/terms-of-service')}
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.footer.terms}
								</Link>
							</li>
							<li>
								<Link
									href={getLocalizedHref('/privacy-policy')}
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.footer.privacy}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.footer.security}
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'>
									{dictionary.footer.compliance}
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className='mt-12 border-t pt-8 text-center text-sm text-muted-foreground'>
					<p>© 2026 LegalEdge. {dictionary.footer.copyright}</p>
				</div>
			</div>
		</footer>
	);
}
