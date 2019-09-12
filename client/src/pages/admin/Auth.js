import React from 'react';

import { auth } from '../../firebase/firebaseUtils';

class Auth extends React.Component {
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
			await auth.signOut();
			const res = await auth.signInWithEmailAndPassword(email, password);

			if (res.user) {
				this.props.history.replace('/admin/dashboard/orders');
			}
		} catch (e) {
			this.setState({ error: true, disabled: false });
		}
	};

	render() {
		return (
			<section className="container " style={{ height: '100vh' }}>
				<div className="row h-100 p-0 no-gutters">
					<div className="col-md-6 mx-auto my-auto">
						<header className="col-11 mx-auto bg-danger text-white text-center p-2">
							<h3>Max5 Administration</h3>
						</header>

						<div className="col-12">
							<form onSubmit={this.handleSubmit}>
								{this.state.error && (
									<div className="alert alert-danger" role="alert">
										Invalid username / password! Please try again.
									</div>
								)}
								<div className="form-group">
									<label htmlFor="exampleInputEmail1">Email address</label>
									<input
										type="email"
										name="email"
										value={this.state.email}
										className="form-control"
										id="exampleInputEmail1"
										aria-describedby="emailHelp"
										placeholder="Enter email"
										required
										onChange={this.handleChange}
									/>
									<small id="emailHelp" className="form-text text-muted">
										We'll never share your email with anyone else.
									</small>
								</div>
								<div className="form-group">
									<label htmlFor="exampleInputPassword1">Password</label>
									<input
										type="password"
										name="password"
										value={this.state.password}
										className="form-control"
										id="exampleInputPassword1"
										placeholder="Password"
										required
										onChange={this.handleChange}
									/>
								</div>
								<div className="text-center">
									<button type="submit" className="btn btn-danger">
										Submit
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default Auth;
