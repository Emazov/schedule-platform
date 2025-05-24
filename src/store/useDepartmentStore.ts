import { create } from 'zustand';

import type { Department } from '@/types/types';
import departments from '@mock/departments.json';

interface DepartmentStore {
	departments: Department[];
	isLoading: boolean;
	error: string | null;
	fetchDepartments: () => Promise<void>;
}

const useDepartmentStore = create<DepartmentStore>((set) => ({
	departments: [],
	isLoading: false,
	error: null,

	fetchDepartments: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 100));
			set({ departments: departments, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch departments',
				isLoading: false,
			});
		}
	},
}));

export default useDepartmentStore;
