import React, { useState, useEffect } from 'react';
import './adminTable.css';

import useGroupStore from '../../store/useGroupStore';
import useStockStore from '../../store/useStockStore';
import useScheduleStore from '../../store/useScheduleStore';

const AdminTable = () => {
	// Получаем данные напрямую из хранилищ
	const { days, timeSlots, fetchDays, fetchTimeSlots } = useStockStore();
	const { schedule, fetchSchedule } = useScheduleStore();
	const { departments, groups, fetchDepartments, fetchGroups } =
		useGroupStore();

	// Загружаем все необходимые данные при монтировании компонента
	useEffect(() => {
		fetchDays();
		fetchTimeSlots();
		fetchDepartments();
		fetchGroups();
		fetchSchedule();
	}, [fetchDays, fetchTimeSlots, fetchDepartments, fetchGroups, fetchSchedule]);

	// Если данные ещё не загружены, показываем сообщение о загрузке
	if (
		days.length === 0 ||
		timeSlots.length === 0 ||
		departments.length === 0 ||
		groups.length === 0
	) {
		return <div className='loading'>Loading...</div>;
	}

	const [selectedDay, setSelectedDay] = useState<number>(days[0].id);

	const filteredSchedule = schedule.filter(
		(lesson) => lesson.dayId === selectedDay,
	);

	return (
		<div className='main_table'>
			<div
				className='admin_table__header'
				style={{
					gridTemplateColumns: `var(--first-column-width) repeat(${timeSlots.length}, 1fr)`,
				}}
			>
				<div className='admin_table__slot'>
					<select
						value={selectedDay}
						onChange={(e) => setSelectedDay(Number(e.target.value))}
						className='custom_select'
					>
						{days.map((item) => (
							<option key={`day-${item.id}`} value={item.id}>
								{item.code}
							</option>
						))}
					</select>
				</div>
				{timeSlots.map((time) => (
					<div key={`timeslot-${time.slot}`} className='admin_table__slot'>
						{time.slot} Hour <br /> {time.start}-{time.end}
					</div>
				))}
			</div>
			<div className='admin_table__department'>
				{departments.map((department) => (
					<React.Fragment
						key={`department-${department.id}-${department.code}`}
					>
						<div
							key={`department-${department.id}`}
							className='admin_table__department_header'
						>
							<p>{department.title}</p>
						</div>
						<div
							className='admin_table__department_content'
							style={{
								gridTemplateColumns: `var(--first-column-width) repeat(${timeSlots.length}, 1fr)`,
							}}
						>
							{groups
								.filter((group) => group.departmentId === department.id)
								.map((group) => (
									<React.Fragment key={`group-${group.id}`}>
										<div
											key={`group-${group.id}-${group.code}`}
											className='main_table__label'
										>
											{group.code}
										</div>
										{timeSlots.map((time) => {
											// Проверяем, есть ли занятия для этой группы в это время
											const hasLessons = filteredSchedule.some(
												(lesson) =>
													lesson.timeStartId === time.id &&
													lesson.groupId === group.id,
											);

											return (
												<div
													key={`timeslot-${time.slot}-${group.id}`}
													className='main_table__cell'
													// Можно добавить стиль для ячеек с занятиями
													style={
														hasLessons ? { backgroundColor: '#f0f8ff' } : {}
													}
												>
													{/* <LessonCard lesson={scheduledLesson} /> */}
												</div>
											);
										})}
									</React.Fragment>
								))}
						</div>
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default AdminTable;
