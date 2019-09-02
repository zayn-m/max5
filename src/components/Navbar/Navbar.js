import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth } from '../../firebase/firebaseUtils';
import { createStructuredSelector } from 'reselect';
import { selectCartHidden } from '../../store/selectors/cart';
import { selectCurrentUser } from '../../store/selectors/user';

import Logo from '../../assets/images/logo.png';
import CartIcon from '../CartIcon/CartIcon';
import CartDropdown from '../CartDropdown/CartDropdown';

const navbar = ({ match, currentUser, hidden }) => (
	<nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top ">
		<div className="container">
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon" />
			</button>

			<Link to="/" className="navbar-brand mx-auto">
				<img src={Logo} width="100" height="30" alt="" />
			</Link>

			<div className="navbar-item text-dark d-block d-md-none d-lg-none">
				<CartIcon />

				{!hidden && <CartDropdown />}
			</div>

			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
					<li className={`nav-item ${match.path === '/jiu-jitsu' ? 'active' : ''}`}>
						<Link to="/jiu-jitsu" className="nav-link">
							Jiu Jitsu
						</Link>
					</li>
					<li className={`nav-item ${match.path === '/apparel' ? 'active' : ''}`}>
						<Link to="/apparel" className="nav-link">
							Apparel
						</Link>
					</li>
					<li className={`nav-item ${match.path === '/boxing' ? 'active' : ''}`}>
						<Link to="/boxing" className="nav-link">
							Boxing
						</Link>
					</li>
				</ul>
				<ul className="navbar-nav ml-auto">
					<li className={`nav-item ${match.path === '/shop' ? 'active' : ''}`}>
						<Link to="/shop" className="nav-link">
							Shop
						</Link>
					</li>

					<li className={`nav-item dropdown  ${match.path === '/account' ? 'active' : ''}`}>
						{!currentUser ? (
							<Link to="/account" className="nav-link">
								Account
							</Link>
						) : (
							<div>
								<Link
									to=""
									className="nav-link dropdown-toggle m-2 p-0"
									id="navbarDropdown"
									role="button"
									data-toggle="dropdown"
									aria-haspopup="true"
									aria-expanded="false"
								>
									<i className="fas fa-user-circle fa-1x" />
								</Link>

								<div className="dropdown-menu" aria-labelledby="navbarDropdown">
									<a className="dropdown-item" href="#">
										Profile
									</a>
									<a className="dropdown-item" href="#">
										Purchase history
									</a>
									<div className="dropdown-divider" />
									<a className="dropdown-item" href="" onClick={() => auth.signOut()}>
										Sign out
									</a>
								</div>
							</div>
						)}
					</li>
					<li className="nav-item dropdown d-none d-md-block d-lg-block">
						<div style={{ cursor: 'pointer' }} className="nav-link">
							<CartIcon />
						</div>
						{!hidden && <CartDropdown />}
					</li>
				</ul>
			</div>
		</div>
	</nav>
);

const mapStateToProps = (state) =>
	createStructuredSelector({
		currentUser: selectCurrentUser,
		hidden: selectCartHidden
	});

export default connect(mapStateToProps)(navbar);
