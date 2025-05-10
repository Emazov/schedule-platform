import type {
	Group,
	Day,
	TimeSlot,
	Lesson,
	Teacher,
	Room,
	Schedule,
} from '../../../types/schedule';

import EmptyCell from './TableCells/EmptyCell';
import FilledCell from './TableCells/FilledCell';

type ActiveTableRowProps = {
	row: Group | Day;
	rowIdx: number;
	timeSlots: TimeSlot[];
	lessons: Lesson[];
	teachers: Teacher[];
	rooms: Room[];
	activeGroupSchedule: boolean;
	selectedDaySchedule: Schedule[];
	selectedGroupSchedule: Schedule[];
	setSelectedGroup: (id: number) => void;
};

const ActiveTableRow = ({
	row,
	rowIdx,
	timeSlots,
	lessons,
	teachers,
	rooms,
	activeGroupSchedule,
	selectedDaySchedule,
	selectedGroupSchedule,
	setSelectedGroup,
}: ActiveTableRowProps) => {
	const occupiedSlots = new Set();

	const getScheduledLesson = (time: TimeSlot) => {
		if (activeGroupSchedule) {
			return selectedGroupSchedule.find(
				(lesson) => lesson.dayId === row.id && lesson.timeStartId === time.id,
			);
		}
		return selectedDaySchedule.find(
			(lesson) => lesson.groupId === row.id && lesson.timeStartId === time.id,
		);
	};

	return (
		<>
			<div
				id={row.id.toString()}
				className='main_table__label'
				style={{
					gridRow: rowIdx + 2,
					cursor: activeGroupSchedule ? 'default' : 'pointer',
				}}
				onClick={() => !activeGroupSchedule && setSelectedGroup(row.id)}
			>
				{row.title}
			</div>

			{timeSlots.map((time, timeIdx) => {
				if (occupiedSlots.has(time.id)) {
					return null;
				}

				const scheduledLesson = getScheduledLesson(time);
				if (!scheduledLesson) {
					return <EmptyCell key={time.id} timeId={time.id} groupId={row.id} />;
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
							timeId={time.id}
							groupId={row.id}
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
