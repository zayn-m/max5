import React from 'react';

import './Signup.scss';

import FormInput from '../FormInput/FormInput';

import { auth, createUserProfileDocument } from '../../firebase/firebaseUtils';

class SignUp extends React.Component {
	state = {
		displayName: '',
		email: '',
		password: '',
		confirmPassword: ''
	};

	handleChange = (e) => {
		const { name, value } = e.target;

		this.setState({ [name]: value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		const { displayName, email, password, confirmPassword } = this.state;

		if (password !== confirmPassword) {
			alert('Passwords not matching');
			return;
		}
		try {
			const { user } = await auth.createUserWithEmailAndPassword(email, password);
			console.log('creating user...');
			await createUserProfileDocument(user, { displayName });
			console.log('user created...');
			this.setState(
				{
					displayName: '',
					email: '',
					password: '',
					confirmPassword: ''
				},
				() => {
					console.log('set state to default');
				}
			);
		} catch (e) {
			console.log(e.message);
		}
	};

	render() {
		const { displayName, email, password, confirmPassword } = this.state;
		return (
			<div className="sign-up text-center">
				<h2 className="title">I do not have an account</h2>
				<span>Sign up with your email and password</span>
				<form className="sign-up-form" onSubmit={this.handleSubmit}>
					<FormInput
						type="text"
						name="displayName"
						value={displayName}
						onChange={this.handleChange}
						label="Display Name"
						required
					/>

					<FormInput
						type="email"
						name="email"
						value={email}
						onChange={this.handleChange}
						label="Email"
						required
					/>

					<FormInput
						type="password"
						name="password"
						value={password}
						onChange={this.handleChange}
						label="Password"
						required
					/>

					<FormInput
						type="password"
						name="confirmPassword"
						value={confirmPassword}
						onChange={this.handleChange}
						label="Confirm Password"
						required
					/>

					<button className="form-button btn btn-danger" type="submit">
						Sign Up
					</button>
				</form>
			</div>
		);
	}
}

export default SignUp;
