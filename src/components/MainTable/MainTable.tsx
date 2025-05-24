import { useState, useMemo, useEffect } from 'react';
import './mainTable.css';

import ActiveTableRow from './components/ActiveTableRow';
import ScheduleGrid from './components/ScheduleGrid';
import TableFilters from './components/TableFilters';

import { NO_SELECTION } from '@constants/index';

import useGroupStore from '@store/useGroupStore';
import useStockStore from '@store/useStockStore';

import type { Day, Group } from '@/types/types';

type MainTableProps = {
	role: string;
};

const MainTable = ({ role }: MainTableProps) => {
	// Получаем только необходимые данные для этого компонента
	const { days, fetchDays } = useStockStore();
	const { departments, groups, fetchDepartments, fetchGroups } =
		useGroupStore();

	// Все состояния объявляем до условных операторов
	const [selectedDay, setSelectedDay] = useState(1);
	const [selectedGroup, setSelectedGroup] = useState(NO_SELECTION);
	const [selectedTeacher, setSelectedTeacher] = useState(NO_SELECTION);
	const [selectedDepartment, setSelectedDepartment] = useState(NO_SELECTION);
	const [activeSchedule, setActiveSchedule] = useState({
		group: true,
		teacher: false,
	});

	// Загружаем базовые данные, необходимые для работы компонента
	useEffect(() => {
		fetchDays();
		fetchDepartments();
		fetchGroups();
	}, [fetchDays, fetchDepartments, fetchGroups]);

	// Обновляем selectedDay, когда days загружены
	useEffect(() => {
		if (days.length > 0) {
			setSelectedDay(days[0].id);
		}
	}, [days]);

	const handleGroupSelect = (groupId: number) => {
		setSelectedGroup(groupId);
	};

	const handleResetGroupFilter = () => {
		setSelectedGroup(NO_SELECTION);
	};

	const handleResetAllFilters = () => {
		setSelectedGroup(NO_SELECTION);
		setSelectedDepartment(NO_SELECTION);
	};

	const filteredGroups = useMemo(() => {
		return selectedDepartment === NO_SELECTION
			? groups
			: groups.filter((group) => group.departmentId === selectedDepartment);
	}, [groups, selectedDepartment]);

	useEffect(() => {
		if (selectedGroup !== NO_SELECTION) {
			const group = groups.find((g) => g.id === selectedGroup);
			if (group) {
				setSelectedDepartment(group.departmentId);
			}
		}
	}, [selectedGroup, groups]);

	useEffect(() => {
		if (selectedDepartment !== NO_SELECTION && selectedGroup !== NO_SELECTION) {
			const group = groups.find((g) => g.id === selectedGroup);
			if (!group || group.departmentId !== selectedDepartment) {
				setSelectedGroup(NO_SELECTION);
			}
		}
	}, [selectedDepartment, selectedGroup, groups]);

	useEffect(() => {
		setActiveSchedule({
			group: selectedGroup !== NO_SELECTION,
			teacher: selectedTeacher !== NO_SELECTION,
		});
	}, [selectedGroup, selectedTeacher]);

	// Если данные ещё не загружены, показываем сообщение о загрузке
	if (days.length === 0 || departments.length === 0 || groups.length === 0) {
		return <div className='loading'>Loading...</div>;
	}

	const renderActiveTable = (row: Group | Day, rowIdx: number) => (
		<ActiveTableRow
			key={row.id}
			row={row}
			rowIdx={rowIdx}
			activeGroupSchedule={activeSchedule.group}
			setSelectedGroup={handleGroupSelect}
			role={role}
			selectedDay={selectedDay}
			selectedGroup={selectedGroup}
			selectedTeacher={selectedTeacher}
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
				{itemsList.map((item) => (
					<option key={item.id} value={item.id}>
						{item.code}
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
							key={`dep-${department.id}`}
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
				selectedDepartment={selectedDepartment}
				selectedTeacher={selectedTeacher}
				selectedGroup={selectedGroup}
				onDepartmentChange={setSelectedDepartment}
				onTeacherChange={setSelectedTeacher}
				onResetGroupFilter={handleResetGroupFilter}
				onResetAllFilters={handleResetAllFilters}
				noSelection={NO_SELECTION}
				role={role}
			/>

			<ScheduleGrid headerContent={renderHeader()}>{renderRows()}</ScheduleGrid>
		</div>
	);
};

export default MainTable;
