import { create } from 'zustand';

import type { Schedule } from '@/types/types';
import schedule from '@mock/schedule.json';

// Ключ для localStorage
const LOCAL_STORAGE_KEY = 'schedule_data';

// Получение данных из localStorage
const getLocalStorageData = (userEmail?: string): Schedule[] => {
	try {
		const key = userEmail
			? `${userEmail}:${LOCAL_STORAGE_KEY}`
			: LOCAL_STORAGE_KEY;
		const savedData = localStorage.getItem(key);
		return savedData ? JSON.parse(savedData) : [];
	} catch (error) {
		console.error('Error reading schedule from localStorage:', error);
		return [];
	}
};

// Сохранение данных в localStorage
const saveToLocalStorage = (data: Schedule[], userEmail?: string) => {
	try {
		const key = userEmail
			? `${userEmail}:${LOCAL_STORAGE_KEY}`
			: LOCAL_STORAGE_KEY;
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error('Error saving schedule to localStorage:', error);
	}
};

interface ScheduleStore {
	schedule: Schedule[];
	isLoading: boolean;
	error: string | null;
	fetchSchedule: (userEmail?: string) => Promise<void>;
	addScheduleItem: (item: Schedule, userEmail?: string) => void;
	updateScheduleItem: (item: Schedule, userEmail?: string) => void;
	deleteScheduleItem: (id: number, userEmail?: string) => void;
}

const useScheduleStore = create<ScheduleStore>((set) => ({
	schedule: [],
	isLoading: false,
	error: null,

	fetchSchedule: async (userEmail?: string) => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 100));
			// Загружаем данные из localStorage, если они есть, иначе из мока
			const localData = getLocalStorageData(userEmail);
			const initialData = localData.length > 0 ? localData : schedule;
			set({ schedule: initialData, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch schedule',
				isLoading: false,
			});
		}
	},

	addScheduleItem: (item: Schedule, userEmail?: string) => {
		set((state) => {
			const newSchedule = [...state.schedule, item];
			saveToLocalStorage(newSchedule, userEmail);
			return { schedule: newSchedule };
		});
	},

	updateScheduleItem: (item: Schedule, userEmail?: string) => {
		set((state) => {
			const newSchedule = state.schedule.map((scheduleItem) =>
				scheduleItem.id === item.id ? item : scheduleItem,
			);
			saveToLocalStorage(newSchedule, userEmail);
			return { schedule: newSchedule };
		});
	},

	deleteScheduleItem: (id: number, userEmail?: string) => {
		set((state) => {
			const newSchedule = state.schedule.filter((item) => item.id !== id);
			saveToLocalStorage(newSchedule, userEmail);
			return { schedule: newSchedule };
		});
	},
}));

export default useScheduleStore;
