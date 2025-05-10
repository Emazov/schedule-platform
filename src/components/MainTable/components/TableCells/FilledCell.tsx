import LessonCard from '../../../LessonCard/LessonCard';
import type { Lesson, Teacher, Room } from '../../../../types/schedule';

type FilledCellProps = {
	timeId: number;
	groupId: number;
	columnStart: number;
	duration: number;
	lesson: Lesson;
	teacher?: Teacher;
	room?: Room;
};

const FilledCell = ({
	timeId,
	groupId,
	columnStart,
	duration,
	lesson,
	teacher,
	room,
}: FilledCellProps) => {
	const gridColumn = `${columnStart} / ${columnStart + duration}`;

	return (
		<div
			id={timeId.toString()}
			data-group={groupId}
			className='main_table__cell'
			style={{ gridColumn }}
		>
			<LessonCard lesson={lesson} teacher={teacher} room={room} />
		</div>
	);
};

export default FilledCell;
