import LessonCard from '../../LessonCard/LessonCard';

import type {
	Group,
	TimeSlot,
	Schedule,
	Lesson,
	Teacher,
	Room,
} from '../../../types/schedule';

type GroupRowProps = {
	group: Group;
	groupIdx: number;
	timeSlots: TimeSlot[];
	selectedDaySchedule: Schedule[];
	selectedTeacherSchedule: Schedule[];
	lessons: Lesson[];
	teachers: Teacher[];
	rooms: Room[];
	activeTeacherSchedule: boolean;
	setSelectedGroup: (id: number) => void;
};

const GroupRow = ({
	group,
	groupIdx,
	timeSlots,
	activeTeacherSchedule,
	selectedDaySchedule,
	selectedTeacherSchedule,
	lessons,
	teachers,
	rooms,
	setSelectedGroup,
}: GroupRowProps) => {
	return (
		<>
			<div
				id={group.id.toString()}
				className='main_table__label'
				style={{ gridRow: groupIdx + 2, cursor: 'pointer' }}
				onClick={() => setSelectedGroup(group.id)}
			>
				{group.title}
			</div>

			{(() => {
				const occupiedSlots = new Set();

				return timeSlots.map((time, timeIdx) => {
					if (occupiedSlots.has(time.id)) {
						return null;
					}

					const scheduledLesson = activeTeacherSchedule
						? selectedTeacherSchedule.find(
								(lesson) =>
									lesson.groupId === group.id && lesson.timeStartId === time.id,
						  )
						: selectedDaySchedule.find(
								(lesson) =>
									lesson.groupId === group.id && lesson.timeStartId === time.id,
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
								data-group={group.id}
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
							data-group={group.id}
							className='main_table__cell'
						/>
					);
				});
			})()}
		</>
	);
};

export default GroupRow;
