import { create } from 'zustand';

import type { Room, Block } from '@/types/types';
import rooms from '@mock/rooms.json';
import blocks from '@mock/blocks.json';

interface RoomsStore {
	rooms: Room[];
	blocks: Block[];
	isLoading: boolean;
	error: string | null;
	fetchRooms: () => Promise<void>;
}

const useRoomsStore = create<RoomsStore>((set) => ({
	rooms: [],
	blocks: [],
	isLoading: false,
	error: null,

	fetchRooms: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 100));
			set({
				rooms: rooms as Room[],
				blocks: blocks as Block[],
				isLoading: false,
			});
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch rooms',
				isLoading: false,
			});
		}
	},
}));

export default useRoomsStore;
