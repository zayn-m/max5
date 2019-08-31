import React from 'react';

import './SignIn.scss';

import { auth, signInWithGoogle } from '../../firebase/firebaseUtils';

import GoogleIcon from '../../assets/images/icons/google.png';
import FormInput from '../FormInput/FormInput';

class SignIn extends React.Component {
	state = {
		email: '',
		password: ''
	};

	handleChange = (e) => {
		const { value, name } = e.target;
		this.setState({ [name]: value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		const { email, password } = this.state;

		try {
			await auth.signInWithEmailAndPassword(email, password);
			this.setState({
				email: '',
				password: ''
			});
		} catch (e) {
			console.log(e.message);
		}
	};

	render() {
		return (
			<div className="sign-in text-center">
				<h2>I already have an account</h2>
				<span>Sign in with your email and password</span>

				<form onSubmit={this.handleSubmit}>
					<FormInput
						type="email"
						name="email"
						label="Email"
						value={this.state.email}
						required
						handleChange={this.handleChange}
					/>

					<FormInput
						type="password"
						name="password"
						label="Password"
						value={this.state.password}
						required
						handleChange={this.handleChange}
					/>

					<div className="buttons">
						<button className="form-button btn btn-danger" type="submit">
							Sign In
						</button>
						<button
							className="form-button"
							style={{ backgroundColor: '#5582FD' }}
							onClick={signInWithGoogle}
						>
							<img src={GoogleIcon} alt="google" width={25} height={25} /> Sign In with Google
						</button>
					</div>
				</form>
			</div>
		);
	}
}

export default SignIn;
