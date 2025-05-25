import styles from './MainTable.module.css';
import Select from 'react-select';

// components
import { useTableData } from './hooks/useTableData';
import { TableHeader } from './components/TableHeader';
import { DepartmentSection } from './components/DepartmentSection/DepartmentSection';
import { GroupView } from './components/GroupView/GroupView';
import Loader from '@/components/Loader/Loader';

// constants
import { NO_SELECTION, UserRole } from '@/constants';

type MainTableProps = {
	role: string;
	email: string;
};

type OptionType = {
	value: number;
	label: string;
};

const MainTable = ({ role, email }: MainTableProps) => {
	const {
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
	} = useTableData({ role, email });

	// Formatting data for react-select
	const teacherOptions: OptionType[] = [
		{ value: NO_SELECTION, label: 'Teacher' },
		...teachers.map((teacher) => ({
			value: teacher.id,
			label: `${teacher.firstName} ${teacher.lastName}`,
		})),
	];

	const departmentOptions: OptionType[] = [
		{ value: NO_SELECTION, label: 'Department' },
		...departments.map((department) => ({
			value: department.id,
			label: department.code,
		})),
	];

	// Handlers for react-select
	const handleTeacherSelectChange = (option: OptionType | null) => {
		const value = option ? option.value : NO_SELECTION;
		const fakeEvent = {
			target: { value },
		} as unknown as React.ChangeEvent<HTMLSelectElement>;
		handleTeacherChange(fakeEvent);
	};

	const handleDepartmentSelectChange = (option: OptionType | null) => {
		const value = option ? option.value : NO_SELECTION;
		const fakeEvent = {
			target: { value },
		} as unknown as React.ChangeEvent<HTMLSelectElement>;
		handleDepartmentChange(fakeEvent);
	};

	if (isLoading) {
		return <Loader />;
	}

	if (isGroupView && (role === UserRole.STUDENT || role === UserRole.ADMIN)) {
		return (
			<div className={styles.table}>
				<GroupView
					selectedGroup={selectedGroup}
					filteredSchedule={filteredSchedule}
					onGroupChange={handleGroupChange}
					onBackToNormalView={handleBackToNormalView}
					role={role}
				/>
			</div>
		);
	}

	return (
		<div className={styles.table}>
			<div className={styles.table_filters}>
				{(role === UserRole.TEACHER || role === UserRole.ADMIN) && (
					<div className={styles.select_wrapper}>
						<Select
							className={styles.select_container}
							classNamePrefix='react-select'
							options={teacherOptions}
							onChange={handleTeacherSelectChange}
							value={
								teacherOptions.find(
									(option) => option.value === selectedTeacher,
								) || null
							}
							placeholder='Select teacher...'
							isClearable
							menuPortalTarget={document.body}
							styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
						/>
					</div>
				)}

				<div className={styles.select_wrapper}>
					<Select
						className={styles.select_container}
						classNamePrefix='react-select'
						options={departmentOptions}
						onChange={handleDepartmentSelectChange}
						value={
							departmentOptions.find(
								(option) => option.value === selectedDepartment,
							) || null
						}
						placeholder='Select department...'
						isClearable
						menuPortalTarget={document.body}
						styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
					/>
				</div>
			</div>

			<div
				className={styles.container}
				style={{ gridTemplateColumns: `auto repeat(${timeSlots.length}, 1fr)` }}
			>
				<TableHeader selectedDay={selectedDay} onDayChange={handleDayChange} />

				{filteredDepartments.map((department) => (
					<DepartmentSection
						key={department.id}
						role={role}
						department={department}
						filteredSchedule={filteredSchedule}
						onGroupSelect={handleGroupSelect}
						selectedDay={selectedDay}
					/>
				))}
			</div>
		</div>
	);
};

export default MainTable;
