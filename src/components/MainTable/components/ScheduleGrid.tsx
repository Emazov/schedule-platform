import type { ReactNode } from 'react';
import type { TimeSlot } from '../../../types/types';
import MainTableHeader from './MainTableHeader';

type ScheduleGridProps = {
	timeSlots: TimeSlot[];
	headerContent: ReactNode;
	children: ReactNode;
};

const ScheduleGrid = ({
	timeSlots,
	headerContent,
	children,
}: ScheduleGridProps) => {
	return (
		<div
			className='main_table__container'
			style={{ gridTemplateColumns: `auto repeat(${timeSlots.length}, 1fr)` }}
		>
			<div className='main_table__header'>{headerContent}</div>
			<MainTableHeader timeSlots={timeSlots} />
			{children}
		</div>
	);
};

export default ScheduleGrid;
