import { useMemo } from 'react';
import type { Schedule, TimeSlot } from '@/types/types';

/**
 * Hook for validating schedule conflicts
 * Checks for availability of time slots, teachers, and rooms
 */
export const useScheduleValidation = (
	schedule: Schedule[],
	timeSlots: TimeSlot[],
	dayId: number,
	groupId: number,
	timeSlotId: number,
	duration: number,
	currentScheduleId?: number,
) => {
	// Check if cells are available for scheduling
	const checkCellsAvailability = (checkDuration: number): boolean => {
		// Check existing lessons in schedule
		for (let i = 0; i < checkDuration; i++) {
			const currentTimeSlotId = timeSlotId + i;

			// Check if this timeslot exists
			if (!timeSlots.some((ts) => ts.id === currentTimeSlotId)) {
				return false;
			}

			// Check if cell is occupied by another lesson
			const isOccupied = schedule.some(
				(item) =>
					item.id !== currentScheduleId &&
					item.groupId === groupId &&
					item.dayId === dayId &&
					item.timeStartId <= currentTimeSlotId &&
					item.timeStartId + item.duration > currentTimeSlotId,
			);

			if (isOccupied) {
				return false;
			}
		}

		return true;
	};

	// Check if a teacher is available at the selected time slot
	const isTeacherAvailable = (teacherId: number): boolean => {
		// Check if the teacher is already scheduled for another lesson at the same time
		for (let i = 0; i < duration; i++) {
			const currentTimeSlotId = timeSlotId + i;

			const isOccupied = schedule.some(
				(item) =>
					item.id !== currentScheduleId &&
					item.teacherId === teacherId &&
					item.dayId === dayId &&
					item.timeStartId <= currentTimeSlotId &&
					item.timeStartId + item.duration > currentTimeSlotId,
			);

			if (isOccupied) {
				return false;
			}
		}
		return true;
	};

	// Check if a room is available at the selected time slot
	const isRoomAvailable = (roomId: number): boolean => {
		// Check if the room is already booked for another lesson at the same time
		for (let i = 0; i < duration; i++) {
			const currentTimeSlotId = timeSlotId + i;

			const isOccupied = schedule.some(
				(item) =>
					item.id !== currentScheduleId &&
					item.roomId === roomId &&
					item.dayId === dayId &&
					item.timeStartId <= currentTimeSlotId &&
					item.timeStartId + item.duration > currentTimeSlotId,
			);

			if (isOccupied) {
				return false;
			}
		}
		return true;
	};

	// Calculate available duration options
	const maxDuration =
		timeSlots.length - timeSlots.findIndex((ts) => ts.id === timeSlotId);

	const availableDurations = useMemo(() => {
		const durations: Array<{ value: number; available: boolean }> = [];

		for (let i = 1; i <= Math.min(maxDuration, 6); i++) {
			durations.push({
				value: i,
				available: checkCellsAvailability(i),
			});
		}

		return durations;
	}, [maxDuration]);

	return {
		checkCellsAvailability,
		isTeacherAvailable,
		isRoomAvailable,
		availableDurations,
		maxDuration,
	};
};

export default useScheduleValidation;
