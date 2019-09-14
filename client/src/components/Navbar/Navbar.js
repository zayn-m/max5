import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth, firestore } from '../../firebase/firebaseUtils';
import { createStructuredSelector } from 'reselect';
import { selectCartHidden } from '../../store/selectors/cart';
import { selectCurrentUser } from '../../store/selectors/user';

import Logo from '../Logo/Logo';
import CartIcon from '../CartIcon/CartIcon';
import CartDropdown from '../CartDropdown/CartDropdown';
import slugify from 'react-slugify';

class Navbar extends React.Component {
	state = {
		subCategories: [],
		hide: false
	};
	unsubscribeSubCat = null;

	handleSelectCat = (value) => {
		// Fetch sub categories based on selected category option
		const collectionRef = firestore.collection('products');
		this.unsubscribeSubCat = collectionRef.doc(slugify(value)).onSnapshot(async (s) => {
			this.setState({ subCategories: s.data().subTitles });
		});
	};

	componentWillUnmount() {
		this.unsubscribeSubCat = null;
	}

	collapse = () => {
		this.setState({ hide: false });
	};

	render() {
		const { match, currentUser, hidden } = this.props;
		const { hide } = this.state;
		return (
			<nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top ">
				<div className="container-fluid">
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon" onClick={() => this.setState({ hide: !hide })} />
					</button>
					<span onClick={this.collapse}>
						<Logo path="/" />{' '}
					</span>

					<div className="navbar-item text-dark d-block d-md-none d-lg-none ">
						<CartIcon />

						{!hidden && <CartDropdown />}
					</div>

					<div className={`collapse ${hide && 'show'}  navbar-collapse ml-md-5`} id="navbarSupportedContent">
						<ul className="navbar-nav mr-auto">
							<li
								className="nav-item dropdown"
								onMouseEnter={() => this.handleSelectCat('jiu jitsu')}
								onMouseLeave={() => this.setState({ subCategories: [] })}
							>
								<a
									className="nav-link dropdown-toggle"
									href=""
									id="navbarDropdownMenuLink"
									data-toggle="dropdown"
									aria-haspopup="true"
									aria-expanded="false"
								>
									Jiu Jitsu
								</a>
								<div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
									{this.state.subCategories.map((s) => (
										<Link
											to={`/jiu-jitsu/${slugify(s)}`}
											className="dropdown-item"
											key={s}
											onClick={this.collapse}
										>
											{s}
										</Link>
									))}
								</div>
							</li>
							<li
								className="nav-item dropdown"
								onMouseEnter={() => this.handleSelectCat('apparel')}
								onMouseLeave={() => this.setState({ subCategories: [] })}
							>
								<a
									className="nav-link dropdown-toggle"
									href=""
									id="navbarDropdownMenuLink"
									data-toggle="dropdown"
									aria-haspopup="true"
									aria-expanded="false"
								>
									Apparel
								</a>
								<div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
									{this.state.subCategories.map((s) => (
										<Link
											to={`/apparel/${slugify(s)}`}
											className="dropdown-item"
											key={s}
											onClick={this.collapse}
										>
											{s}
										</Link>
									))}
								</div>
							</li>

							<li className={`nav-item ${match.path === '/boxing' ? 'active' : ''}`}>
								<Link to="/boxing" className="nav-link" onClick={this.collapse}>
									Boxing
								</Link>
							</li>
						</ul>
						<ul className="navbar-nav ml-auto">
							{/* <li className={`nav-item ${match.path === '/contact-us' ? 'active' : ''}`}>
								<Link to="/contact-us" className="nav-link">
									Contact Us
								</Link>
							</li> */}

							<li className={`nav-item dropdown  ${match.path === '/account' ? 'active' : ''}`}>
								{!currentUser ? (
									<Link to="/account" className="nav-link" onClick={this.collapse}>
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
											{/* <a className="dropdown-item" href="#">
												Profile
											</a> */}
											<Link
												to="/user/purchase-history"
												className="dropdown-item"
												onClick={this.collapse}
											>
												Purchase history
											</Link>
											<div className="dropdown-divider" />
											<a className="dropdown-item" href="" onClick={() => auth.signOut()}>
												Sign out
											</a>
										</div>
									</div>
								)}
							</li>
							<li className="nav-item dropdown d-none d-md-block d-lg-block mr-5">
								<div className="nav-link">
									<CartIcon />
								</div>
								{!hidden && <CartDropdown />}
							</li>
						</ul>
					</div>
				</div>
			</nav>
		);
	}
}

const mapStateToProps = (state) =>
	createStructuredSelector({
		currentUser: selectCurrentUser,
		hidden: selectCartHidden
	});

export default connect(mapStateToProps)(Navbar);
