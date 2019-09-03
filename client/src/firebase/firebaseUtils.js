import firebase from 'firebase';
import 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

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

export const getProducts = async (title, startAt, itemsPerPage) => {
	const productRef = firestore.collection('products').doc(title);

	const snapshot = await productRef.get();
	if (snapshot.exists) {
		let data = [];
		for (let i = startAt; i < itemsPerPage + startAt; i++) {
			if (!snapshot.data().items[i]) {
				break;
			} else {
				data.push(snapshot.data().items[i]);
			}
		}
		let finalData;

		if (data.length) {
			finalData = { title: snapshot.data().title, items: [ ...data ] };
		} else {
			finalData = null;
		}

		return finalData;
	}
};

export const getProductByCategory = async (category, productId) => {
	const productRef = firestore.collection('products').doc(category);
	const snapshot = await productRef.get();

	if (snapshot.exists) {
		const p = snapshot.data().items.filter((p) => p.id === productId);
		if (p) {
			return { category: category, ...p[0] };
		}
	}
};

export const getRecommendations = async () => {
	const snapshot = await firestore.collection('products').get();
	const categories = snapshot.docs.map((doc) => doc.id);
	const randomElement = Math.floor(Math.random() * categories.length);
	return getProducts(categories[randomElement], 0, 8);
};

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
