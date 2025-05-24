import { create } from 'zustand';

import type { Group } from '@/types/types';
import groups from '@mock/groups.json';

interface GroupsStore {
	groups: Group[];
	isLoading: boolean;
	error: string | null;
	fetchGroups: () => Promise<void>;
}

const useGroupsStore = create<GroupsStore>((set) => ({
	groups: [],
	isLoading: false,
	error: null,

	fetchGroups: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 100));
			set({ groups: groups, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch groups',
				isLoading: false,
			});
		}
	},
}));

export default useGroupsStore;
