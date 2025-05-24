import { create } from 'zustand';

import type { Teacher } from '@/types/types';
import { admins, teachers } from '@mock/users';

interface UserStore {
	admins: Teacher[];
	teachers: Teacher[];
	isLoading: boolean;
	error: string | null;
	fetchAdmins: () => Promise<void>;
	fetchTeachers: () => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
	admins: [],
	teachers: [],
	isLoading: false,
	error: null,

	fetchAdmins: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			set({ admins: admins, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch admins',
				isLoading: false,
			});
		}
	},

	fetchTeachers: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			set({ teachers: teachers, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch teachers',
				isLoading: false,
			});
		}
	},
}));

export default useUserStore;
