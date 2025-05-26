import React from 'react';
import styles from '@MainTable/MainTable.module.css';
import { DayRow } from './DayRow';

import type { Schedule } from '@/types/types';
import useStockStore from '@/store/useStockStore';
import useGroupsStore from '@/store/useGroupsStore';

type GroupViewProps = {
	selectedGroup: number;
	filteredSchedule: Schedule[];
	onGroupChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	onBackToNormalView: () => void;
	role: string;
};

export const GroupView = ({
	selectedGroup,
	filteredSchedule,
	onGroupChange,
	onBackToNormalView,
	role,
}: GroupViewProps) => {
	const days = useStockStore((state) => state.days);
	const timeSlots = useStockStore((state) => state.timeSlots);
	const groups = useGroupsStore((state) => state.groups);

	const group = groups.find((g) => g.id === selectedGroup);

	if (!group) {
		return null;
	}

	return (
		<React.Fragment>
			<div className={styles.table_filters}>
				<select
					value={selectedGroup}
					onChange={onGroupChange}
					className={styles.select}
				>
					{groups
						.filter((g) => g.departmentId === group.departmentId)
						.map((g) => (
							<option key={g.id} value={g.id}>
								{g.code} {g.year} {g?.subgroup}
							</option>
						))}
				</select>
				<button onClick={onBackToNormalView} className={styles.table_filter}>
					back
				</button>
			</div>

			<div
				className={styles.container}
				style={{ gridTemplateColumns: `auto repeat(${timeSlots.length}, 1fr)` }}
			>
				<div className={`${styles.table_header} ${styles.day_selector}`}>
					DAY
				</div>
				{timeSlots.map((timeSlot) => (
					<div
						key={timeSlot.id}
						className={`${styles.table_header} ${styles.time_slot_header}`}
					>
						<span className={styles.time_slot_number}>
							{timeSlot.slot} hour
						</span>
						<span className={styles.time_slot_range}>
							{timeSlot.start} - {timeSlot.end}
						</span>
					</div>
				))}

				{days.map((day) => (
					<DayRow
						key={day.id}
						day={day}
						group={group}
						filteredSchedule={filteredSchedule}
						role={role}
					/>
				))}
			</div>
		</React.Fragment>
	);
};
