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
	const [activeSchedule, setActiveSchedule] = useState({
		group: true,
		teacher: false,
	});

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
			{(activeSchedule.group ? groups : days).map((item) => (
				<option key={item.id} value={item.id}>
					{item.title}
				</option>
			))}
		</select>
	);

	const renderTimeSlots = () =>
		timeSlots.map((time) => (
			<div
				key={time.slot}
				id={time.id.toString()}
				className='main_table__header'
			>
				{time.slot} <br /> {time.start}-{time.end}
			</div>
		));

	const renderRows = () =>
		(activeSchedule.group ? days : groups).map((row, idx) => (
			<ActiveTable
				key={row.id}
				row={row}
				rowIdx={idx}
				timeSlots={timeSlots}
				lessons={lessons}
				teachers={teachers}
				rooms={rooms}
				activeGroupSchedule={activeSchedule.group}
				selectedDaySchedule={filteredSchedule}
				selectedGroupSchedule={filteredSchedule}
				setSelectedGroup={setSelectedGroup}
			/>
		));

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
				<div className='main_table__header'>{renderHeader()}</div>
				{renderTimeSlots()}
				{renderRows()}
			</div>
		</div>
	);
};

export default MainTable;
