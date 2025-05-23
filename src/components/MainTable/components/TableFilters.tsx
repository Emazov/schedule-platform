import { UserRole } from '../../../constants';
import useUserStore from '../../../store/useUserStore';
import useGroupStore from '../../../store/useGroupStore';
import { useEffect } from 'react';

type TableFiltersProps = {
	selectedDepartment: number;
	selectedTeacher: number;
	selectedGroup: number;
	onDepartmentChange: (id: number) => void;
	onTeacherChange: (id: number) => void;
	onResetGroupFilter: () => void;
	onResetAllFilters: () => void;
	noSelection: number;
	role: string;
};

const TableFilters = ({
	selectedDepartment,
	selectedTeacher,
	selectedGroup,
	onDepartmentChange,
	onTeacherChange,
	onResetGroupFilter,
	onResetAllFilters,
	noSelection,
	role,
}: TableFiltersProps) => {
	// Получаем данные напрямую из хранилищ
	const { teachers, fetchTeachers } = useUserStore();
	const { departments, fetchDepartments } = useGroupStore();

	// Загружаем данные при монтировании компонента
	useEffect(() => {
		fetchTeachers();
		fetchDepartments();
	}, [fetchTeachers, fetchDepartments]);
	
	// Если данные ещё не загружены, показываем упрощенный интерфейс
	const showTeacherFilter = teachers.length > 0 && (role === UserRole.TEACHER || role === UserRole.ADMIN);
	const showDepartmentFilter = departments.length > 0 && selectedGroup === noSelection;

	return (
		<div className='user_table_filter'>
			{selectedGroup !== noSelection ? (
				<div className='filter_buttons'>
					<div className='table_filters__select' onClick={onResetGroupFilter}>
						All groups
					</div>
					<div className='table_filters__select' onClick={onResetAllFilters}>
						All departments
					</div>
				</div>
			) : showDepartmentFilter ? (
				<select
					className='table_filters__select'
					value={selectedDepartment}
					onChange={(e) => onDepartmentChange(Number(e.target.value))}
				>
					<option value={noSelection}>departments</option>
					{departments.map((department) => (
						<option key={department.id} value={department.id}>
							{department.code}
						</option>
					))}
				</select>
			) : null}

			{showTeacherFilter && (
				<select
					className='table_filters__select'
					value={selectedTeacher}
					onChange={(e) => onTeacherChange(Number(e.target.value))}
				>
					<option value={noSelection}>teachers</option>
					{teachers.map((teacher) => (
						<option key={teacher.id} value={teacher.id}>
							{teacher.firstName} {teacher.lastName}
						</option>
					))}
				</select>
			)}
		</div>
	);
};

export default TableFilters;
