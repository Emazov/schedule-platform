
import styles from '@/components/MainTable/MainTable.module.css';

import useStockStore from '@/store/useStockStore';


export const TableHeader = () => {
	const timeSlots = useStockStore((state) => state.timeSlots);

	return (
		<>
			<div className={`${styles.table_header} ${styles.day_selector}`}>
				Group
			</div>
			{timeSlots.map((timeSlot) => (
				<div
					key={timeSlot.id}
					className={`${styles.table_header} ${styles.time_slot_header}`}
					title={`Time slot: ${timeSlot.start} - ${timeSlot.end}`}
				>
					<span className={styles.time_slot_number}>{timeSlot.slot} hour</span>
					<span className={styles.time_slot_range}>
						{timeSlot.start} - {timeSlot.end}
					</span>
				</div>
			))}
		</>
	);
};
