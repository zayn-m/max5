import React from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import {
	firestore,
	storage,
	addCategory,
	addNewProd,
	getProducts,
	removeProductItem
} from '../../firebase/firebaseUtils';
import Dashboard from './Dashboard';
import AddProduct from './AddProduct';
import Products from './Products';

class Admin extends React.Component {
	state = {
		categories: [],
		products: [],
		selectedCat: ''
	};

	unsubscribe = null;
	unsubscribeSubCat = null;

	componentDidMount() {
		const collectionRef = firestore.collection('products');
		this.unsubscribe = collectionRef.onSnapshot(async (s) => {
			const categoryCollections = [];
			s.docs.map((d) => categoryCollections.push(d.data()));
			this.setState({ categories: categoryCollections });
		});
	}

	componentWillUnmount() {
		this.unsubscribe = null;
		this.unsubscribeSubCat = null;
	}

	handleSelectCat = (e) => {
		const { value } = e.target;
		this.setState({ selectedCat: value });
		this.fetchProducts(value);
	};

	fetchProducts = async (value) => {
		const data = await getProducts(value, null, 0, 10);

		this.setState({ products: data, totalItemsCount: data ? data.totalItemsCount : 0 });
	};

	removeItem = async (doc, item, index) => {
		removeProductItem(doc, item).then(() => {
			this.state.products.items.splice(index, 1);
		});
	};

	render() {
		const { products, categories, selectedCat } = this.state;
		return (
			<div className="container-fluid border p-0">
				<div className="row no-gutters">
					<div className="col-12 " />
					<div className="col-md-2">
						<div className="row">
							<div className="col-12">
								<table className="table table-light table-hover">
									<thead className="thead-light">
										<tr>
											<th scope="row">Dashboard</th>
										</tr>
									</thead>
								</table>
								<div className="list-group" id="list-tab" role="tablist">
									<Link to="/admin/products" className="list-group-item list-group-item-action">
										Products
									</Link>
									<Link to="/admin/add-product" className="list-group-item list-group-item-action">
										Manage
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div className="col-12 col-md-10">
						<Switch>
							<Route path="/admin/dashboard" component={Dashboard} />
							<Route path="/admin/add-product" component={AddProduct} />
							<Route path="/admin/edit-product" component={AddProduct} />
							<Route
								path="/admin/products"
								render={() => (
									<Products
										categories={categories}
										selectedCat={selectedCat}
										products={products.items}
										handleChange={this.handleSelectCat}
										removeItem={this.removeItem}
									/>
								)}
							/>
							<Redirect to="/admin" />
						</Switch>
					</div>
					<div className="col-md-1" />
				</div>
			</div>
		);
	}
}

export default Admin;
