import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/images/logo.png';

const logo = ({ path, newWindow }) => (
	<Link to={path} className="navbar-brand" target={newWindow ? '_blank' : ''}>
		<img src={Logo} width="100" height="30" alt="brand" />
	</Link>
);

export default logo;
