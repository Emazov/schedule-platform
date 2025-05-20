import type {
	Group,
	Day,
	TimeSlot,
	Lesson,
	Teacher,
	Room,
	Schedule,
} from '../../../types/types';
import { UserRole } from '../../../constants';

import FilledCell from './FilledCell';

type ActiveTableRowProps = {
	row: Group | Day;
	rowIdx: number;
	timeSlots: TimeSlot[];
	lessons: Lesson[];
	teachers: Teacher[];
	rooms: Room[];
	activeGroupSchedule: boolean;
	currentSchedule: Schedule[];
	setSelectedGroup: (id: number) => void;
	role: string;
};

const ActiveTableRow = ({
	row,
	rowIdx,
	timeSlots,
	lessons,
	teachers,
	rooms,
	activeGroupSchedule,
	currentSchedule,
	setSelectedGroup,
	role,
}: ActiveTableRowProps) => {
	const occupiedSlots = new Set();

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
