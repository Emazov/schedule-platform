import { create } from 'zustand';

import type { Event, Lesson } from '../types/types';
import { lessons, events } from '../mock/lessons';

interface LessonStore {
	lessons: Lesson[];
	events: Event[];
	isLoading: boolean;
	error: string | null;
	fetchLessons: () => Promise<void>;
	fetchEvents: () => Promise<void>;
}

const useLessonStore = create<LessonStore>((set) => ({
	lessons: [],
	events: [],
	isLoading: false,
	error: null,

	fetchLessons: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			set({ lessons: lessons as Lesson[], isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch lessons',
				isLoading: false,
			});
		}
	},

	fetchEvents: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			set({ events: events as Event[], isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch events',
				isLoading: false,
			});
		}
	},
}));

export default useLessonStore;
