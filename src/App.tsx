import Header from './components/Header/Header';
import MainTable from './components/MainTable/MainTable';
import './App.css';

import {
	roles,
	days,
	timeSlots,
	teachers,
	rooms,
} from './data/defaultData';

import { departments, groups } from './data/groups';
import { schedule } from './data/schedule';
import { lessons } from './data/lessons';

const App = () => {
	return (
		<main className='main'>
			<Header roles={roles} />
			<MainTable
				days={days}
				timeSlots={timeSlots}
				departments={departments}
				groups={groups}
				schedule={schedule}
				lessons={lessons}
				teachers={teachers}
				rooms={rooms}
			/>
		</main>
	);
};

export default App;
