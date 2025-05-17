import type { TimeSlot } from '../../../types/types';

type MainTableHeaderProps = {
	timeSlots: TimeSlot[];
};

const MainTableHeader = ({ timeSlots }: MainTableHeaderProps) => {
	return (
		<>
			{timeSlots.map((time) => (
				<div key={time.slot} className='main_table__header'>
					{time.slot} <br /> {time.start}-{time.end}
				</div>
			))}
		</>
	);
};

export default MainTableHeader;
