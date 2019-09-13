import React from 'react';

import Logo from '../../components/Logo/Logo';
import { auth } from '../../firebase/firebaseUtils';

const header = () => (
	<header className="col-12 d-none d-sm-block" style={{ backgroundColor: '#E9ECEF', height: '51px' }}>
		<Logo path={'/'} newWindow />
		<a href="/" className="float-right mr-5 mt-3" style={{ cursor: 'pointer' }} onClick={() => auth.signOut()}>
			<i className="fas fa-sign-out-alt" title="Sign out" />
		</a>
	</header>
);

export default header;
