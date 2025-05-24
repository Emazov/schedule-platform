import { memo } from 'react';
import './lessonCard.css';

import type { Lesson, Teacher, Room } from '@/types/types';
import useStockStore from '@store/useStockStore';

type LessonCardProps = {
	lesson: Lesson;
	teacher?: Teacher;
	room?: Room;
};

const LessonCard = ({ lesson, teacher, room }: LessonCardProps) => {
	const { blocks } = useStockStore();
	const block = blocks.find((b) => b.id === room?.blockId);

	return (
		<div className='lesson_card' style={{ backgroundColor: lesson.color }}>
			<div className='lesson_card__title'>{lesson.title}</div>
			<div className='lesson_card__text'>
				{teacher?.title}. {teacher?.firstName} {teacher?.lastName}
			</div>
			<div className='lesson_card__text' style={{ textTransform: 'uppercase' }}>
				{block?.code} {room?.code}
			</div>
		</div>
	);
};

export default memo(LessonCard);
