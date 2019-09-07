import React from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import {
	firestore,
	storage,
	addCategory,
	addNewProd,
	getProducts,
	removeProductItem,
	getAdminProducts
} from '../../firebase/firebaseUtils';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Dashboard from './Dashboard';
import AddProduct from './AddProduct';
import Products from './Products';

class Admin extends React.Component {
	state = {
		categories: [],
		products: [],
		selectedCat: 'apparel'
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
		this.getAdminProducts();
	}

	getAdminProducts = async () => {
		const items = [];
		await firestore.collection('products').doc('apparel').get().then((doc) => {
			doc.data().items.forEach((i) => {
				items.push(i);
			});

			this.setState({ products: doc.data() });
		});
		// await firestore.collection('products').get().then((querySnapshot) => {
		// 	querySnapshot.forEach((doc) => {
		// 		doc.data().items.forEach((i) => {
		// 			items.push(i);
		// 		});
		// 	});

		// 	this.setState({ products: items });
		// });
	};

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
		confirmAlert({
			title: 'Delete Data',
			message: 'This will permanently delete this data.',
			buttons: [
				{
					label: 'Yes',
					onClick: () =>
						removeProductItem(doc, item).then(() => {
							this.state.products.items.splice(index, 1);
						})
				},
				{
					label: 'No'
				}
			]
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
										Manage
									</Link>
									<Link to="/admin/add-product" className="list-group-item list-group-item-action">
										Add Product
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
