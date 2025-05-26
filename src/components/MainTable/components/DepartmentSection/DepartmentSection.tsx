import React from 'react';
import styles from '@MainTable/MainTable.module.css';
import { GroupRow } from './GroupRow';

import type { Department, Schedule } from '@/types/types';
import useGroupsStore from '@/store/useGroupsStore';

type DepartmentSectionProps = {
	department: Department;
	filteredSchedule: Schedule[];
	onGroupSelect: (groupId: number) => void;
	role: string;
	selectedDay: number;
};

export const DepartmentSection = ({
	department,
	filteredSchedule,
	onGroupSelect,
	role,
	selectedDay,
}: DepartmentSectionProps) => {
	const groups = useGroupsStore((state) => state.groups);

	return (
		<React.Fragment>
			<div className={styles.table_department} style={{ gridColumn: `1 / -1` }}>
				<span>{department.title}</span>
			</div>
			{groups
				.filter((group) => group.departmentId === department.id)
				.map((group) => (
					<GroupRow
						key={`${group.id}-${group.code}`}
						group={group}
						filteredSchedule={filteredSchedule}
						onGroupSelect={onGroupSelect}
						role={role}
						dayId={selectedDay}
					/>
				))}
		</React.Fragment>
	);
};
