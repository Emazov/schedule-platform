import type { Group, Day, TimeSlot } from '@/types/types';
import { UserRole } from '@constants/index';
import { useEffect } from 'react';

import useLessonStore from '@store/useLessonStore';
import useUserStore from '@store/useUserStore';
import useStockStore from '@store/useStockStore';
import useScheduleStore from '@store/useScheduleStore';

import FilledCell from './FilledCell';

type ActiveTableRowProps = {
	row: Group | Day;
	rowIdx: number;
	activeGroupSchedule: boolean;
	setSelectedGroup: (id: number) => void;
	role: string;
	selectedDay: number;
	selectedGroup: number;
	selectedTeacher: number;
};

const ActiveTableRow = ({
	row,
	rowIdx,
	activeGroupSchedule,
	setSelectedGroup,
	role,
	selectedDay,
	selectedGroup,
	selectedTeacher,
}: ActiveTableRowProps) => {
	// Получаем данные напрямую из хранилищ
	const { lessons, fetchLessons } = useLessonStore();
	const { teachers, fetchTeachers } = useUserStore();
	const { timeSlots, rooms, fetchTimeSlots, fetchRooms } = useStockStore();
	const { schedule, fetchSchedule } = useScheduleStore();

	// Загружаем данные при монтировании компонента
	useEffect(() => {
		fetchLessons();
		fetchTeachers();
		fetchTimeSlots();
		fetchRooms();
		fetchSchedule();
	}, [fetchLessons, fetchTeachers, fetchTimeSlots, fetchRooms, fetchSchedule]);

	// Если необходимые данные ещё не загружены, не рендерим ничего
	if (timeSlots.length === 0) {
		return null;
	}

	const occupiedSlots = new Set();

	// Фильтруем расписание в зависимости от выбранных фильтров
	const currentSchedule = (() => {
		if (selectedGroup !== -1) {
			const filtered = schedule.filter(
				(lesson) => lesson.groupId === selectedGroup,
			);
			return selectedTeacher !== -1
				? filtered.filter((lesson) => lesson.teacherId === selectedTeacher)
				: filtered;
		} else {
			const filtered = schedule.filter(
				(lesson) => lesson.dayId === selectedDay,
			);
			return selectedTeacher !== -1
				? filtered.filter((lesson) => lesson.teacherId === selectedTeacher)
				: filtered;
		}
	})();

	const getScheduledLesson = (time: TimeSlot) => {
		if (activeGroupSchedule) {
			return currentSchedule.find(
				(lesson) => lesson.dayId === row.id && lesson.timeStartId === time.id,
			);
		}
		return currentSchedule.find(
			(lesson) => lesson.groupId === row.id && lesson.timeStartId === time.id,
		);
	};

	const setGroup = (groupId: number) => {
		if (!activeGroupSchedule) {
			if (role === UserRole.TEACHER) return;
			setSelectedGroup(groupId);
		}
	};

	const cursorStyle = () => {
		if (activeGroupSchedule) return 'default';
		if (role === UserRole.TEACHER) return 'default';
		return 'pointer';
	};

	return (
		<>
			<div
				className='main_table__label'
				style={{
					gridRow: rowIdx + 2,
					cursor: cursorStyle(),
				}}
				onClick={() => setGroup(row.id)}
			>
				{row.code}
			</div>

			{timeSlots.map((time, timeIdx) => {
				if (occupiedSlots.has(time.id)) {
					return null;
				}

				const scheduledLesson = getScheduledLesson(time);
				if (!scheduledLesson) {
					return <div key={time.id} className='main_table__cell' />;
				}

				const lesson = lessons.find((l) => l.id === scheduledLesson.lessonId);
				const teacher = teachers.find(
					(t) => t.id === scheduledLesson.teacherId,
				);
				const room = rooms.find((r) => r.id === scheduledLesson.roomId);

				if (lesson) {
					for (let i = 1; i < scheduledLesson.duration; i++) {
						occupiedSlots.add(time.id + i);
					}

					return (
						<FilledCell
							key={time.id}
							columnStart={timeIdx + 2}
							duration={scheduledLesson.duration}
							lesson={lesson}
							teacher={teacher}
							room={room}
						/>
					);
				}

				return null;
			})}
		</>
	);
};

export default ActiveTableRow;
