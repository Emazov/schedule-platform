import type { Department, Teacher } from '../../../types/schedule';

type TableFiltersProps = {
	departments: Department[];
	teachers: Teacher[];
	selectedDepartment: number;
	selectedTeacher: number;
	onDepartmentChange: (id: number) => void;
	onTeacherChange: (id: number) => void;
	noSelection: number;
};

const TableFilters = ({
	departments,
	teachers,
	selectedDepartment,
	selectedTeacher,
	onDepartmentChange,
	onTeacherChange,
	noSelection,
}: TableFiltersProps) => {
	return (
		<div className='main_table_filter'>
			<h3 className='main_table_filter__title'>Filter by</h3>

			<select
				className='header_select custom_select'
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

			<select
				className='header_select custom_select'
				value={selectedTeacher}
				onChange={(e) => onTeacherChange(Number(e.target.value))}
			>
				<option value={noSelection}>teacher</option>
				{teachers.map((teacher) => (
					<option key={teacher.id} value={teacher.id}>
						{teacher.name}
					</option>
				))}
			</select>
		</div>
	);
};

export default TableFilters;
