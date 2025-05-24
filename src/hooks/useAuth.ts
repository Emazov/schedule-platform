import { useState, useEffect } from 'react';
import type { AuthState } from '@/types/types';

export const useAuth = () => {
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

	return { auth, handleAuth, handleLogout };
};
