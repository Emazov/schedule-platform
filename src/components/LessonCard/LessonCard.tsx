import { useState } from 'react';
import styles from './LessonCard.module.css';
import useScheduleStore from '@/store/useScheduleStore';
import EditLessonForm from '../EditLessonForm/EditLessonForm';
import type { Block, Lesson, Teacher, Event, Room } from '@/types/types';
import { UserRole } from '@/constants';

type LessonCardProps = {
	item: Lesson | Event;
	teacher?: Teacher;
	room?: Room;
	block?: Block;
	scheduleId?: number;
	role: string;
};

const LessonCard = ({
	item,
	teacher,
	room,
	block,
	scheduleId,
	role,
}: LessonCardProps) => {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const deleteScheduleItem = useScheduleStore(
		(state) => state.deleteScheduleItem,
	);

	const handleClickRemove = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (scheduleId && role === UserRole.ADMIN) deleteScheduleItem(scheduleId);
	};

	const handleClickEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (scheduleId && role === UserRole.ADMIN) setIsEditModalOpen(true);
	};

	const closeEditModal = () => {
		setIsEditModalOpen(false);
	};

	return (
		<>
			<div
				className={`${styles.lesson_card} no-select`}
				style={{ backgroundColor: item.color }}
				onClick={handleClickEdit}
			>
				{role === UserRole.ADMIN && (
					<div
						className={styles.lesson_card__delete}
						onClick={handleClickRemove}
					>
						x
					</div>
				)}
				<div className={styles.lesson_card__title}>{item.title}</div>
				<div className={styles.lesson_card__teacher}>
					{`${teacher?.title ? `${teacher.title}.` : ''}`} {teacher?.firstName}{' '}
					{teacher?.lastName}
				</div>
				<div className={styles.lesson_card__room}>
					{block?.code}
					{room?.code}
				</div>
			</div>

			{scheduleId && (
				<EditLessonForm
					isOpen={isEditModalOpen}
					onClose={closeEditModal}
					scheduleId={scheduleId}
					item={item}
					teacher={teacher}
					room={room}
					block={block}
				/>
			)}
		</>
	);
};

export default LessonCard;
