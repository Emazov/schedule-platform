import Header from './components/Header/Header';
import MainTable from './components/MainTable/MainTable';
import AuthForm from './components/AuthForm/AuthForm';
import AdminTable from './components/AdminPanel/AdminTable';
import './App.css';

import { days, timeSlots, rooms } from './data/defaultData';
import { teachers } from './data/teachers';
import { departments, groups } from './data/groups';
import { schedule } from './data/schedule';
import { lessons } from './data/lessons';
import { useAuth } from './hooks/useAuth';
import { UserRole } from './constants';

const App = () => {
	const { auth, handleAuth, handleLogout } = useAuth();

	if (!auth.isAuth) {
		return <AuthForm onAuth={handleAuth} />;
	}

	return (
		<main className='main'>
			<Header role={auth.role} email={auth.email} onLogout={handleLogout} />

			{auth.role === UserRole.ADMIN ? (
				<AdminTable
					days={days}
					timeSlots={timeSlots}
					departments={departments}
					groups={groups}
					schedule={schedule}
					lessons={lessons}
					teachers={teachers}
					rooms={rooms}
				/>
			) : (
				<MainTable
					days={days}
					timeSlots={timeSlots}
					departments={departments}
					groups={groups}
					schedule={schedule}
					lessons={lessons}
					teachers={teachers}
					rooms={rooms}
					role={auth.role}
				/>
			)}
		</main>
	);
};

export default App;
