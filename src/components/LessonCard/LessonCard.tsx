import './lessonCard.css';

import type { Lesson, Teacher, Room } from '../../types/types';

type LessonCardProps = {
	lesson: Lesson;
	teacher?: Teacher;
	room?: Room;
};

const LessonCard = ({ lesson, teacher, room }: LessonCardProps) => {
	return (
		<div className='lesson_card' style={{ backgroundColor: lesson.color }}>
			<div className='lesson_card__title'>{lesson.title}</div>
			<div className='lesson_card__text'>
				{teacher?.title} {teacher?.name}
			</div>
			<div className='lesson_card__text'>{room?.name}</div>
		</div>
	);
};

export default LessonCard;
