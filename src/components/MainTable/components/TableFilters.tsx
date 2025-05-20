import type { Department, Teacher } from '../../../types/types';

type TableFiltersProps = {
	departments: Department[];
	teachers: Teacher[];
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
	departments,
	teachers,
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
			) : (
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
			)}

			{!(role === 'student') && (
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
