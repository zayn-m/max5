import firebase from 'firebase';
import 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import slugify from 'react-slugify';

const config = {
	apiKey: 'AIzaSyCy3hO_tmquDO0xpDsoejm39bCZNZE1FS0',
	authDomain: 'max5-9bbec.firebaseapp.com',
	databaseURL: 'https://max5-9bbec.firebaseio.com',
	projectId: 'max5-9bbec',
	storageBucket: 'max5-9bbec.appspot.com',
	messagingSenderId: '635998881749',
	appId: '1:635998881749:web:ae602bd599dc3728'
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

// Function for generating random order numbers
function orderNumber() {
	let now = Date.now().toString(); // '1492341545873'
	// pad with extra random digit
	now += now + Math.floor(Math.random() * 10);
	// format
	return [ now.slice(2, 6), now.slice(10, 14) ].join('');
}

export const createUserProfileDocument = async (userAuth, additionalData) => {
	if (!userAuth) return;

	const userRef = firestore.doc(`users/${userAuth.uid}`);
	const snapshot = await userRef.get();

	if (!snapshot.exists) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await userRef.set({
				displayName,
				email,
				createdAt,
				...additionalData
			});
		} catch (e) {
			console.log('Error creating user', e.message);
		}
	}
	return userRef;
};

export const createUserCart = async (userAuth, cartItems) => {
	if (!userAuth) return;

	const cartRef = firestore.doc(`carts/${userAuth.id}`);
	const snapshot = await cartRef.get();

	if (!snapshot.exists) {
		try {
			await cartRef.set({
				cartItems
			});
		} catch (e) {
			console.log('Error when setting cart', e.message);
		}
	} else {
		try {
			await cartRef.update({
				cartItems
			});
		} catch (e) {
			console.log(e.message);
		}
	}
};

export const createOrder = async (userAuth, order, items) => {
	if (!userAuth) return { error: 'Unexpected error occurred' };

	try {
		const timestamp = new Date();
		firestore
			.collection('orders')
			.add({
				orderNo: orderNumber(),
				createdAt: timestamp,
				customer: userAuth,
				orderInfo: order,
				items: items
			})
			.then(() => {
				// Calculating total amount
				let totalPrice = 0;
				items.forEach((i) => {
					totalPrice = i.price * i.quantity + totalPrice;
				});

				firestore.collection('sales').add({
					createdAt: timestamp.toJSON().slice(0, 10).replace(/-/g, '-'),
					amount: totalPrice
				});
			});
	} catch (e) {
		console.log('Error when placing order.', e.message);
	}
};

export const addCategory = (category, subCategory) => {
	if (category) {
		try {
			const productRef = firestore.collection('products').doc(slugify(category));
			productRef.get().then((doc) => {
				if (!doc.exists) {
					productRef.set({
						title: category,
						subTitles: subCategory ? [ subCategory.toLowerCase() ] : [],
						items: []
					});
				} else {
					productRef.update({
						subTitles: [ ...doc.data().subTitles, subCategory ]
					});
				}
			});
		} catch (e) {
			console.log('Error when adding category', e.message);
		}
	}
};

export const addNewProd = async (collectionKey, subTitle, objectsToAdd) => {
	let items = [];
	const itemRef = firestore.collection('products').doc(slugify(collectionKey));
	itemRef.get().then((doc) => {
		if (doc.exists) {
			const d = doc.data();
			items = d.items;
			itemRef.update({ items: [ ...items, objectsToAdd ] });
		} else {
			itemRef.set({
				title: collectionKey,
				routeName: slugify(collectionKey),
				subTitles: [ ...doc.data().subTitles, subTitle ],
				items: [ objectsToAdd ]
			});
		}
	});
};

export const getProducts = async (title, subTitle, startAt, itemsPerPage) => {
	const productRef = firestore.collection('products').doc(slugify(title));
	const snapshot = await productRef.get();

	// Check if sub category exists
	if (subTitle) {
		if (snapshot.exists) {
			let data = [];

			const totalItemsCount = snapshot.data().items.filter((i) => i.routeName === slugify(subTitle)).length;
			for (let i = startAt; i < itemsPerPage + startAt; i++) {
				if (!snapshot.data().items[i]) {
					break;
				} else {
					if (snapshot.data().items[i].routeName === slugify(subTitle)) {
						data.push(snapshot.data().items[i]);
					}
				}
			}
			let finalData;

			if (data.length) {
				finalData = {
					title: snapshot.data().title,
					routeName: snapshot.data().routeName,
					items: [ ...data ],
					totalItemsCount
				};
			} else {
				finalData = null;
			}

			return finalData;
		}
	}
	if (snapshot.exists) {
		let data = [];
		const totalItemsCount = snapshot.data().items.length;

		for (let i = startAt; i < itemsPerPage + startAt; i++) {
			if (!snapshot.data().items[i]) {
				break;
			} else {
				data.push(snapshot.data().items[i]);
			}
		}
		let finalData;

		if (data.length) {
			finalData = {
				title: snapshot.data().title,
				routeName: snapshot.data().routeName,
				items: [ ...data ],
				totalItemsCount
			};
		} else {
			finalData = null;
		}

		return finalData;
	}
};

export const getAdminProducts = async () => {
	const items = [];
	await firestore.collection('products').get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			doc.data().items.forEach((i) => {
				items.push(i);
			});
		});

		return items;
	});
};

export const getProductByCategory = async (category, productId) => {
	const productRef = firestore.collection('products').doc(category);
	const snapshot = await productRef.get();

	if (snapshot.exists) {
		const p = snapshot.data().items.filter((p) => +p.id === +productId);

		if (p) {
			return { category: category, ...p[0] };
		}
	}
};

export const getRecommendations = async () => {
	const snapshot = await firestore.collection('products').get();
	const categories = snapshot.docs.map((doc) => doc.id);

	const randomElement = Math.floor(Math.random() * categories.length);

	return getProducts(categories[randomElement], null, 0, 8);
};

export const getUserOrders = async (userAuth) => {
	if (!userAuth) return { error: 'Not authorized' };

	const snapshot = await firestore.collection('orders').orderBy('createdAt', 'desc').get();
	const orders = [];
	// Get orders based on user id
	snapshot.docs.filter((doc) => doc.data().customer.id === userAuth.id).forEach((d) => {
		const data = d.data();
		let totalPrice = 0;
		let purchasedItemsCount = 0;
		data.items.forEach((i) => {
			totalPrice = i.price * i.quantity + totalPrice;
			purchasedItemsCount += i.quantity;
		});
		const order = {
			orderId: d.id,
			items: data.items,
			type: data.orderInfo.type,
			address: `${data.orderInfo.card.address_line1} ${data.orderInfo.card.address_city} ${data.orderInfo.card
				.address_country}`,
			paymentType: `${data.orderInfo.card.brand} ****${data.orderInfo.card.last4}`,
			created: data.orderInfo.created,
			totalPrice,
			purchasedItemsCount
		};
		orders.push(order);
	});

	if (orders) {
		return orders;
	}
};

export const getDashboardData = async () => {
	const usersSnapshot = await firestore.collection('users').get();
	const salesSnapshot = await firestore.collection('sales').get();

	let totalRevenue = 0;
	let totalOrders;
	let subscribers;

	subscribers = usersSnapshot.docs.length;
	totalOrders = salesSnapshot.docs.length;
	salesSnapshot.docs.forEach((doc) => {
		totalRevenue += doc.data().amount;
	});
	return { totalRevenue, totalOrders, subscribers };
};

export const getChartData = async () => {
	const start = '2019-01-01';
	const end = '2019-12-31';
	const snapshot = await firestore
		.collection('sales')
		.where('createdAt', '>', start)
		.where('createdAt', '<', end)
		.get();

	const dataset = {
		'01': 0,
		'02': 0,
		'03': 0,
		'04': 0,
		'05': 0,
		'06': 0,
		'07': 0,
		'08': 0,
		'09': 0,
		'10': 0,
		'11': 0,
		'12': 0
	};
	const months = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ];
	const chartDataset = [];
	snapshot.docs.forEach((doc) => {
		let date = doc.data().createdAt;
		for (let month of months) {
			if (month === date.slice(5, 7)) {
				dataset[month] += 1;
			}
		}
	});

	// Setting dataset for charts
	for (var o in dataset) {
		chartDataset.push(dataset[o]);
	}
	return dataset;
};

export const updateProductDoc = async (title, itemToUpdate) => {
	const productRef = firestore.collection('products').doc(slugify(title));
	const snapshot = await productRef.get();

	if (snapshot.exists) {
		const items = snapshot.data().items;

		for (let i = 0; i < items.length; i++) {
			if (items[i].id == itemToUpdate.id) {
				items[i] = itemToUpdate;
			}
		}

		productRef.update({
			items: items
		});
	}
};

export const removeProductItem = async (title, itemToDelete) => {
	const productRef = firestore.collection('products').doc(slugify(title));
	const snapshot = await productRef.get();

	if (snapshot.exists) {
		const items = snapshot.data().items;

		for (let i = 0; i < items.length; i++) {
			if (items[i].id == itemToDelete.id) {
				items.splice(i, 1);
			}
		}

		productRef.update({
			items: items
		});
	}
};

export const convertCollections = (collections) => {
	const transformedCollection = collections.docs.map((doc) => {
		const { title, items, subTitle } = doc.data();
		return {
			title,
			subTitle,
			items
		};
	});
	return transformedCollection.reduce((accumulator, collection) => {
		accumulator[collection.title.toLowerCase()] = collection;
		return accumulator;
	}, {});
};

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
