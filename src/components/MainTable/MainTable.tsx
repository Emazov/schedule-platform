import { useEffect, useState, useMemo } from 'react';
import './mainTable.css';

import DayRow from './components/DayRow';
import GroupRow from './components/GroupRow';

import type {
	Day,
	TimeSlot,
	Group,
	Schedule,
	Lesson,
	Teacher,
	Room,
} from '../../types/schedule';

type MainTableProps = {
	days: Day[];
	timeSlots: TimeSlot[];
	groups: Group[];
	schedule: Schedule[];
	lessons: Lesson[];
	teachers: Teacher[];
	rooms: Room[];
};

const MainTable = ({
	days,
	timeSlots,
	groups,
	schedule,
	lessons,
	teachers,
	rooms,
}: MainTableProps) => {
	const [selectedDay, setSelectedDay] = useState(days[0].id);
	const [selectedGroup, setSelectedGroup] = useState(1000);
	const [selectedTeacher, setSelectedTeacher] = useState(1000);

	const [activeGroupSchedule, setActiveGroupSchedule] =
		useState<boolean>(false);

	const [activeTeacherSchedule, setActiveTeacherSchedule] =
		useState<boolean>(false);

	const selectedDaySchedule = useMemo(
		() => schedule.filter((lesson) => lesson.dayId === selectedDay),
		[schedule, selectedDay],
	);

	const selectedTeacherSchedule = useMemo(
		() =>
			selectedDaySchedule.filter(
				(lesson) => lesson.teacherId === selectedTeacher,
			),
		[selectedDaySchedule, selectedTeacher],
	);

	const selectedGroupSchedule = useMemo(
		() => schedule.filter((lesson) => lesson.groupId === selectedGroup),
		[schedule, selectedGroup],
	);

	useEffect(() => {
		if (selectedGroup !== 1000) {
			setActiveGroupSchedule(true);
		} else {
			setActiveGroupSchedule(false);
		}
		if (selectedTeacher !== 1000) {
			setActiveTeacherSchedule(true);
		} else {
			setActiveTeacherSchedule(false);
		}
	}, [selectedGroup, selectedTeacher]);

	return (
		<div className='main_table'>
			<div className='main_table_filter'>
				<select
					className='header_select custom_select'
					value={selectedTeacher}
					onChange={(e) => setSelectedTeacher(Number(e.target.value))}
				>
					<option value='1000'>Full schedule</option>
					{teachers.map((teacher) => (
						<option key={teacher.id} value={teacher.id}>
							{teacher.name}
						</option>
					))}
				</select>
			</div>

			<div
				className='main_table__container'
				style={{ gridTemplateColumns: `auto repeat(${timeSlots.length}, 1fr)` }}
			>
				<div className='main_table__header'>
					<select
						value={activeGroupSchedule ? selectedGroup : selectedDay}
						onChange={(e) =>
							activeGroupSchedule
								? setSelectedGroup(Number(e.target.value))
								: setSelectedDay(Number(e.target.value))
						}
						className='custom_select'
					>
						{activeGroupSchedule ? (
							<option value='1000'>Full schedule</option>
						) : (
							''
						)}
						{activeGroupSchedule
							? groups.map((group) => (
									<option key={group.id} value={group.id}>
										{group.title}
									</option>
							  ))
							: days.map((day) => (
									<option key={day.id} value={day.id}>
										{day.title}
									</option>
							  ))}
					</select>
				</div>

				{timeSlots.map((time) => (
					<div
						key={time.slot}
						id={time.id.toString()}
						className='main_table__header'
					>
						{time.slot} <br /> {time.start}-{time.end}
					</div>
				))}

				{activeGroupSchedule
					? days.map((day) => (
							<DayRow
								key={day.id}
								day={day}
								timeSlots={timeSlots}
								lessons={lessons}
								teachers={teachers}
								rooms={rooms}
								selectedTeacher={selectedTeacher}
								activeTeacherSchedule={activeTeacherSchedule}
								selectedGroupSchedule={selectedGroupSchedule}
							/>
					  ))
					: groups.map((group, groupIdx) => (
							<GroupRow
								key={group.id}
								group={group}
								groupIdx={groupIdx}
								timeSlots={timeSlots}
								activeTeacherSchedule={activeTeacherSchedule}
								selectedDaySchedule={selectedDaySchedule}
								selectedTeacherSchedule={selectedTeacherSchedule}
								lessons={lessons}
								teachers={teachers}
								rooms={rooms}
								setSelectedGroup={setSelectedGroup}
							/>
					  ))}
			</div>
		</div>
	);
};

export default MainTable;
