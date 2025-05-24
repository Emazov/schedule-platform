import React from 'react';
import styles from '@MainTable/MainTable.module.css';
import { ScheduleCell } from '../ScheduleCell';

import type { Group, Schedule } from '@/types/types';
import useStockStore from '@/store/useStockStore';
import useLessonsStore from '@/store/useLessonsStore';
import useEventsStore from '@/store/useEventsStore';
import { UserRole } from '@/constants';

type GroupRowProps = {
	group: Group;
	filteredSchedule: Schedule[];
	onGroupSelect: (groupId: number) => void;
	role: string;
	dayId: number;
};

export const GroupRow = ({
	group,
	filteredSchedule,
	onGroupSelect,
	role,
	dayId,
}: GroupRowProps) => {
	const timeSlots = useStockStore((state) => state.timeSlots);
	const lessons = useLessonsStore((state) => state.lessons);
	const events = useEventsStore((state) => state.events);

	const handleGroupSelect = () => {
		if (role === UserRole.STUDENT || role === UserRole.ADMIN) {
			onGroupSelect(group.id);
		}
	};

	return (
		<React.Fragment>
			<div
				className={styles.table_label}
				style={{ cursor: role !== UserRole.TEACHER ? 'pointer' : 'default' }}
				onClick={handleGroupSelect}
			>
				{group.code} {group.year} {group?.subgroup}
			</div>
			{timeSlots.map((timeSlot) => {
				const filteredLesson = filteredSchedule.find(
					(lesson) =>
						lesson.groupId === group.id && lesson.timeStartId === timeSlot.id,
				);

				const scheduledLesson = lessons.find(
					(lesson) => lesson.id === filteredLesson?.lessonId,
				);

				const scheduledEvent = events.find(
					(event) => event.id === filteredLesson?.eventId,
				);

				const isPartOfOtherLesson = filteredSchedule.some(
					(lesson) =>
						lesson.groupId === group.id &&
						lesson.timeStartId < timeSlot.id &&
						lesson.timeStartId + lesson.duration > timeSlot.id,
				);

				return (
					<ScheduleCell
						key={timeSlot.id}
						timeSlot={timeSlot}
						group={group}
						filteredLesson={filteredLesson}
						scheduledLesson={scheduledLesson}
						scheduledEvent={scheduledEvent}
						isPartOfOtherLesson={isPartOfOtherLesson}
						role={role}
						dayId={dayId}
					/>
				);
			})}
		</React.Fragment>
	);
};
