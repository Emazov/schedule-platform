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
			<div className={styles.table_header}>
				<select
					className={styles.select}
					value={selectedDay}
					onChange={onDayChange}
				>
					{days.map((day) => (
						<option key={day.id} value={day.id}>
							{day.code}
						</option>
					))}
				</select>
			</div>
			{timeSlots.map((timeSlot) => (
				<div key={timeSlot.id} className={styles.table_header}>
					{timeSlot.slot} Hour <br />
					{timeSlot.start} - {timeSlot.end}
				</div>
			))}
		</>
	);
};
