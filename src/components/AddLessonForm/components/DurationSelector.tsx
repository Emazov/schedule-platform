import React from 'react';

type DurationOption = {
	value: number;
	available: boolean;
};

type DurationSelectorProps = {
	duration: number;
	availableDurations: DurationOption[];
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	error?: string;
};

/**
 * Component for selecting lesson duration
 * Shows available and unavailable duration options
 */
const DurationSelector: React.FC<DurationSelectorProps> = ({
	duration,
	availableDurations,
	onChange,
	error,
}) => {
	return (
		<div className='form-group'>
			<label>Duration (hours)</label>
			<select className='form-select' value={duration} onChange={onChange}>
				{availableDurations.map(({ value, available }) => (
					<option
						key={value}
						value={value}
						disabled={!available}
						className={!available ? 'disabled-option' : ''}
					>
						{value} {!available ? '(unavailable)' : ''}
					</option>
				))}
			</select>
			{error && <div className='error-message'>{error}</div>}
		</div>
	);
};

export default DurationSelector;
