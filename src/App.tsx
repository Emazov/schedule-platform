import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import MainTable from './components/MainTable/MainTable';
import AuthForm from './components/AuthForm/AuthForm';
import AdminTable from './components/AdminPanel/AdminTable';
import './App.css';

import { days, timeSlots, rooms } from './data/defaultData';
import { teachers } from './data/users';

import { departments, groups } from './data/groups';
import { schedule } from './data/schedule';
import { lessons } from './data/lessons';
import type { AuthState } from './types/types';

const App = () => {
	const [auth, setAuth] = useState<AuthState>(() => {
		const saved = localStorage.getItem('auth');
		return saved ? JSON.parse(saved) : { isAuth: false, role: '' };
	});

	useEffect(() => {
		localStorage.setItem('auth', JSON.stringify(auth));
	}, [auth]);

	const handleAuth = (role: string, email: string) => {
		setAuth({
			isAuth: true,
			role,
			email,
		});
	};

	const handleLogout = () => {
		setAuth({
			isAuth: false,
			role: '',
			email: '',
		});
		localStorage.removeItem('auth');
	};

	if (!auth.isAuth) {
		return <AuthForm onAuth={handleAuth} />;
	}

	return (
		<main className='main'>
			<Header
				role={auth.role}
				email={auth.email}
				onLogout={handleLogout}
			/>

			{auth.role === 'admin' ? (
				<AdminTable />
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
