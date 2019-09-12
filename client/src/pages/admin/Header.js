import React from 'react';

import Logo from '../../components/Logo/Logo';

const header = () => (
	<header className="col-12 d-none d-sm-block" style={{ backgroundColor: '#E9ECEF', height: '51px' }}>
		<Logo path={'/'} newWindow />
	</header>
);

export default header;
