import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Modal from '../Modal/Modal';
import styles from './AddLessonForm.module.css';

// Components
import LessonSelector from './components/LessonSelector';
import NewLessonForm from './components/NewLessonForm';
import EventSelector from './components/EventSelector';
import NewEventForm from './components/NewEventForm';
import DurationSelector from './components/DurationSelector';
import TeacherSelector from './components/TeacherSelector';
import RoomSelector from './components/RoomSelector';
import BlockSelector from './components/BlockSelector';

// Hooks
import useScheduleValidation from './hooks/useScheduleValidation';
import useFilteredData from './hooks/useFilteredData';
import useFormValidation from './hooks/useFormValidation';

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
import type { Group, TimeSlot, Lesson, Schedule, Event } from '@/types/types';

type AddLessonFormProps = {
	isOpen: boolean;
	onClose: () => void;
	group: Group;
	timeSlot: TimeSlot;
	dayId: number;
	userEmail?: string;
};

/**
 * Main form component for adding a new lesson or event to the schedule
 * Integrates all sub-components and handles form state
 */
const AddLessonForm: React.FC<AddLessonFormProps> = ({
	isOpen,
	onClose,
	group,
	timeSlot,
	dayId,
	userEmail,
}) => {
	// Form mode state
	const [isEventMode, setIsEventMode] = useState<boolean>(false);

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

	// Get data from stores
	const { lessons } = useLessonsStore();
	const { events } = useEventsStore();
	const { teachers } = useTeacherStore();
	const { rooms } = useRoomsStore();
	const { blocks } = useBlocksStore();
	const { schedule } = useScheduleStore();
	const { timeSlots } = useStockStore();

	// Store actions
	const addScheduleItem = useScheduleStore((state) => state.addScheduleItem);
	const addLesson = useLessonsStore((state) => state.addLesson);
	const addEvent = useEventsStore((state) => state.addEvent);

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

	const {
		isTeacherAvailable,
		isRoomAvailable,
		checkCellsAvailability,
		availableDurations,
	} = useScheduleValidation(
		schedule,
		timeSlots,
		dayId,
		group.id,
		timeSlot.id,
		duration,
	);

	const { errors, setErrors, validateForm, validateEventForm } =
		useFormValidation(
			isTeacherAvailable,
			isRoomAvailable,
			checkCellsAvailability,
		);

	// Reset form when opening
	useEffect(() => {
		if (isOpen) {
			// Reset form mode
			setIsEventMode(false);

			// Reset lesson form fields
			setLessonId(-1);
			setTeacherId(-1);
			setBlockId(-1);
			setRoomId(-1);
			setDuration(1);
			setTitle('');
			setColor(lessonColors[0]);
			setIsNewLesson(false);
			setLessonSearchQuery('');
			setTeacherSearchQuery('');
			setBlockSearchQuery('');
			setRoomSearchQuery('');

			// Reset event form fields
			setEventId(-1);
			setIsNewEvent(false);
			setEventSearchQuery('');
		}
	}, [isOpen]);

	// Auto-select first lesson when search changes
	useEffect(() => {
		if (
			filteredLessons.length > 0 &&
			lessonSearchQuery.trim() &&
			!isNewLesson
		) {
			setLessonId(filteredLessons[0].id);
			setTitle(filteredLessons[0].title);
			setColor(filteredLessons[0].color);
		} else if (lessonSearchQuery.trim() && filteredLessons.length === 0) {
			setIsNewLesson(true);
			setTitle(lessonSearchQuery);
		}
	}, [filteredLessons, lessonSearchQuery]);

	// Auto-select first event when search changes
	useEffect(() => {
		if (filteredEvents.length > 0 && eventSearchQuery.trim() && !isNewEvent) {
			setEventId(filteredEvents[0].id);
			setTitle(filteredEvents[0].title);
			setColor(filteredEvents[0].color);
		} else if (eventSearchQuery.trim() && filteredEvents.length === 0) {
			setIsNewEvent(true);
			setTitle(eventSearchQuery);
		}
	}, [filteredEvents, eventSearchQuery]);

	// Auto-select first block when search changes
	useEffect(() => {
		if (filteredBlocks.length > 0 && blockSearchQuery.trim()) {
			setBlockId(filteredBlocks[0].id);
			// Очищаем выбор комнаты, так как теперь нужно выбрать комнату из выбранного блока
			setRoomId(-1);
			setRoomSearchQuery('');
		}
	}, [filteredBlocks, blockSearchQuery]);

	// Auto-select first available teacher when search changes
	useEffect(() => {
		if (filteredTeachers.length > 0 && teacherSearchQuery.trim()) {
			// Find the first available teacher
			const availableTeacher = filteredTeachers.find((teacher) =>
				isTeacherAvailable(teacher.id),
			);

			if (availableTeacher) {
				setTeacherId(availableTeacher.id);
				setErrors((prev) => ({ ...prev, teacher: undefined }));
			} else {
				// If no available teacher found, select the first one but show warning
				setTeacherId(filteredTeachers[0].id);
				setErrors((prev) => ({
					...prev,
					teacher: 'Warning: This teacher is already scheduled at this time',
				}));
			}
		}
	}, [filteredTeachers, teacherSearchQuery, duration, timeSlot.id]);

	// Auto-select first available room when search changes
	useEffect(() => {
		if (filteredRooms.length > 0 && roomSearchQuery.trim()) {
			// Find the first available room
			const availableRoom = filteredRooms.find((room) =>
				isRoomAvailable(room.id),
			);

			if (availableRoom) {
				setRoomId(availableRoom.id);
				setErrors((prev) => ({ ...prev, room: undefined }));
			} else {
				// If no available room found, select the first one but show warning
				setRoomId(filteredRooms[0].id);
				setErrors((prev) => ({
					...prev,
					room: 'Warning: This room is already booked at this time',
				}));
			}
		}
	}, [filteredRooms, roomSearchQuery, duration, timeSlot.id]);

	// Handle duration change and check if teacher and room are still available
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

		// Generate new IDs for schedule items
		const newId = Math.max(...schedule.map((s) => s.id), 0) + 1;

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

			// Generate new ID for events
			const newEventId = Math.max(...events.map((e) => e.id), 0) + 1;

			if (isNewEvent) {
				// Create new event
				const newEvent: Event = {
					id: newEventId,
					title,
					color,
				};

				// Create schedule item for the event
				const newScheduleItem: Schedule = {
					id: newId,
					eventId: newEventId,
					groupId: group.id,
					timeStartId: timeSlot.id,
					duration,
					dayId,
					teacherId: teacherId !== -1 ? teacherId : undefined,
					roomId: roomId !== -1 ? roomId : undefined,
				};

				addEvent(newEvent, userEmail);
				addScheduleItem(newScheduleItem, userEmail);
				console.log('New event created:', newEvent);
				console.log('New schedule item created:', newScheduleItem);
			} else {
				// Add existing event to schedule
				const newScheduleItem: Schedule = {
					id: newId,
					eventId,
					groupId: group.id,
					timeStartId: timeSlot.id,
					duration,
					dayId,
					teacherId: teacherId !== -1 ? teacherId : undefined,
					roomId: roomId !== -1 ? roomId : undefined,
				};

				addScheduleItem(newScheduleItem, userEmail);
				console.log('New schedule item created:', newScheduleItem);
			}
		} else {
			// Lesson mode
			if (
				!validateForm(isNewLesson, title, teacherId, roomId, duration, blockId)
			) {
				return;
			}

			// Generate new ID for lessons
			const newLessonId = Math.max(...lessons.map((l) => l.id), 0) + 1;

			// If creating a new lesson
			if (isNewLesson) {
				// First create the new lesson
				const newLesson: Lesson = {
					id: newLessonId,
					title,
					color,
					departments: [group.departmentId],
				};

				// Then add the schedule entry
				const newScheduleItem: Schedule = {
					id: newId,
					lessonId: newLessonId,
					groupId: group.id,
					timeStartId: timeSlot.id,
					duration,
					dayId,
					teacherId,
					roomId,
				};

				// Add the new lesson and schedule to the store
				addLesson(newLesson, userEmail);
				addScheduleItem(newScheduleItem, userEmail);
				console.log('New lesson created:', newLesson);
				console.log('New schedule item created:', newScheduleItem);
			} else {
				// Add existing lesson to schedule
				const newScheduleItem: Schedule = {
					id: newId,
					lessonId,
					groupId: group.id,
					timeStartId: timeSlot.id,
					duration,
					dayId,
					teacherId,
					roomId,
				};

				addScheduleItem(newScheduleItem, userEmail);
				console.log('New schedule item created:', newScheduleItem);
			}
		}

		onClose();
	};

	// Используем портал для рендеринга модального окна в конце body
	const modalContent = (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEventMode ? 'Add Event to Schedule' : 'Add Lesson to Schedule'}
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

export default AddLessonForm;
