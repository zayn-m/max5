import React from 'react';
import { getProducts } from '../../firebase/firebaseUtils';

import Fade from 'react-reveal/Fade';
import CircleElement from '../../components/CircleElement/CircleElement';
import BoxElement from '../../components/BoxElement/BoxElement';
import Spinner from '../../components/Spinner/Spinner';
import NoDataImg from '../../assets/images/error/no-data.png';

class Shop extends React.Component {
	constructor(props) {
		super(props);

		this._isMounted = false;
	}

	state = {
		loading: true,
		products: null
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
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

	fetchData = async () => {
		let data;
		if (this.props.match.params.category) {
			data = await getProducts(this.props.match.params.category);
		} else {
			data = await getProducts('boxing');
		}

		this._isMounted && this.setState({ loading: false, products: data });
	};

	render() {
		let content = null;

		if (this.state.products) {
			content = this.state.products.items.map((item, i) => {
				if (i % 2) {
					return (
						<Fade right key={item.id}>
							<div className="row" style={{ overflow: 'hidden' }}>
								<div className="col-12 p-0 no-gutters ml-auto h-100">
									<BoxElement item={item} />
								</div>
							</div>
						</Fade>
					);
				} else {
					return (
						<Fade left key={item.id}>
							<div className="row">
								<div className="col-12 p-0 no-gutters mr-auto h-100">
									<CircleElement item={item} />
								</div>
							</div>
						</Fade>
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
			<div className="container-fluid no-gutters">
				<h1 className="text-center m-5 display-4 text-primary text-uppercase font-italic font-weight-bold">
					{this.state.products && this.state.products.title}
				</h1>

				{this.state.loading ? (
					<div className="row">
						<Spinner width="100px" height="100px" />
					</div>
				) : (
					content
				)}
			</div>
		);
	}
}

export default Shop;
