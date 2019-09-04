import React from 'react';

import './ProductDetail.css';
import { getProductByCategory, getRecommendations } from '../../firebase/firebaseUtils';
import { connect } from 'react-redux';
import { addItem } from '../../store/actions/cart';
import { HOST_URL } from '../../settings';

import Card from '../../components/Card/Card';
import Skelton from '../../components/Skelton/Skelton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ProductDetail extends React.Component {
	state = {
		product: null,
		loaded: false,
		recommendations: [],
		qty: 0
	};

	componentDidMount() {
		const category = this.props.match.params.category;
		const id = this.props.match.params.productId;
		getProductByCategory(category, id).then((res) => this.setState({ product: res }));
		this.recommendations();
	}

	recommendations = async () => {
		await getRecommendations().then((res) => this.setState({ recommendations: res, loaded: true }));
	};

	selectItemHandler = (category, id) => {
		const url = `${HOST_URL}/shop/${category}/${id}`;
		window.open(url, '_blank');
	};

	addToCart = (prod, user, qty) => {
		this.props.addItem(prod, user, qty);
		toast('Added to Cart!');
	};

	render() {
		const { product, loaded, qty } = this.state;
		return (
			<div className="container">
				{!loaded ? (
					<Skelton />
				) : (
					<div>
						<ToastContainer
							autoClose={2000}
							hideProgressBar={true}
							style={{ fontWeight: 'bold', color: '#000' }}
						/>
						<section className="row border-bottom product-detail">
							<div className="col-md-6">
								<h1>{product.name}</h1>
								<p>{product.description}</p>
								<h2>
									<strong>${product.price}</strong>
								</h2>
								<br />
								<div className="d-flex flex-row">
									<button
										className="btn btn-light border"
										onClick={() => {
											if (qty > 0) return this.setState({ qty: qty - 1 });
										}}
									>
										-
									</button>
									<span className="p-2"> {qty > 0 ? qty : 0} </span>
									<button
										className="btn btn-light border"
										onClick={() => this.setState({ qty: qty + 1 })}
									>
										+
									</button>
								</div>
								<button
									className="btn btn-danger mt-3"
									disabled={qty > 0 ? false : true}
									onClick={() => this.addToCart(product, this.props.currentUser, qty)}
								>
									Add to Cart
								</button>
							</div>
							<div className="col-md-6">
								<img src={product.imageUrl} className="img-fluid" alt={product.name} />
							</div>
						</section>

						<section className=" mt-5 mb-5">
							<h4 className="mb-5">Recommendations for you</h4>
							<div className="row m-5">
								{this.state.recommendations.items.map((item) => (
									<Card
										key={item.id}
										item={item}
										clicked={() =>
											this.selectItemHandler(this.state.recommendations.title, item.id)}
									/>
								))}
							</div>
						</section>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	currentUser: state.userReducer.currentUser
});

const mapDispatchToProps = (dispatch) => ({
	addItem: (item, currentUser, qty) => dispatch(addItem(item, currentUser, qty))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
