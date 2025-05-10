import { useState } from 'react';
import './header.css';

type Role = {
	id: number;
	code: string;
	name: string;
};


type HeaderProps = {
	roles: Role[];
};

const Header = ({ roles }: HeaderProps) => {
	const [activeRole, setActiveRole] = useState(roles[1].id);

	return (
		<header className='header'>
			<div className='header_container'>
				<img src='./logo_aiu.png' alt='' className='header_logo' />
				<h1 className='header_title'>Schedule platform</h1>
				<div className='header_roles'>
					<select
						className='header_select custom_select'
						value={activeRole}
						onChange={(e) => setActiveRole(Number(e.target.value))}
					>
						{roles.map((role) => (
							<option key={role.id} value={role.id}>
								{role.name}
							</option>
						))}
					</select>

					
				</div>
			</div>
		</header>
	);
};

export default Header;
