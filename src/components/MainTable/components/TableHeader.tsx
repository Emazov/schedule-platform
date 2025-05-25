import React from 'react';
import styles from '@/components/MainTable/MainTable.module.css';

import type { Id } from '@/types/types';
import useStockStore from '@/store/useStockStore';

type TableHeaderProps = {
	selectedDay: Id;
	onDayChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const TableHeader = ({ selectedDay, onDayChange }: TableHeaderProps) => {
	const days = useStockStore((state) => state.days);
	const timeSlots = useStockStore((state) => state.timeSlots);

	return (
		<>
			<div className={`${styles.table_header} ${styles.day_selector}`}>
				<select
					id='day-select'
					className={`${styles.select} ${styles.day_select}`}
					value={selectedDay}
					onChange={onDayChange}
					title='Select day of the week'
				>
					{days.map((day) => (
						<option key={day.id} value={day.id}>
							{day.code}
						</option>
					))}
				</select>
			</div>
			{timeSlots.map((timeSlot) => (
				<div
					key={timeSlot.id}
					className={`${styles.table_header} ${styles.time_slot_header}`}
					title={`Time slot: ${timeSlot.start} - ${timeSlot.end}`}
				>
					<span className={styles.time_slot_number}>{timeSlot.slot}</span>
					<span className={styles.time_slot_range}>
						{timeSlot.start} - {timeSlot.end}
					</span>
				</div>
			))}
		</>
	);
};
