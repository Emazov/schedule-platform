import { useState } from 'react';
import styles from '@MainTable/MainTable.module.css';
import LessonCard from '@/components/LessonCard/LessonCard';
import AddLessonForm from '@/components/AddLessonForm/AddLessonForm';

import type { Group, Schedule, Lesson, TimeSlot, Event } from '@/types/types';

import useTeacherStore from '@/store/useTeacherStore';
import useRoomsStore from '@/store/useRoomsStore';
import { UserRole } from '@/constants';

type ScheduleCellProps = {
	group: Group;
	timeSlot: TimeSlot;
	filteredLesson?: Schedule;
	scheduledLesson?: Lesson;
	scheduledEvent?: Event;
	isPartOfOtherLesson: boolean;
	role: string;
	dayId: number;
};

export const ScheduleCell = ({
	group,
	timeSlot,
	filteredLesson,
	scheduledLesson,
	scheduledEvent,
	isPartOfOtherLesson,
	role,
	dayId,
}: ScheduleCellProps) => {
	const teachers = useTeacherStore((state) => state.teachers);
	const rooms = useRoomsStore((state) => state.rooms);
	const blocks = useRoomsStore((state) => state.blocks);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleClickOpenModal = () => {
		if (role === UserRole.ADMIN) setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	if (isPartOfOtherLesson) {
		return null;
	}

	if (filteredLesson && scheduledEvent) {
		const teacher = teachers.find(
			(teacher) => teacher.id === filteredLesson.teacherId,
		);

		const room = rooms.find((room) => room.id === filteredLesson.roomId);
		const block = blocks.find((block) => block.id === room?.blockId);

		return (
			<div
				className={styles.table_cell}
				style={{
					gridColumn: `span ${filteredLesson.duration}`,
					cursor: role === UserRole.ADMIN ? 'pointer' : 'default',
				}}
			>
				<LessonCard
					item={scheduledEvent}
					teacher={teacher}
					room={room}
					block={block}
					role={role}
					scheduleId={filteredLesson.id}
				/>
			</div>
		);
	}

	if (filteredLesson && scheduledLesson) {
		const teacher = teachers.find(
			(teacher) => teacher.id === filteredLesson.teacherId,
		);

		const room = rooms.find((room) => room.id === filteredLesson.roomId);
		const block = blocks.find((block) => block.id === room?.blockId);

		return (
			<div
				className={styles.table_cell}
				style={{
					gridColumn: `span ${filteredLesson.duration}`,
					cursor: role === UserRole.ADMIN ? 'pointer' : 'default',
				}}
			>
				<LessonCard
					item={scheduledLesson}
					teacher={teacher}
					room={room}
					role={role}
					block={block}
					scheduleId={filteredLesson.id}
				/>
			</div>
		);
	}

	return (
		<>
			<div
				className={styles.table_cell}
				style={{ cursor: role === UserRole.ADMIN ? 'pointer' : 'default' }}
				spot-data={`${group.code} - ${timeSlot.slot}`}
				onClick={handleClickOpenModal}
			></div>

			<AddLessonForm
				isOpen={isModalOpen}
				onClose={closeModal}
				group={group}
				timeSlot={timeSlot}
				dayId={dayId}
			/>
		</>
	);
};
