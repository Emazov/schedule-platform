import { useEffect, useState, useMemo } from 'react';
import './mainTable.css';

import ActiveTable from './components/ActiveTable';

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
	const NO_SELECTION = -1;

	const [selectedDay, setSelectedDay] = useState(days[0].id);
	const [selectedGroup, setSelectedGroup] = useState(NO_SELECTION);
	const [selectedTeacher, setSelectedTeacher] = useState(NO_SELECTION);

	const [activeGroupSchedule, setActiveGroupSchedule] = useState<boolean>(true);

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
		if (selectedGroup !== NO_SELECTION) {
			setActiveGroupSchedule(true);
		} else {
			setActiveGroupSchedule(false);
		}
		if (selectedTeacher !== NO_SELECTION) {
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
					<option value={NO_SELECTION}>Filter by teacher</option>
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
							<option value={NO_SELECTION}>Full schedule</option>
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
					? days.map((day, dayIdx) => (
							<ActiveTable
								key={day.id}
								row={day}
								rowIdx={dayIdx}
								timeSlots={timeSlots}
								lessons={lessons}
								teachers={teachers}
								rooms={rooms}
								activeGroupSchedule={activeGroupSchedule}
								activeTeacherSchedule={activeTeacherSchedule}
								selectedDaySchedule={selectedDaySchedule}
								selectedTeacherSchedule={selectedTeacherSchedule}
								selectedTeacher={selectedTeacher}
								selectedGroupSchedule={selectedGroupSchedule}
								setSelectedGroup={setSelectedGroup}
							/>
					  ))
					: groups.map((group, groupIdx) => (
							<ActiveTable
								key={group.id}
								row={group}
								rowIdx={groupIdx}
								timeSlots={timeSlots}
								lessons={lessons}
								teachers={teachers}
								rooms={rooms}
								activeGroupSchedule={activeGroupSchedule}
								activeTeacherSchedule={activeTeacherSchedule}
								selectedDaySchedule={selectedDaySchedule}
								selectedTeacherSchedule={selectedTeacherSchedule}
								selectedTeacher={selectedTeacher}
								selectedGroupSchedule={selectedGroupSchedule}
								setSelectedGroup={setSelectedGroup}
							/>
					  ))}
			</div>
		</div>
	);
};

export default MainTable;
