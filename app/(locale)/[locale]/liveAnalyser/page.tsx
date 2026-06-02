import ContractUploader from '@/components/ContractUploader';
import { Locale } from '@/lib/i18n/config';

export default async function liveAnalyserPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const dict = await import(`@/locales/${locale}/common.json`);

	return (
		<div>
			<ContractUploader dictionary={dict.default.liveAnalyser} />
		</div>
	);
}
