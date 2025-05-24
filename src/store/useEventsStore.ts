import { create } from 'zustand';

import type { Event } from '@/types/types';
import events from '@mock/events.json';

// Ключ для localStorage
const LOCAL_STORAGE_KEY = 'events_data';

// Получение данных из localStorage
const getLocalStorageData = (userEmail?: string): Event[] => {
	try {
		const key = userEmail
			? `${userEmail}:${LOCAL_STORAGE_KEY}`
			: LOCAL_STORAGE_KEY;
		const savedData = localStorage.getItem(key);
		return savedData ? JSON.parse(savedData) : [];
	} catch (error) {
		console.error('Error reading events from localStorage:', error);
		return [];
	}
};

// Сохранение данных в localStorage
const saveToLocalStorage = (data: Event[], userEmail?: string) => {
	try {
		const key = userEmail
			? `${userEmail}:${LOCAL_STORAGE_KEY}`
			: LOCAL_STORAGE_KEY;
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error('Error saving events to localStorage:', error);
	}
};

interface EventStore {
	events: Event[];
	isLoading: boolean;
	error: string | null;
	fetchEvents: (userEmail?: string) => Promise<void>;
	addEvent: (event: Event, userEmail?: string) => void;
	updateEvent: (event: Event, userEmail?: string) => void;
}

const useEventStore = create<EventStore>((set) => ({
	events: [],
	isLoading: false,
	error: null,

	fetchEvents: async (userEmail?: string) => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));
			// Загружаем данные из localStorage, если они есть, иначе из мока
			const localData = getLocalStorageData(userEmail);
			const initialData = localData.length > 0 ? localData : events;
			set({ events: initialData, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch events',
				isLoading: false,
			});
		}
	},

	addEvent: (event: Event, userEmail?: string) => {
		set((state) => {
			const newEvents = [...state.events, event];
			saveToLocalStorage(newEvents, userEmail);
			return { events: newEvents };
		});
	},

	updateEvent: (event: Event, userEmail?: string) => {
		set((state) => {
			const newEvents = state.events.map((item) =>
				item.id === event.id ? event : item,
			);
			saveToLocalStorage(newEvents, userEmail);
			return { events: newEvents };
		});
	},
}));

export default useEventStore;
