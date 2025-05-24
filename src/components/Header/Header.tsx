import './header.css';
import { UserRole } from '@constants/index';

type HeaderProps = {
	email: string;
	onLogout: () => void;
	role: string;
};

const Header = ({ email, onLogout, role }: HeaderProps) => {
	return (
		<header className='header'>
			<div className='header_container'>
				<div className='header_logo'>
					<img src='./logo_aiu.png' alt='' />
					<h1 className='header_title'>Schedule platform</h1>
				</div>
				<div className='header_roles'>
					<div className='header_role'>{email}</div>
					{role === UserRole.ADMIN && <p className='header_role'>{role}</p>}
					<button onClick={onLogout} className='header_logout'>
						Logout
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
