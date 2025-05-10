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

	useEffect(() => {
		const firstGroupInDepartment = filteredGroups[0]?.id || NO_SELECTION;
		setSelectedGroup(firstGroupInDepartment);
	}, [selectedDepartment]);

	useEffect(() => {
		if (selectedGroup !== NO_SELECTION) {
			const group = groups.find((g) => g.id === selectedGroup);
			if (group) {
				setSelectedDepartment(group.departmentId);
			}
		}
	}, [selectedGroup]);

	const filteredGroups = useMemo(() => {
		return selectedDepartment === NO_SELECTION
			? groups
			: groups.filter((group) => group.departmentId === selectedDepartment);
	}, [groups, selectedDepartment]);

	const groupSchedule = useMemo(() => {
		if (selectedGroup === NO_SELECTION) return [];
		return schedule.filter((lesson) => lesson.groupId === selectedGroup);
	}, [schedule, selectedGroup]);

	const filteredSchedule = useMemo(() => {
		const base =
			selectedGroup !== NO_SELECTION
				? groupSchedule
				: schedule.filter((lesson) => lesson.dayId === selectedDay);
		return selectedTeacher !== NO_SELECTION
			? base.filter((lesson) => lesson.teacherId === selectedTeacher)
			: base;
	}, [groupSchedule, schedule, selectedDay, selectedTeacher, selectedGroup]);

	useEffect(() => {
		setActiveSchedule({
			group: selectedGroup !== NO_SELECTION,
			teacher: selectedTeacher !== NO_SELECTION,
		});
	}, [selectedGroup, selectedTeacher]);

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
			selectedDaySchedule={filteredSchedule}
			selectedGroupSchedule={filteredSchedule}
			setSelectedGroup={handleGroupSelect}
		/>
	);

	const renderHeader = () => (
		<select
			value={activeSchedule.group ? selectedGroup : selectedDay}
			onChange={(e) =>
				activeSchedule.group
					? setSelectedGroup(Number(e.target.value))
					: setSelectedDay(Number(e.target.value))
			}
			className='custom_select'
		>
			{activeSchedule.group && (
				<option value={NO_SELECTION}>Full schedule</option>
			)}
			{(activeSchedule.group ? filteredGroups : days).map((item) => (
				<option key={item.id} value={item.id}>
					{item.title}
				</option>
			))}
		</select>
	);

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
