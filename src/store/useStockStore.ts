import { create } from 'zustand';

// 
import days from '@mock/days.json';
import timeSlots from '@mock/timeSlots.json';

// types
import type { Day } from '@/types/types';
import type { TimeSlot } from '@/types/types';

interface StockStore {
	days: Day[];
	timeSlots: TimeSlot[];
	isLoading: boolean;
	error: string | null;
	fetchDays: () => Promise<void>;
	fetchTimeSlots: () => Promise<void>;
}

const useStockStore = create<StockStore>((set) => ({
	days: [],
	timeSlots: [],
	isLoading: false,
	error: null,

	fetchDays: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));
			set({ days: days, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch days',
				isLoading: false,
			});
		}
	},
	fetchTimeSlots: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));
			set({ timeSlots: timeSlots, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch time slots',
				isLoading: false,
			});
		}
	},
}));

export default useStockStore;
