import { formatAmountForDisplay, amountOfTokensForPurchase } from '@/utils/stripeHelpers';

export default function CustomDonationInput({
	name,
	min,
	max,
	currency,
	step,
	onChange,
	value,
	className,
}: {
	name: string;
	min: number;
	max: number;
	currency: string;
	step: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value: number;
	className?: string;
}) {
	return (
		<label>
			Kjøp {amountOfTokensForPurchase(value)} tokens for {formatAmountForDisplay(value, currency)} 
            {/* ({formatAmountForDisplay(min, currency)}- */}
			{/* {formatAmountForDisplay(max, currency)}): */}
			<input
				type='range'
				name={name}
				min={min}
				max={max}
				step={step}
				onChange={onChange}
				value={value}
				className={className}></input>
		</label>
	);
}
