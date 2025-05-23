import { create } from 'zustand';

import type { Day, TimeSlot, Block, Room } from '../types/types';
import { days, timeSlots, blocks, rooms } from '../mock/stock';

interface StockStore {
	days: Day[];
	timeSlots: TimeSlot[];
	blocks: Block[];
	rooms: Room[];
	isLoading: boolean;
	error: string | null;
	fetchDays: () => Promise<void>;
	fetchTimeSlots: () => Promise<void>;
	fetchBlocks: () => Promise<void>;
	fetchRooms: () => Promise<void>;
}

const useStockStore = create<StockStore>((set) => ({
	days: [],
	timeSlots: [],
	blocks: [],
	rooms: [],
	isLoading: false,
	error: null,

	fetchDays: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
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
			await new Promise((resolve) => setTimeout(resolve, 1000));
			set({ timeSlots: timeSlots, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch time slots',
				isLoading: false,
			});
		}
	},

	fetchBlocks: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			set({ blocks: blocks, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch blocks',
				isLoading: false,
			});
		}
	},

	fetchRooms: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			set({ rooms: rooms, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch rooms',
				isLoading: false,
			});
		}
	},
}));

export default useStockStore;
