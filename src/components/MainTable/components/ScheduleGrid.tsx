import type { ReactNode } from 'react';
import { useEffect } from 'react';
import MainTableHeader from './MainTableHeader';
import useStockStore from '../../../store/useStockStore';

type ScheduleGridProps = {
	headerContent: ReactNode;
	children: ReactNode;
};

const ScheduleGrid = ({ headerContent, children }: ScheduleGridProps) => {
	// Получаем данные напрямую из хранилищ
	const { timeSlots, fetchTimeSlots } = useStockStore();

	// Загружаем данные при монтировании компонента
	useEffect(() => {
		fetchTimeSlots();
	}, [fetchTimeSlots]);

	// Если данные ещё не загружены, показываем заглушку
	if (timeSlots.length === 0) {
		return <div className='loading'>Loading time slots...</div>;
	}

	return (
		<div
			className='main_table__container'
			style={{ gridTemplateColumns: `auto repeat(${timeSlots.length}, 1fr)` }}
		>
			<div className='main_table__header'>{headerContent}</div>
			<MainTableHeader />
			{children}
		</div>
	);
};

export default ScheduleGrid;
