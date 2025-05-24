import { useEffect, useState, useMemo } from 'react';
import type { ChangeEvent } from 'react';

import useStockStore from '@/store/useStockStore';
import useDepartmentsStore from '@/store/useDepartmentStore';
import useGroupsStore from '@store/useGroupsStore';
import useScheduleStore from '@/store/useScheduleStore';
import useLessonsStore from '@/store/useLessonsStore';
import useEventsStore from '@/store/useEventsStore';
import useTeacherStore from '@/store/useTeacherStore';
import useRoomsStore from '@/store/useRoomsStore';
import { NO_SELECTION } from '@/constants';

type UseTableDataProps = {
	role: string;
	email?: string;
};

export const useTableData = (
	{ role, email }: UseTableDataProps = { role: '' },
) => {
	const timeSlots = useStockStore((state) => state.timeSlots);
	const fetchDays = useStockStore((state) => state.fetchDays);
	const fetchTimeSlots = useStockStore((state) => state.fetchTimeSlots);
	const departments = useDepartmentsStore((state) => state.departments);
	const fetchDepartments = useDepartmentsStore(
		(state) => state.fetchDepartments,
	);
	const schedule = useScheduleStore((state) => state.schedule);
	const teachers = useTeacherStore((state) => state.teachers);
	const fetchGroups = useGroupsStore((state) => state.fetchGroups);
	const fetchSchedule = useScheduleStore((state) => state.fetchSchedule);
	const fetchEvents = useEventsStore((state) => state.fetchEvents);
	const fetchLessons = useLessonsStore((state) => state.fetchLessons);
	const fetchTeachers = useTeacherStore((state) => state.fetchTeachers);
	const fetchRooms = useRoomsStore((state) => state.fetchRooms);
	const addScheduleItem = useScheduleStore((state) => state.addScheduleItem);
	const updateScheduleItem = useScheduleStore(
		(state) => state.updateScheduleItem,
	);
	const deleteScheduleItem = useScheduleStore(
		(state) => state.deleteScheduleItem,
	);

	const [selectedDay, setSelectedDay] = useState<number>(1);
	const [selectedTeacher, setSelectedTeacher] = useState(NO_SELECTION);
	const [selectedDepartment, setSelectedDepartment] = useState(NO_SELECTION);
	const [selectedGroup, setSelectedGroup] = useState(NO_SELECTION);
	const [isGroupView, setIsGroupView] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				await Promise.all([
					fetchDays(),
					fetchTimeSlots(),
					fetchDepartments(),
					fetchGroups(),
					fetchTeachers(),
					fetchRooms(),
					fetchEvents(email),
					fetchLessons(email),
					fetchSchedule(email),
				]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [email]);

	// Функция добавления элемента расписания с учетом email пользователя
	const handleAddScheduleItem = (item: any) => {
		addScheduleItem(item, email);
	};

	// Функция обновления элемента расписания с учетом email пользователя
	const handleUpdateScheduleItem = (item: any) => {
		updateScheduleItem(item, email);
	};

	// Функция удаления элемента расписания с учетом email пользователя
	const handleDeleteScheduleItem = (id: number) => {
		deleteScheduleItem(id, email);
	};

	const handleDayChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedDay(Number(e.target.value));
	};

	const handleTeacherChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedTeacher(Number(e.target.value));
	};

	const handleDepartmentChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedDepartment(Number(e.target.value));
	};

	const handleGroupSelect = (groupId: number) => {
		setSelectedGroup(groupId);
		setIsGroupView(true);
	};

	const handleBackToNormalView = () => {
		setIsGroupView(false);
		setSelectedGroup(NO_SELECTION);
	};

	const handleGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedGroup(Number(e.target.value));
	};

	const filteredDepartments = useMemo(() => {
		return departments.filter(
			(department) =>
				department.id === selectedDepartment ||
				selectedDepartment === NO_SELECTION,
		);
	}, [departments, selectedDepartment]);

	const filteredSchedule = useMemo(() => {
		if (isGroupView) {
			return schedule.filter((lesson) => lesson.groupId === selectedGroup);
		}

		return schedule.filter(
			(lesson) =>
				lesson.dayId === selectedDay &&
				(lesson.teacherId === selectedTeacher ||
					selectedTeacher === NO_SELECTION),
		);
	}, [schedule, selectedDay, selectedTeacher, selectedGroup, isGroupView]);

	return {
		timeSlots,
		departments,
		teachers,
		selectedDay,
		selectedTeacher,
		selectedDepartment,
		selectedGroup,
		isGroupView,
		isLoading,
		filteredDepartments,
		filteredSchedule,
		handleDayChange,
		handleTeacherChange,
		handleDepartmentChange,
		handleGroupSelect,
		handleBackToNormalView,
		handleGroupChange,
		handleAddScheduleItem,
		handleUpdateScheduleItem,
		handleDeleteScheduleItem,
	};
};
