import React from 'react';

import SignIn from '../../components/SignIn/SignIn';
import SignUp from '../../components/Signup/Signup';

const account = () => (
	<div className="sign-in-and-sign-up h-100 container">
		<div className="row" style={{ marginTop: '5rem' }}>
			<div className="col-md-6">
				<SignIn />
			</div>
			<div className="col-md-6">
				<SignUp />
			</div>
		</div>
	</div>
);

export default account;
