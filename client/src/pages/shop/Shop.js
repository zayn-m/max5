import React from 'react';
import { getProducts } from '../../firebase/firebaseUtils';

import './Shop.css';

import Fade from 'react-reveal/Fade';
import Pagination from 'react-js-pagination';

import Spinner from '../../components/Spinner/Spinner';

import NoDataImg from '../../assets/images/error/no-data.png';

class Shop extends React.Component {
	constructor(props) {
		super(props);

		this._isMounted = false;
	}

	state = {
		loading: true,
		products: null,
		currentPage: 1,
		itemsPerPage: 8,
		totalItemCount: 20,
		activePage: 1
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		// For pagination
		const isDifferentPage = this.state.currentPage !== prevState.currentPage;
		if (isDifferentPage) this._isMounted && this.fetchData();

		// Checking if url params are different
		if (prevProps.match.params.category !== this.props.match.params.category) {
			this._isMounted && this.fetchData();
		}
	}
	componentDidMount() {
		this._isMounted = true;
		this._isMounted && this.fetchData();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handlePageChange = (pageNumber) => {
		this.setState({ currentPage: pageNumber });
	};

	fetchData = async () => {
		let data;
		const { currentPage, itemsPerPage } = this.state;
		const startAt = currentPage * itemsPerPage - itemsPerPage;

		if (this.props.match.params.category) {
			data = await getProducts(this.props.match.params.category, startAt, itemsPerPage);
		} else {
			data = await getProducts('boxing', startAt, itemsPerPage);
		}

		this._isMounted && this.setState({ loading: false, products: data });
	};

	selectProductHandler = (product, category) => {
		this.props.history.push({
			pathname: `/shop/${category}/${product.id}`
		});
	};

	render() {
		let content = null;

		if (this.state.products) {
			content = this.state.products.items.map((item, i) => {
				if (i % 2) {
					return (
						<div className="box-container" key={item.id}>
							<Fade right>
								<div className="row">
									<div
										className="col-12 col-md-7 mr-auto "
										style={{ zIndex: '10' }}
										onClick={() => this.selectProductHandler(item, this.state.products.title)}
									>
										<h1 className="text-left product-title">{item.name}</h1>
										<p>{item.description.substring(0, 200)}...</p>
										<h4>
											<strong>${item.price}</strong>
										</h4>
									</div>
									<div className="col-12 col-md-5">
										<div
											id="box-wrapper"
											onClick={() => this.selectProductHandler(item, this.state.products.title)}
										>
											<img
												src={item.imageUrl}
												style={{
													cursor: 'pointer',
													width: '100%',
													height: '100%'
												}}
												alt={item.name}
											/>
										</div>
									</div>
								</div>
							</Fade>
						</div>
					);
				} else {
					return (
						<div className="circle-container" key={item.id}>
							<Fade left>
								<div className="row ">
									<div className="col-12 col-md-7">
										<div
											id="circle-wrapper"
											onClick={() => this.selectProductHandler(item, this.state.products.title)}
										>
											<img
												src={item.imageUrl}
												style={{ cursor: 'pointer', width: '100%', height: '100%' }}
												alt={item.name}
											/>
										</div>
									</div>
									<div
										className="col-12 col-md-5 "
										onClick={() => this.selectProductHandler(item, this.state.products.title)}
									>
										<h1 className="text-left product-title">{item.name}</h1>
										<p>{item.description.substring(0, 200)}...</p>
										<h4>
											<strong>${item.price}</strong>
										</h4>
									</div>
								</div>
							</Fade>
						</div>
					);
				}
			});
		} else {
			content = (
				<div className="container row mx-auto">
					<div className="col-md-8 mx-auto ">
						<img src={NoDataImg} className="img-fluid " alt="No data" />
					</div>
				</div>
			);
		}

		return (
			<div className="container-fluid  p-0 no-gutters">
				<h1 className="text-center m-1 display-4 text-primary text-uppercase font-italic font-weight-bold">
					{this.state.products && this.state.products.title}
				</h1>

				{this.state.loading ? (
					<div className="row">
						<Spinner width="100px" height="100px" />
					</div>
				) : (
					<div className="items-container container-fluid mb-5">{content}</div>
				)}

				<Pagination
					innerClass="pagination justify-content-center"
					itemClass="page-item"
					linkClass="page-link"
					activePage={this.state.currentPage}
					itemsCountPerPage={10}
					totalItemsCount={450}
					pageRangeDisplayed={5}
					onChange={this.handlePageChange}
				/>
			</div>
		);
	}
}

export default Shop;
