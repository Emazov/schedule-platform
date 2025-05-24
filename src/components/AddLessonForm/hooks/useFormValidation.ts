import { useState } from 'react';

type FormErrors = {
	title?: string;
	teacher?: string;
	room?: string;
	duration?: string;
	block?: string;
};

/**
 * Hook for form validation
 * Handles error states and validation rules
 */
export const useFormValidation = (
	isTeacherAvailable: (teacherId: number) => boolean,
	isRoomAvailable: (roomId: number) => boolean,
	checkCellsAvailability: (duration: number) => boolean,
) => {
	const [errors, setErrors] = useState<FormErrors>({});

	// Validate the entire form for lessons
	const validateForm = (
		isNewLesson: boolean,
		title: string,
		teacherId: number,
		roomId: number,
		duration: number,
		blockId?: number,
	): boolean => {
		const newErrors: FormErrors = {};

		if (isNewLesson && !title.trim()) {
			newErrors.title = 'Lesson title is required';
		}

		if (teacherId === -1) {
			newErrors.teacher = 'Teacher is required';
		} else if (!isTeacherAvailable(teacherId)) {
			newErrors.teacher = 'Teacher is already scheduled at this time';
		}

		if (roomId === -1) {
			newErrors.room = 'Room is required';
		} else if (!isRoomAvailable(roomId)) {
			newErrors.room = 'Room is already booked at this time';
		}

		if (!checkCellsAvailability(duration)) {
			newErrors.duration =
				'Cannot set this duration as some cells are already occupied';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Validate the form for events (now also validates teacher and room if provided)
	const validateEventForm = (
		isNewEvent: boolean,
		title: string,
		duration: number,
		teacherId?: number,
		roomId?: number,
		blockId?: number,
	): boolean => {
		const newErrors: FormErrors = {};

		if (isNewEvent && !title.trim()) {
			newErrors.title = 'Event title is required';
		}

		// Teacher validation for events is optional
		if (
			teacherId !== undefined &&
			teacherId !== -1 &&
			!isTeacherAvailable(teacherId)
		) {
			newErrors.teacher = 'Teacher is already scheduled at this time';
		}

		// Room validation for events is optional
		if (roomId !== undefined && roomId !== -1 && !isRoomAvailable(roomId)) {
			newErrors.room = 'Room is already booked at this time';
		}

		if (!checkCellsAvailability(duration)) {
			newErrors.duration =
				'Cannot set this duration as some cells are already occupied';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	return {
		errors,
		setErrors,
		validateForm,
		validateEventForm,
	};
};

export default useFormValidation;
