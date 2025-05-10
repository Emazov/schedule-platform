import { useEffect, useState, useMemo } from 'react';
import './mainTable.css';

import ActiveTableRow from './components/ActiveTableRow';
import ScheduleGrid from './components/ScheduleGrid';
import TableFilters from './components/TableFilters';

import type {
	Day,
	TimeSlot,
	Department,
	Group,
	Schedule,
	Lesson,
	Teacher,
	Room,
} from '../../types/schedule';

type MainTableProps = {
	days: Day[];
	timeSlots: TimeSlot[];
	departments: Department[];
	groups: Group[];
	schedule: Schedule[];
	lessons: Lesson[];
	teachers: Teacher[];
	rooms: Room[];
};

const MainTable = ({
	days,
	timeSlots,
	departments,
	groups,
	schedule,
	lessons,
	teachers,
	rooms,
}: MainTableProps) => {
	const NO_SELECTION = -1;

	const [selectedDay, setSelectedDay] = useState(days[0].id);
	const [selectedGroup, setSelectedGroup] = useState(NO_SELECTION);
	const [selectedTeacher, setSelectedTeacher] = useState(NO_SELECTION);
	const [selectedDepartment, setSelectedDepartment] = useState(
		departments[0].id,
	);

	const [activeSchedule, setActiveSchedule] = useState({
		group: true,
		teacher: false,
	});

	const handleGroupSelect = (groupId: number) => {
		setSelectedGroup(groupId);
		const group = groups.find((g) => g.id === groupId);
		if (group) {
			setSelectedDepartment(group.departmentId);
		}
	};

	const filteredGroups = useMemo(() => {
		return selectedDepartment === NO_SELECTION
			? groups
			: groups.filter((group) => group.departmentId === selectedDepartment);
	}, [groups, selectedDepartment, NO_SELECTION]);

	useEffect(() => {
		const firstGroupInDepartment = filteredGroups[0]?.id || NO_SELECTION;
		setSelectedGroup(firstGroupInDepartment);
	}, [filteredGroups, NO_SELECTION]);

	useEffect(() => {
		if (selectedGroup !== NO_SELECTION) {
			const group = groups.find((g) => g.id === selectedGroup);
			if (group) {
				setSelectedDepartment(group.departmentId);
			}
		}
	}, [selectedGroup, groups, NO_SELECTION]);

	const groupSchedule = useMemo(() => {
		if (selectedGroup === NO_SELECTION) return [];
		return schedule.filter((lesson) => lesson.groupId === selectedGroup);
	}, [schedule, selectedGroup, NO_SELECTION]);

	const currentSchedule = useMemo(() => {
		const baseSchedule =
			selectedGroup !== NO_SELECTION
				? groupSchedule
				: schedule.filter((lesson) => lesson.dayId === selectedDay);

		return selectedTeacher !== NO_SELECTION
			? baseSchedule.filter((lesson) => lesson.teacherId === selectedTeacher)
			: baseSchedule;
	}, [
		groupSchedule,
		schedule,
		selectedDay,
		selectedTeacher,
		selectedGroup,
		NO_SELECTION,
	]);

	useEffect(() => {
		setActiveSchedule({
			group: selectedGroup !== NO_SELECTION,
			teacher: selectedTeacher !== NO_SELECTION,
		});
	}, [selectedGroup, selectedTeacher, NO_SELECTION]);

	const renderActiveTable = (row: Group | Day, rowIdx: number) => (
		<ActiveTableRow
			key={row.id}
			row={row}
			rowIdx={rowIdx}
			timeSlots={timeSlots}
			lessons={lessons}
			teachers={teachers}
			rooms={rooms}
			activeGroupSchedule={activeSchedule.group}
			currentSchedule={currentSchedule}
			setSelectedGroup={handleGroupSelect}
		/>
	);

	const renderHeader = () => {
		const isGroupView = activeSchedule.group;
		const selectValue = isGroupView ? selectedGroup : selectedDay;
		const itemsList = isGroupView ? filteredGroups : days;

		const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
			const value = Number(e.target.value);
			if (isGroupView) {
				setSelectedGroup(value);
			} else {
				setSelectedDay(value);
			}
		};

		return (
			<select
				value={selectValue}
				onChange={handleSelectChange}
				className='custom_select'
			>
				{isGroupView && <option value={NO_SELECTION}>Full schedule</option>}
				{itemsList.map((item) => (
					<option key={item.id} value={item.id}>
						{item.title}
					</option>
				))}
			</select>
		);
	};

	const renderRows = () => {
		if (activeSchedule.group) {
			return days.map((row, idx) => renderActiveTable(row, idx));
		}

		if (selectedDepartment === NO_SELECTION) {
			let currentRow = 0;
			return departments
				.map((department) => {
					const departmentGroups = filteredGroups.filter(
						(group) => group.departmentId === department.id,
					);

					const rows = [
						<div
							key={`dept-${department.id}`}
							className='main_table__department_header'
							style={{
								gridRow: currentRow + 2,
								gridColumn: '1 / -1',
							}}
						>
							{department.title}
						</div>,
						...departmentGroups.map((group) => {
							currentRow++;
							return renderActiveTable(group, currentRow);
						}),
					];
					currentRow++;
					return rows;
				})
				.flat();
		}

		return filteredGroups.map((row, idx) => renderActiveTable(row, idx));
	};

	return (
		<div className='main_table'>
			<TableFilters
				departments={departments}
				teachers={teachers}
				selectedDepartment={selectedDepartment}
				selectedTeacher={selectedTeacher}
				onDepartmentChange={setSelectedDepartment}
				onTeacherChange={setSelectedTeacher}
				noSelection={NO_SELECTION}
			/>

			<ScheduleGrid timeSlots={timeSlots} headerContent={renderHeader()}>
				{renderRows()}
			</ScheduleGrid>
		</div>
	);
};

export default MainTable;
