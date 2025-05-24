import { create } from 'zustand';

import type { Schedule } from '@/types/types';
import { schedule } from '@mock/schedule';

interface ScheduleStore {
	schedule: Schedule[];
	isLoading: boolean;
	error: string | null;
	fetchSchedule: () => Promise<void>;
}

const useScheduleStore = create<ScheduleStore>((set) => ({
	schedule: [],
	isLoading: false,
	error: null,

	fetchSchedule: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			set({ schedule: schedule, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch schedule',
				isLoading: false,
			});
		}
	},
}));

export default useScheduleStore;
