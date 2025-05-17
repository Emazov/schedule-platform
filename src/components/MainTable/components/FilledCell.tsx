import LessonCard from '../../LessonCard/LessonCard';
import type { Lesson, Teacher, Room } from '../../../types/types';

type FilledCellProps = {
	columnStart: number;
	duration: number;
	lesson: Lesson;
	teacher?: Teacher;
	room?: Room;
};

const FilledCell = ({
	columnStart,
	duration,
	lesson,
	teacher,
	room,
}: FilledCellProps) => {
	const gridColumn = `${columnStart} / ${columnStart + duration}`;

	return (
		<div className='main_table__cell' style={{ gridColumn }}>
			<LessonCard lesson={lesson} teacher={teacher} room={room} />
		</div>
	);
};

export default FilledCell;
