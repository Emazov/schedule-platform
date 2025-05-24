import { useState, useEffect } from 'react';
import './authForm.css';

import { UserRole } from '@constants/index';
import useUserStore from '@store/useUserStore';

type AuthFormProps = {
	onAuth: (role: string, email: string) => void;
};

const AuthForm = ({ onAuth }: AuthFormProps) => {
	const [email, setEmail] = useState('');
	const { admins, teachers, fetchAdmins, fetchTeachers } = useUserStore();

	useEffect(() => {
		fetchAdmins();
		fetchTeachers();
	}, [fetchAdmins, fetchTeachers]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const admin = admins.find((a) => a.email === email);
		if (admin) {
			onAuth(UserRole.ADMIN, email);
			return;
		}

		const teacher = teachers.find((t) => t.email === email);
		if (teacher) {
			onAuth(UserRole.TEACHER, email);
			return;
		}

		onAuth(UserRole.STUDENT, email);
	};

	return (
		<div className='auth_form_wrapper'>
			<form className='auth_form' onSubmit={handleSubmit}>
				<h2>Schedule platform</h2>
				<input
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder='Enter email'
					required
					autoComplete='off'
				/>
				<button type='submit'>Login</button>
			</form>
		</div>
	);
};

export default AuthForm;
