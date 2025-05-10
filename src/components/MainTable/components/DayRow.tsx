import LessonCard from '../../LessonCard/LessonCard';

import type {
	Day,
	TimeSlot,
	Lesson,
	Teacher,
	Room,
	Schedule,
} from '../../../types/schedule';

type DayRowProps = {
	day: Day;
	timeSlots: TimeSlot[];
	lessons: Lesson[];
	teachers: Teacher[];
	rooms: Room[];
	selectedTeacher: number;
	activeTeacherSchedule: boolean;
	selectedGroupSchedule: Schedule[];
};

const DayRow = ({
	day,
	timeSlots,
	lessons,
	teachers,
	rooms,
	selectedTeacher,
	activeTeacherSchedule,
	selectedGroupSchedule,
}: DayRowProps) => {
	return (
		<>
			<div
				id={day.id.toString()}
				className='main_table__label'
				style={{ gridRow: day.id + 2, cursor: 'default' }}
			>
				{day.title}
			</div>

			{(() => {
				const occupiedSlots = new Set();

				return timeSlots.map((time, timeIdx) => {
					if (occupiedSlots.has(time.id)) {
						return null;
					}

					const scheduledLesson = activeTeacherSchedule
						? selectedGroupSchedule.find(
								(lesson) =>
									lesson.dayId === day.id &&
									lesson.timeStartId === time.id &&
									lesson.teacherId === selectedTeacher,
						  )
						: selectedGroupSchedule.find(
								(lesson) =>
									lesson.dayId === day.id && lesson.timeStartId === time.id,
						  );

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

						const cellDuration = `${timeIdx + 2} / ${
							timeIdx + 2 + scheduledLesson.duration
						}`;

						return (
							<div
								key={time.id}
								id={time.id.toString()}
								data-group={day.id}
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
							data-group={day.id}
							className='main_table__cell'
						/>
					);
				});
			})()}
		</>
	);
};

export default DayRow;
