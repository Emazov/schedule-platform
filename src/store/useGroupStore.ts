import { create } from 'zustand';

import type { Department, Group } from '@/types/types';
import { departments, groups } from '@mock/groups';

interface GroupsStore {
	departments: Department[];
	groups: Group[];
	isLoading: boolean;
	error: string | null;
	fetchDepartments: () => Promise<void>;
	fetchGroups: () => Promise<void>;
}

const useGroupStore = create<GroupsStore>((set) => ({
	departments: [],
	groups: [],
	isLoading: false,
	error: null,

	fetchDepartments: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			set({ departments: departments, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch departments',
				isLoading: false,
			});
		}
	},

	fetchGroups: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			set({ groups: groups, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch groups',
				isLoading: false,
			});
		}
	},
}));

export default useGroupStore;
