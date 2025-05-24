import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Modal from '../Modal/Modal';
import styles from '../AddLessonForm/AddLessonForm.module.css';

// Components
import LessonSelector from '../AddLessonForm/components/LessonSelector';
import NewLessonForm from '../AddLessonForm/components/NewLessonForm';
import EventSelector from '../AddLessonForm/components/EventSelector';
import NewEventForm from '../AddLessonForm/components/NewEventForm';
import DurationSelector from '../AddLessonForm/components/DurationSelector';
import TeacherSelector from '../AddLessonForm/components/TeacherSelector';
import RoomSelector from '../AddLessonForm/components/RoomSelector';
import BlockSelector from '../AddLessonForm/components/BlockSelector';

// Hooks
import useScheduleValidation from '../AddLessonForm/hooks/useScheduleValidation';
import useFilteredData from '../AddLessonForm/hooks/useFilteredData';
import useFormValidation from '../AddLessonForm/hooks/useFormValidation';

// Constants
import { lessonColors } from '@/constants';

// Store
import useStockStore from '@/store/useStockStore';
import useLessonsStore from '@/store/useLessonsStore';
import useEventsStore from '@/store/useEventsStore';
import useTeacherStore from '@/store/useTeacherStore';
import useRoomsStore from '@/store/useRoomsStore';
import useBlocksStore from '@/store/useBlocksStore';
import useScheduleStore from '@/store/useScheduleStore';

// Types
import type {
	Group,
	TimeSlot,
	Lesson,
	Schedule,
	Event,
	Teacher,
	Room,
	Block,
} from '@/types/types';

type EditLessonFormProps = {
	isOpen: boolean;
	onClose: () => void;
	scheduleId: number;
	item: Lesson | Event;
	teacher?: Teacher;
	room?: Room;
	block?: Block;
};

/**
 * Main form component for editing an existing lesson or event in the schedule
 * Integrates all sub-components and handles form state
 */
const EditLessonForm: React.FC<EditLessonFormProps> = ({
	isOpen,
	onClose,
	scheduleId,
	item,
	teacher,
	room,
	block,
}) => {
	// Получаем необходимые данные из хранилища
	const { schedule } = useScheduleStore();
	const { timeSlots } = useStockStore();
	const { lessons } = useLessonsStore();
	const { events } = useEventsStore();
	const { teachers } = useTeacherStore();
	const { rooms } = useRoomsStore();
	const { blocks } = useBlocksStore();

	// Получаем действия из хранилища
	const updateScheduleItem = useScheduleStore(
		(state) => state.updateScheduleItem,
	);
	const updateLesson =
		useLessonsStore((state) => state.updateLesson) || ((lesson: Lesson) => {});
	const updateEvent =
		useEventsStore((state) => state.updateEvent) || ((event: Event) => {});

	// Находим запись в расписании для редактирования
	const scheduleItem = schedule.find((s) => s.id === scheduleId);

	// Form mode state - определяем, это урок или событие
	const [isEventMode, setIsEventMode] = useState<boolean>(
		!!scheduleItem?.eventId,
	);

	// Form state for lessons
	const [lessonId, setLessonId] = useState<number>(-1);
	const [teacherId, setTeacherId] = useState<number>(-1);
	const [blockId, setBlockId] = useState<number>(-1);
	const [roomId, setRoomId] = useState<number>(-1);
	const [duration, setDuration] = useState<number>(1);
	const [title, setTitle] = useState<string>('');
	const [color, setColor] = useState<string>(lessonColors[0]);
	const [isNewLesson, setIsNewLesson] = useState<boolean>(false);

	// Form state for events
	const [eventId, setEventId] = useState<number>(-1);
	const [isNewEvent, setIsNewEvent] = useState<boolean>(false);

	// Search queries
	const [lessonSearchQuery, setLessonSearchQuery] = useState<string>('');
	const [teacherSearchQuery, setTeacherSearchQuery] = useState<string>('');
	const [blockSearchQuery, setBlockSearchQuery] = useState<string>('');
	const [roomSearchQuery, setRoomSearchQuery] = useState<string>('');
	const [eventSearchQuery, setEventSearchQuery] = useState<string>('');

	// Custom hooks
	const {
		filteredLessons,
		filteredTeachers,
		filteredRooms,
		filteredEvents,
		filteredBlocks,
	} = useFilteredData(
		lessons,
		teachers,
		rooms,
		events,
		blocks,
		lessonSearchQuery,
		teacherSearchQuery,
		roomSearchQuery,
		eventSearchQuery,
		blockSearchQuery,
		blockId,
	);

	// Получаем группу, день и временной слот из записи расписания
	const groupId = scheduleItem?.groupId;
	const dayId = scheduleItem?.dayId;
	const timeSlotId = scheduleItem?.timeStartId;

	const {
		isTeacherAvailable,
		isRoomAvailable,
		checkCellsAvailability,
		availableDurations,
	} = useScheduleValidation(
		schedule,
		timeSlots,
		dayId || 0,
		groupId || 0,
		timeSlotId || 0,
		duration,
		scheduleId, // Передаем scheduleId, чтобы исключить текущий урок при проверке доступности
	);

	const { errors, setErrors, validateForm, validateEventForm } =
		useFormValidation(
			isTeacherAvailable,
			isRoomAvailable,
			checkCellsAvailability,
		);

	// Инициализация формы при открытии
	useEffect(() => {
		if (isOpen && scheduleItem) {
			// Установка режима формы (урок или событие)
			setIsEventMode(!!scheduleItem.eventId);

			// Установка значений для урока
			if (scheduleItem.lessonId) {
				const lessonData = lessons.find((l) => l.id === scheduleItem.lessonId);
				if (lessonData) {
					setLessonId(lessonData.id);
					setTitle(lessonData.title);
					setColor(lessonData.color);
					setIsNewLesson(false);
				}
			}

			// Установка значений для события
			if (scheduleItem.eventId) {
				const eventData = events.find((e) => e.id === scheduleItem.eventId);
				if (eventData) {
					setEventId(eventData.id);
					setTitle(eventData.title);
					setColor(eventData.color);
					setIsNewEvent(false);
				}
			}

			// Общие поля
			setDuration(scheduleItem.duration);

			// Установка преподавателя
			if (scheduleItem.teacherId) {
				setTeacherId(scheduleItem.teacherId);
				const teacherData = teachers.find(
					(t) => t.id === scheduleItem.teacherId,
				);
				if (teacherData) {
					setTeacherSearchQuery(
						`${teacherData.firstName} ${teacherData.lastName}`,
					);
				}
			}

			// Установка комнаты и блока
			if (scheduleItem.roomId) {
				setRoomId(scheduleItem.roomId);
				const roomData = rooms.find((r) => r.id === scheduleItem.roomId);
				if (roomData) {
					setRoomSearchQuery(roomData.code);
					setBlockId(roomData.blockId);
					const blockData = blocks.find((b) => b.id === roomData.blockId);
					if (blockData) {
						setBlockSearchQuery(blockData.code);
					}
				}
			}
		}
	}, [isOpen, scheduleItem, lessons, events, teachers, rooms, blocks]);

	// Format teacher name with title
	const formatTeacherName = (teacher: any) => {
		return `${teacher.title ? `${teacher.title}.` : ''} ${teacher.firstName} ${
			teacher.lastName
		}`;
	};

	// Toggle between lesson and event mode
	const toggleMode = () => {
		setIsEventMode(!isEventMode);
		setTitle('');
		setColor(lessonColors[0]);
		setDuration(1);
	};

	// Form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!scheduleItem) return;

		if (isEventMode) {
			// Event mode
			if (
				!validateEventForm(
					isNewEvent,
					title,
					duration,
					teacherId,
					roomId,
					blockId,
				)
			) {
				return;
			}

			if (isNewEvent) {
				// Generate new ID for events
				const newEventId = Math.max(...events.map((e) => e.id), 0) + 1;

				// Create new event
				const newEvent: Event = {
					id: newEventId,
					title,
					color,
				};

				// Update schedule item for the event
				const updatedScheduleItem: Schedule = {
					...scheduleItem,
					eventId: newEventId,
					lessonId: undefined,
					duration,
					teacherId: teacherId !== -1 ? teacherId : undefined,
					roomId: roomId !== -1 ? roomId : undefined,
				};

				// Добавляем новое событие и обновляем расписание
				if (updateEvent) updateEvent(newEvent);
				updateScheduleItem(updatedScheduleItem);
			} else {
				// Обновляем существующее событие
				const eventToUpdate = events.find((e) => e.id === eventId);
				if (eventToUpdate && updateEvent) {
					const updatedEvent: Event = {
						...eventToUpdate,
						title,
						color,
					};
					updateEvent(updatedEvent);
				}

				// Обновляем запись в расписании
				const updatedScheduleItem: Schedule = {
					...scheduleItem,
					eventId,
					lessonId: undefined,
					duration,
					teacherId: teacherId !== -1 ? teacherId : undefined,
					roomId: roomId !== -1 ? roomId : undefined,
				};

				updateScheduleItem(updatedScheduleItem);
			}
		} else {
			// Lesson mode
			if (
				!validateForm(isNewLesson, title, teacherId, roomId, duration, blockId)
			) {
				return;
			}

			if (isNewLesson) {
				// Generate new ID for lessons
				const newLessonId = Math.max(...lessons.map((l) => l.id), 0) + 1;

				// Create new lesson
				const newLesson: Lesson = {
					id: newLessonId,
					title,
					color,
					departments: [scheduleItem.groupId],
				};

				// Update schedule item
				const updatedScheduleItem: Schedule = {
					...scheduleItem,
					lessonId: newLessonId,
					eventId: undefined,
					duration,
					teacherId,
					roomId,
				};

				// Добавляем новый урок и обновляем расписание
				if (updateLesson) updateLesson(newLesson);
				updateScheduleItem(updatedScheduleItem);
			} else {
				// Обновляем существующий урок
				const lessonToUpdate = lessons.find((l) => l.id === lessonId);
				if (lessonToUpdate && updateLesson) {
					const updatedLesson: Lesson = {
						...lessonToUpdate,
						title,
						color,
					};
					updateLesson(updatedLesson);
				}

				// Обновляем запись в расписании
				const updatedScheduleItem: Schedule = {
					...scheduleItem,
					lessonId,
					eventId: undefined,
					duration,
					teacherId,
					roomId,
				};

				updateScheduleItem(updatedScheduleItem);
			}
		}

		onClose();
	};

	// Обработчик изменения длительности
	const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newDuration = Number(e.target.value);
		if (checkCellsAvailability(newDuration)) {
			setDuration(newDuration);
			setErrors((prev) => ({ ...prev, duration: undefined }));

			// Re-check teacher availability with new duration
			if (teacherId !== -1) {
				const isAvailable = isTeacherAvailable(teacherId);
				if (!isAvailable) {
					setErrors((prev) => ({
						...prev,
						teacher:
							'Warning: This teacher is already scheduled during some of these hours',
					}));
				} else {
					setErrors((prev) => ({ ...prev, teacher: undefined }));
				}
			}

			// Re-check room availability with new duration
			if (roomId !== -1) {
				const isAvailable = isRoomAvailable(roomId);
				if (!isAvailable) {
					setErrors((prev) => ({
						...prev,
						room: 'Warning: This room is already booked during some of these hours',
					}));
				} else {
					setErrors((prev) => ({ ...prev, room: undefined }));
				}
			}
		} else {
			setErrors((prev) => ({
				...prev,
				duration: 'Cannot set this duration as some cells are already occupied',
			}));
		}
	};

	// Используем портал для рендеринга модального окна в конце body
	const modalContent = (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEventMode ? 'Edit Event in Schedule' : 'Edit Lesson in Schedule'}
		>
			<div className={styles['form-mode-toggle']}>
				<button
					type='button'
					className={`btn ${!isEventMode ? 'btn-primary' : 'btn-secondary'}`}
					onClick={() => !isEventMode || toggleMode()}
				>
					Lesson
				</button>
				<button
					type='button'
					className={`btn ${isEventMode ? 'btn-primary' : 'btn-secondary'}`}
					onClick={() => isEventMode || toggleMode()}
				>
					Event
				</button>
			</div>

			<form onSubmit={handleSubmit}>
				{isEventMode ? (
					<>
						{/* Event selection */}
						<EventSelector
							eventSearchQuery={eventSearchQuery}
							setEventSearchQuery={setEventSearchQuery}
							filteredEvents={filteredEvents}
							eventId={eventId}
							isNewEvent={isNewEvent}
							title={title}
							setIsNewEvent={setIsNewEvent}
							setEventId={setEventId}
							setTitle={setTitle}
							setColor={setColor}
							error={errors.title}
						/>

						{/* New event form (shown only when creating new event) */}
						{isNewEvent && (
							<NewEventForm
								title={title}
								setTitle={setTitle}
								color={color}
								setColor={setColor}
								lessonColors={lessonColors}
								titleError={errors.title}
							/>
						)}

						{/* Duration selection */}
						<DurationSelector
							duration={duration}
							availableDurations={availableDurations}
							onChange={handleDurationChange}
							error={errors.duration}
						/>

						{/* Teacher selection for events (optional) */}
						<TeacherSelector
							teacherSearchQuery={teacherSearchQuery}
							setTeacherSearchQuery={setTeacherSearchQuery}
							filteredTeachers={filteredTeachers}
							teacherId={teacherId}
							setTeacherId={setTeacherId}
							formatTeacherName={formatTeacherName}
							isTeacherAvailable={isTeacherAvailable}
							error={errors.teacher}
							setErrors={setErrors}
							isOptional={true}
						/>

						{/* Block selection */}
						<BlockSelector
							blockSearchQuery={blockSearchQuery}
							setBlockSearchQuery={setBlockSearchQuery}
							filteredBlocks={filteredBlocks}
							blockId={blockId}
							setBlockId={setBlockId}
							setRoomSearchQuery={setRoomSearchQuery}
							error={errors.block}
						/>

						{/* Room selection for events (optional) */}
						<RoomSelector
							roomSearchQuery={roomSearchQuery}
							setRoomSearchQuery={setRoomSearchQuery}
							filteredRooms={filteredRooms}
							roomId={roomId}
							setRoomId={setRoomId}
							isRoomAvailable={isRoomAvailable}
							error={errors.room}
							setErrors={setErrors}
							isOptional={true}
						/>
					</>
				) : (
					<>
						{/* Lesson selection */}
						<LessonSelector
							lessonSearchQuery={lessonSearchQuery}
							setLessonSearchQuery={setLessonSearchQuery}
							filteredLessons={filteredLessons}
							lessonId={lessonId}
							isNewLesson={isNewLesson}
							title={title}
							setIsNewLesson={setIsNewLesson}
							setLessonId={setLessonId}
							setTitle={setTitle}
							setColor={setColor}
							error={errors.title}
						/>

						{/* New lesson form (shown only when creating new lesson) */}
						{isNewLesson && (
							<NewLessonForm
								title={title}
								setTitle={setTitle}
								color={color}
								setColor={setColor}
								lessonColors={lessonColors}
								titleError={errors.title}
							/>
						)}

						{/* Duration selection */}
						<DurationSelector
							duration={duration}
							availableDurations={availableDurations}
							onChange={handleDurationChange}
							error={errors.duration}
						/>

						{/* Teacher selection */}
						<TeacherSelector
							teacherSearchQuery={teacherSearchQuery}
							setTeacherSearchQuery={setTeacherSearchQuery}
							filteredTeachers={filteredTeachers}
							teacherId={teacherId}
							setTeacherId={setTeacherId}
							formatTeacherName={formatTeacherName}
							isTeacherAvailable={isTeacherAvailable}
							error={errors.teacher}
							setErrors={setErrors}
						/>

						{/* Block selection */}
						<BlockSelector
							blockSearchQuery={blockSearchQuery}
							setBlockSearchQuery={setBlockSearchQuery}
							filteredBlocks={filteredBlocks}
							blockId={blockId}
							setBlockId={setBlockId}
							setRoomSearchQuery={setRoomSearchQuery}
							error={errors.block}
						/>

						{/* Room selection */}
						<RoomSelector
							roomSearchQuery={roomSearchQuery}
							setRoomSearchQuery={setRoomSearchQuery}
							filteredRooms={filteredRooms}
							roomId={roomId}
							setRoomId={setRoomId}
							isRoomAvailable={isRoomAvailable}
							error={errors.room}
							setErrors={setErrors}
						/>
					</>
				)}

				{/* Form actions */}
				<div className='form-actions'>
					<button type='button' className='btn btn-secondary' onClick={onClose}>
						Cancel
					</button>
					<button type='submit' className='btn btn-primary'>
						Save
					</button>
				</div>
			</form>
		</Modal>
	);

	// Рендерим модальное окно в портале для корректного отображения
	return isOpen ? ReactDOM.createPortal(modalContent, document.body) : null;
};

export default EditLessonForm;
