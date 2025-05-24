import { create } from 'zustand';

import type { Teacher } from '@/types/types';
import admins from '@mock/admins.json';

interface AdminStore {
	admins: Teacher[];
	isLoading: boolean;
	error: string | null;
	fetchAdmins: () => Promise<void>;
}

const useAdminStore = create<AdminStore>((set) => ({
	admins: [],
	isLoading: false,
	error: null,

	fetchAdmins: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));
			set({ admins: admins, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch admins',
				isLoading: false,
			});
		}
	},
}));

export default useAdminStore;
