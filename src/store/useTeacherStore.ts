import { create } from 'zustand';

import type { Teacher } from '@/types/types';
import teachers from '@mock/teachers.json';

interface TeacherStore {
	teachers: Teacher[];
	isLoading: boolean;
	error: string | null;
	fetchTeachers: () => Promise<void>;
}

const useTeacherStore = create<TeacherStore>((set) => ({
	teachers: [],
	isLoading: false,
	error: null,

	fetchTeachers: async () => {
		set({ isLoading: true, error: null });
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));
			set({ teachers: teachers, isLoading: false });
		} catch (error: any) {
			set({
				error: error?.message || 'Failed to fetch teachers',
				isLoading: false,
			});
		}
	},
}));

export default useTeacherStore;
