import type { Schedule, Group } from '../types/types';
import { NO_SELECTION } from '../constants';

export const filterScheduleByGroup = (
	schedule: Schedule[],
	selectedGroup: number,
): Schedule[] => {
	return schedule.filter((lesson) => lesson.groupId === selectedGroup);
};

export const filterScheduleByDay = (
	schedule: Schedule[],
	selectedDay: number,
): Schedule[] => {
	return schedule.filter((lesson) => lesson.dayId === selectedDay);
};

export const filterScheduleByTeacher = (
	schedule: Schedule[],
	selectedTeacher: number,
): Schedule[] => {
	return schedule.filter((lesson) => lesson.teacherId === selectedTeacher);
};

export const filterScheduleByDepartment = (
	schedule: Schedule[],
	groups: Group[],
	selectedDepartment: number,
): Schedule[] => {
	return schedule.filter((lesson) => {
		const group = groups.find((g) => g.id === lesson.groupId);
		return group && group.departmentId === selectedDepartment;
	});
};

export const getFilteredGroups = (
	groups: Group[],
	selectedDepartment: number,
): Group[] => {
	return selectedDepartment === NO_SELECTION
		? groups
		: groups.filter((group) => group.departmentId === selectedDepartment);
};
