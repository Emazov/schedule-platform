import LessonCard from '../../LessonCard/LessonCard';

import type {
	Group,
	Day,
	TimeSlot,
	Lesson,
	Teacher,
	Room,
	Schedule,
} from '../../../types/schedule';

type ActiveTableProps = {
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

const ActiveTable = ({
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
}: ActiveTableProps) => {
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
				onClick={() => (activeGroupSchedule ? null : setSelectedGroup(row.id))}
			>
				{row.title}
			</div>

			{(() => {
				return timeSlots.map((time, timeIdx) => {
					if (occupiedSlots.has(time.id)) {
						return null;
					}

					const scheduledLesson = getScheduledLesson(time);

					const lesson = lessons.find(
						(lesson) => lesson.id === scheduledLesson?.lessonId,
					);

					const teacher = teachers.find(
						(teacher) => teacher.id === scheduledLesson?.teacherId,
					);

					const room = rooms.find(
						(room) => room.id === scheduledLesson?.roomId,
					);

					if (lesson && scheduledLesson) {
						for (let i = 1; i < scheduledLesson?.duration; i++) {
							occupiedSlots.add(time.id + i);
						}

						let cellDuration = `${timeIdx + 2} / ${
							timeIdx + 2 + scheduledLesson.duration
						}`;

						if (
							scheduledLesson.timeStartId + scheduledLesson.duration >
							timeSlots.length + 1
						) {
							const endCol =
								scheduledLesson.timeStartId +
								scheduledLesson.duration -
								timeSlots.length -
								1;

							cellDuration = `${timeIdx + 2} / ${
								timeIdx + 2 + scheduledLesson.duration - endCol
							}`;
						}

						return (
							<div
								key={time.id}
								id={time.id.toString()}
								data-group={row.id}
								className='main_table__cell'
								style={{
									gridColumn: cellDuration,
								}}
							>
								<LessonCard lesson={lesson} teacher={teacher} room={room} />
							</div>
						);
					}

					return (
						<div
							key={time.id}
							id={time.id.toString()}
							data-group={row.id}
							className='main_table__cell'
						/>
					);
				});
			})()}
		</>
	);
};

export default ActiveTable;
