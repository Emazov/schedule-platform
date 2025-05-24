import { create } from 'zustand';

import type { Lesson } from '@/types/types';
import lessons from '@mock/lessons.json';

// Key for localStorage
const LOCAL_STORAGE_KEY = 'lessons_data';

// Get data from localStorage
const getLocalStorageData = (userEmail?: string): Lesson[] => {
	try {
		const key = userEmail
			? `${userEmail}:${LOCAL_STORAGE_KEY}`
			: LOCAL_STORAGE_KEY;
		const savedData = localStorage.getItem(key);
		return savedData ? JSON.parse(savedData) : [];
	} catch (error) {
		console.error('Error reading lessons from localStorage:', error);
		return [];
	}
};

// Save data to localStorage
const saveToLocalStorage = (data: Lesson[], userEmail?: string) => {
	try {
		const key = userEmail
			? `${userEmail}:${LOCAL_STORAGE_KEY}`
			: LOCAL_STORAGE_KEY;
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error('Error saving lessons to localStorage:', error);
	}
};

interface LessonsStore {
	lessons: Lesson[];
	isLoading: boolean;
	error: string | null;
	fetchLessons: (userEmail?: string) => Promise<void>;
	addLesson: (lesson: Lesson, userEmail?: string) => void;
	updateLesson: (lesson: Lesson, userEmail?: string) => void;
}

const useLessonsStore = create<LessonsStore>((set) => ({
	lessons: [],
	isLoading: false,
	error: null,

	fetchLessons: async (userEmail?: string) => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 100));
			// Load data from localStorage if available, otherwise from mock
			const localData = getLocalStorageData(userEmail);
			const initialData = localData.length > 0 ? localData : lessons;
			set({ lessons: initialData, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch lessons',
				isLoading: false,
			});
		}
	},

	addLesson: (lesson: Lesson, userEmail?: string) => {
		set((state) => {
			const newLessons = [...state.lessons, lesson];
			saveToLocalStorage(newLessons, userEmail);
			return { lessons: newLessons };
		});
	},

	updateLesson: (lesson: Lesson, userEmail?: string) => {
		set((state) => {
			const newLessons = state.lessons.map((item) =>
				item.id === lesson.id ? lesson : item,
			);
			saveToLocalStorage(newLessons, userEmail);
			return { lessons: newLessons };
		});
	},
}));

export default useLessonsStore;
