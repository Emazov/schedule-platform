import Header from '@components/Header/Header';
import MainTable from '@components/MainTable/MainTable';
import AuthForm from '@components/AuthForm/AuthForm';
import AdminPanel from '@components/AdminPanel/AdminPanel';
import './App.css';

import { useAuth } from '@hooks/useAuth';
import { UserRole } from '@constants/index';

const App = () => {
	const { auth, handleAuth, handleLogout } = useAuth();

	if (!auth.isAuth) {
		return <AuthForm onAuth={handleAuth} />;
	}

	const isAdmin = auth.role === UserRole.ADMIN;

	return (
		<main className='main'>
			<Header email={auth.email} onLogout={handleLogout} role={auth.role} />

			{isAdmin ? <AdminPanel /> : <MainTable role={auth.role} />}
		</main>
	);
};

export default App;
