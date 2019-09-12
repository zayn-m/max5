import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { firestore, getProducts, removeProductItem } from '../../firebase/firebaseUtils';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Sidebar from './Sidebar';
import Header from './Header';

import AddProduct from './AddProduct';
import Products from './Products';
import Orders from './Orders';

class Admin extends React.Component {
	state = {
		categories: [],
		products: [],
		orders: [],
		selectedCat: 'apparel'
	};

	unsubscribe = null;
	unsubscribeSubCat = null;
	unsubscribeOrders = null;

	componentDidMount() {
		this.getCategoryCollections();
		this.getAdminProducts();
		this.getAdminOrders();
	}

	getCategoryCollections = () => {
		const collectionRef = firestore.collection('products');
		this.unsubscribe = collectionRef.onSnapshot(async (s) => {
			const categoryCollections = [];
			s.docs.map((d) => categoryCollections.push(d.data()));
			this.setState({ categories: categoryCollections });
		});
	};

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

	getAdminOrders = () => {
		const collectionRef = firestore.collection('orders');
		this.unsubscribeOrders = collectionRef.orderBy('createdAt', 'desc').onSnapshot(async (s) => {
			// Get orders based on creation date
			const ordersCollectons = [];
			s.docs.map((d) => {
				const data = d.data();
				let totalPrice = 0;
				let purchasedItemsCount = 0;
				data.items.forEach((i) => {
					totalPrice = i.price * i.quantity;
					purchasedItemsCount += i.quantity;
				});
				const order = {
					orderId: d.id,
					items: data.items,
					type: data.orderInfo.type,
					address: `${data.orderInfo.card.address_line1} ${data.orderInfo.card.address_city} ${data.orderInfo
						.card.address_country}`,
					paymentType: `${data.orderInfo.card.brand} ****${data.orderInfo.card.last4}`,
					created: data.orderInfo.created,
					totalPrice,
					purchasedItemsCount
				};
				ordersCollectons.push(order);
			});
			this.setState({ orders: ordersCollectons });
		});
	};

	componentWillUnmount() {
		this.unsubscribe = null;
		this.unsubscribeSubCat = null;
		this.unsubscribeOrders = null;
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
		const { products, categories, selectedCat, orders } = this.state;

		return (
			<div className="container-fluid p-0">
				<div className="row no-gutters">
					<div className="col-12 " />
					<div className="col-md-2">
						<div className="row">
							<Sidebar />
						</div>
					</div>
					<div className="col-12 col-md-10">
						<Header />
						<Switch>
							{/* <Route path="/admin/dashboard" component={Dashboard} /> */}
							<Route path="/admin/dashboard/orders" render={() => <Orders orders={orders} />} />
							<Route path="/admin/dashboard/add-product" component={AddProduct} />
							<Route path="/admin/dashboard/edit-product" component={AddProduct} />
							<Route
								path="/admin/dashboard/products"
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
						</Switch>
					</div>
					<div className="col-md-1" />
				</div>
			</div>
		);
	}
}

export default Admin;
