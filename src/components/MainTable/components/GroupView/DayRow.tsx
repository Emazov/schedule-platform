import React from 'react';
import styles from '@MainTable/MainTable.module.css';
import { ScheduleCell } from '../ScheduleCell';

import type { Day, Group, Schedule } from '@/types/types';
import useStockStore from '@/store/useStockStore';
import useLessonsStore from '@/store/useLessonsStore';
import useEventsStore from '@/store/useEventsStore';

type DayRowProps = {
	day: Day;
	group: Group;
	filteredSchedule: Schedule[];
	role: string;
};

export const DayRow = ({ day, group, filteredSchedule, role }: DayRowProps) => {
	const timeSlots = useStockStore((state) => state.timeSlots);
	const lessons = useLessonsStore((state) => state.lessons);
	const events = useEventsStore((state) => state.events);

	return (
		<React.Fragment>
			<div className={styles.table_label}>{day.shortCode}</div>
			{timeSlots.map((timeSlot) => {
				const filteredLesson = filteredSchedule.find(
					(lesson) =>
						lesson.dayId === day.id &&
						lesson.timeStartId === timeSlot.id &&
						lesson.groupId === group.id,
				);

				const scheduledLesson = lessons.find(
					(lesson) => lesson.id === filteredLesson?.lessonId,
				);

				const scheduledEvent = events.find(
					(event) => event.id === filteredLesson?.eventId,
				);

				const isPartOfOtherLesson = filteredSchedule.some(
					(lesson) =>
						lesson.dayId === day.id &&
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
						dayId={day.id}
					/>
				);
			})}
		</React.Fragment>
	);
};
