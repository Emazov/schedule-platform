import './App.css';

import Header from '@components/Header/Header';
import AuthForm from '@components/AuthForm/AuthForm';
import MainTable from '@components/MainTable/MainTable';

import { useAuth } from '@hooks/useAuth';

const App = () => {
	const { auth, handleAuth, handleLogout } = useAuth();

	if (!auth.isAuth) {
		return <AuthForm onAuth={handleAuth} />;
	}

	return (
		<main className='main'>
			<Header email={auth.email} onLogout={handleLogout} role={auth.role} />
			<MainTable role={auth.role} />
		</main>
	);
};

export default App;
