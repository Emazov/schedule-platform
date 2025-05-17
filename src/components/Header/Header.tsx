import './header.css';

type HeaderProps = {
	role: string;
	email: string;
	onLogout: () => void;
};

const Header = ({ email, onLogout }: HeaderProps) => {
	return (
		<header className='header'>
			<div className='header_container'>
				<div className='header_logo'>
					<img src='./logo_aiu.png' alt='' />
					<h1 className='header_title'>Schedule platform</h1>
				</div>
				<div className='header_roles'>
					<div className='header_role'>{email}</div>
					<button onClick={onLogout} className='header_logout'>
						out
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
