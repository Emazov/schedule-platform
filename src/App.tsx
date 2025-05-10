import Header from './components/Header/Header';
import MainTable from './components/MainTable/MainTable';
import './App.css';

import {
	roles,
	days,
	timeSlots,
	groups,
	lessons,
	teachers,
	rooms,
} from './data/defaultData';

import { schedule } from './data/schedule';

const App = () => {
	return (
		<main className='main'>
			<Header roles={roles} />
			<MainTable
				days={days}
				timeSlots={timeSlots}
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
