import React, { useState } from 'react';
import './adminTable.css';

import LessonCard from '../LessonCard/LessonCard';

import type {
	Day,
	TimeSlot,
	Department,
	Group,
	Schedule,
	Lesson,
	Teacher,
	Room,
} from '../../types/types';

type AdminTableProps = {
	days: Day[];
	timeSlots: TimeSlot[];
	departments: Department[];
	groups: Group[];
	schedule: Schedule[];
	lessons: Lesson[];
	teachers: Teacher[];
	rooms: Room[];
};

const AdminTable = ({
	days,
	timeSlots,
	departments,
	groups,
	schedule,
	lessons,
	teachers,
	rooms,
}: AdminTableProps) => {
	const [selectedDay, setSelectedDay] = useState<number>(days[0].id);

	const filteredSchedule = schedule.filter(
		(lesson) => lesson.dayId === selectedDay,
	);

	const filteredLessons = lessons.filter((lesson) =>
		filteredSchedule.find((schedule) => schedule.lessonId === lesson.id),
	);

	// Группировка групп по департаментам
	const groupsByDepartment = departments.map((department) => {
		const departmentGroups = groups.filter(
			(group) => group.departmentId === department.id,
		);
		return {
			department,
			groups: departmentGroups,
		};
	});

	return (
		<div className='main_table'>
			<div
				className='main_table__container'
				style={{ gridTemplateColumns: `auto repeat(${timeSlots.length}, 1fr)` }}
			>
				<div className='main_table__header'>
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
					<div key={`timeslot-${time.id}`} className='main_table__header'>
						{time.slot} <br /> {time.start}-{time.end}
					</div>
				))}

				{/* Отображаем департаменты и их группы */}
				{groupsByDepartment.map((item) => (
					<React.Fragment key={`department-${item.department.id}`}>
						{/* Название департамента */}
						<div className='main_table__label' style={{ gridColumn: '1 / -1' }}>
							{item.department.title}
						</div>

						{/* Группы департамента */}
						{item.groups.map((group, groupIdx) => (	
							<React.Fragment key={`group-${group.id}`}>
								<div className='main_table__label'>{group.code}</div>
								{timeSlots.map((time, timeIdx) => {
									// Находим урок для текущей ячейки
									const lessonSchedule = filteredSchedule.find(
										(lesson) =>
											lesson.groupId === group.id &&
											lesson.timeStartId === time.id,
									);

									// Если ячейка занята уроком и это начало урока
									if (lessonSchedule) {
										const lessonData = filteredLessons.find(
											(l) => l.id === lessonSchedule.lessonId,
										);
										// Отображаем ячейку с уроком, растягивая по длительности
										return (
											<div
												key={`cell-${group.id}-${time.id}`}
												id={`cell-${group.id}-${time.id}`}
												className='main_table__cell'
												style={{
													gridColumn: `${timeIdx + 2} / span ${
														lessonSchedule.duration
													}`,
												}}
											>
												{lessonData && (
													<LessonCard
														key={`lesson-card-${lessonSchedule.id}`}
														lesson={lessonData}
														teacher={teachers.find(
															(t) => t.id === lessonSchedule.teacherId,
														)}
														room={rooms.find(
															(r) => r.id === lessonSchedule.roomId,
														)}
													/>
												)}
											</div>
										);
									}

									// Проверяем, не попадает ли эта ячейка в середину урока
									const isOccupied = filteredSchedule.some((lesson) => {
										if (lesson.groupId !== group.id) return false;

										const lessonStartTimeIndex = timeSlots.findIndex(
											(t) => t.id === lesson.timeStartId,
										);

										if (lessonStartTimeIndex === -1) return false;

										return (
											timeIdx > lessonStartTimeIndex &&
											timeIdx < lessonStartTimeIndex + lesson.duration
										);
									});

									// Если ячейка находится в середине урока, пропускаем её
									if (isOccupied) return null;

									// Пустая ячейка
									return (
										<div
											key={`cell-${group.id}-${time.id}`}
											id={`cell-${group.id}-${time.id}`}
											className='main_table__cell'
										></div>
									);
								})}
							</React.Fragment>
						))}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default AdminTable;
