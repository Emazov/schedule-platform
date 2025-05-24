import { useMemo } from 'react';
import type { Lesson, Teacher, Room, Event, Block } from '@/types/types';

/**
 * Hook for filtering lessons, teachers, rooms, events, and blocks based on search queries
 * Returns filtered lists for UI components
 */
export const useFilteredData = (
	lessons: Lesson[],
	teachers: Teacher[],
	rooms: Room[],
	events: Event[],
	blocks: Block[],
	lessonSearchQuery: string,
	teacherSearchQuery: string,
	roomSearchQuery: string,
	eventSearchQuery: string,
	blockSearchQuery: string,
	blockId: number = -1,
) => {
	// Filtered lessons based on search
	const filteredLessons = useMemo(() => {
		if (!lessonSearchQuery.trim()) {
			return lessons;
		}
		return lessons.filter((lesson) =>
			lesson.title.toLowerCase().includes(lessonSearchQuery.toLowerCase()),
		);
	}, [lessons, lessonSearchQuery]);

	// Filtered events based on search
	const filteredEvents = useMemo(() => {
		if (!eventSearchQuery.trim()) {
			return events;
		}
		return events.filter((event) =>
			event.title.toLowerCase().includes(eventSearchQuery.toLowerCase()),
		);
	}, [events, eventSearchQuery]);

	// Filtered teachers based on search
	const filteredTeachers = useMemo(() => {
		if (!teacherSearchQuery.trim()) {
			return teachers;
		}
		return teachers.filter((teacher) =>
			`${teacher.firstName} ${teacher.lastName}`
				.toLowerCase()
				.includes(teacherSearchQuery.toLowerCase()),
		);
	}, [teachers, teacherSearchQuery]);

	// Filtered blocks based on search
	const filteredBlocks = useMemo(() => {
		if (!blockSearchQuery.trim()) {
			return blocks;
		}
		return blocks.filter((block) =>
			block.code.toLowerCase().includes(blockSearchQuery.toLowerCase()),
		);
	}, [blocks, blockSearchQuery]);

	// Filtered rooms based on search and selected block
	const filteredRooms = useMemo(() => {
		// First filter by selected block
		let blockFilteredRooms = rooms;
		if (blockId !== -1) {
			blockFilteredRooms = rooms.filter((room) => room.blockId === blockId);
		}

		// Then filter by search query
		if (!roomSearchQuery.trim()) {
			return blockFilteredRooms;
		}
		return blockFilteredRooms.filter((room) =>
			room.code.toLowerCase().includes(roomSearchQuery.toLowerCase()),
		);
	}, [rooms, roomSearchQuery, blockId]);

	return {
		filteredLessons,
		filteredTeachers,
		filteredRooms,
		filteredEvents,
		filteredBlocks,
	};
};

export default useFilteredData;
