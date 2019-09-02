import React from 'react';

import { auth, signInWithGoogle } from '../../firebase/firebaseUtils';

import GoogleIcon from '../../assets/images/icons/google.png';
import FormInput from '../FormInput/FormInput';

class SignIn extends React.Component {
	state = {
		disabled: false,
		error: false,
		email: '',
		password: ''
	};

	handleChange = (e) => {
		const { value, name } = e.target;
		this.setState({ [name]: value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		this.setState({ disabled: true });
		const { email, password } = this.state;

		try {
			await auth.signInWithEmailAndPassword(email, password);
			this.setState({
				email: '',
				password: '',
				disabled: false,
				error: false
			});
		} catch (e) {
			this.setState({ error: true, disabled: false });
			console.log(e.message);
		}
	};

	render() {
		return (
			<div className="sign-in text-center">
				<h2>I already have an account</h2>
				<span>Sign in with your email and password</span>

				<form onSubmit={this.handleSubmit}>
					{this.state.error && (
						<div className="alert alert-danger" role="alert">
							Invalid username / password! Please try again.
						</div>
					)}
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
						<button className="form-button btn btn-danger" type="submit" disabled={this.state.disabled}>
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
