import React from 'react';
import { firestore, storage, addCategory, addNewProd, updateProductDoc } from '../../firebase/firebaseUtils';

import PlaceholderImg from '../../assets/images/placeholder.png';
import slugify from 'react-slugify';
import Spinner from '../../components/Spinner/Spinner';
import ImageUploader from 'react-images-upload';

const uuidv1 = require('uuid/v1');

class AddProduct extends React.Component {
	state = {
		loading: false,
		categories: [],
		subCategories: [],
		variations: [],
		editCategory: '',
		category: '',
		subCategory: '',
		title: '',
		selectedCat: '',
		selectedSubCat: '',
		description: '',
		price: '',
		image: '',
		imageUrl: PlaceholderImg
	};

	unsubscribe = null;
	unsubscribeSubCat = null;

	componentDidMount() {
		if (this.props.location.state) {
			const { name, description, price, title } = this.props.location.state;
			this.setState({
				title: name,
				description,
				price,
				editCategory: title
			});
		}
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

	handleInputChange = (e) => {
		const { value, name } = e.target;
		this.setState({ [name]: value });
	};

	handleSelectCat = (e) => {
		const { value } = e.target;
		this.setState({ selectedCat: e.target.value });
		// Fetch sub categories based on selected category option
		const collectionRef = firestore.collection('products');
		this.unsubscribeSubCat = collectionRef.doc(slugify(value)).onSnapshot(async (s) => {
			this.setState({ subCategories: s.data().subTitles });
		});
	};

	onImageChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			this.setState({
				imageUrl: URL.createObjectURL(event.target.files[0]),
				image: event.target.files[0]
			});
		}
	};

	onDrop = (picture) => {
		this.setState({
			variations: this.state.variations.concat(picture)
		});
	};

	addNewCategory = (e) => {
		e.preventDefault();
		const { selectedCat, subCategory } = this.state;

		addCategory(selectedCat, subCategory);
		this.setState({ subCategory: '' });
	};

	addProduct = (e) => {
		e.preventDefault();
		const btnOp = e.target.value;
		// Validate form
		// if (!this.validateForm()) return;

		this.setState({ loading: true });

		const { image, selectedCat, selectedSubCat, variations } = this.state;
		const variationsImages = [];

		if (image === '') {
			const selectedEditItem = this.props.location.state;
			const item = {
				id: selectedEditItem.id,
				routeName: selectedEditItem.routeName,
				imageUrl: selectedEditItem.imageUrl,
				category: selectedEditItem.category,
				name: this.state.title,
				description: this.state.description,
				price: this.state.price
			};
			updateProductDoc(selectedCat, item).then(() => {
				this.resetForm();
			});
		} else {
			const path = uuidv1();
			const uploadtask = storage.ref(`images/${path}/${image.name}`).put(image);
			uploadtask.on(
				'state_changed',
				(snapshot) => {
					// Progress function
					const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
				},
				(err) => {
					console.log(err);
				},
				() => {
					storage.ref(`images/${path}`).child(image.name).getDownloadURL().then((url) => {
						// Uploading product @variations images
						const imageUrl = url;
						if (variations) {
							variations.forEach((variation) => {
								const path = uuidv1();
								storage.ref(`images/${path}/${variation.name}`).put(variation).on(
									'state_changed',
									(snapshot) => {
										const progress = Math.round(
											snapshot.bytesTransferred / snapshot.totalBytes * 100
										);
									},
									(err) => {
										console.log(err);
									},
									() => {
										storage
											.ref(`images/${path}`)
											.child(variation.name)
											.getDownloadURL()
											.then((url) => {
												variationsImages.push(url);

												if (variations.length === variationsImages.length) {
													const item = {
														id: Math.random(),
														routeName: selectedSubCat
															? slugify(selectedSubCat)
															: slugify(selectedCat),
														category: selectedSubCat ? selectedSubCat : selectedCat,
														name: this.state.title,
														description: this.state.description,
														price: this.state.price,
														imageUrl: imageUrl.toString(),
														variations: variationsImages
													};

													if (btnOp === 'Update') {
														updateProductDoc(selectedCat, item).then(() => {});
													} else {
														addNewProd(selectedCat, selectedSubCat, item).then(() => {
															this.resetForm();
														});
													}
												}
											});
									}
								);
							});
						}
					});
				}
			);
		}
	};

	validateForm = () => {
		const { title, selectedCat, selectedSubCat, description, price, image } = this.state;

		if (title && selectedCat && description && price && image) {
			return true;
		}

		return false;
	};

	resetForm = () => {
		this.setState({
			loading: false,
			categories: [],
			subCategories: [],
			variations: [],
			category: '',
			subCategory: '',
			title: '',
			selectedCat: '',
			selectedSubCat: '',
			description: '',
			price: 0,
			image: PlaceholderImg,
			imageUrl: PlaceholderImg
		});
	};

	render() {
		const { title, description, price, loading, editCategory, selectedCat } = this.state;
		const selectedEditItem = this.props.location.state;

		return (
			<section>
				<div className="row no-gutters">
					<div className="col-12 col-md-9">
						<h1 className="col-12 text-left m-3">
							{selectedEditItem ? ' Update Product ' : 'New Product'}{' '}
						</h1>

						<div className="row col-12">
							<div className="col-md-6">
								<input
									type="text"
									name="title"
									value={title}
									className="form-control bg-transparent border"
									placeholder="Title"
									onChange={this.handleInputChange}
								/>
								<select className={'form-control'} onChange={this.handleSelectCat}>
									<option>Select Category</option>
									{this.state.categories.map((cat) => (
										<option key={cat.title} value={cat.title}>
											{cat.title}
										</option>
									))}
								</select>
								<select
									className="form-control"
									onChange={(e) => this.setState({ selectedSubCat: e.target.value })}
								>
									<option>Select Sub Category</option>
									{this.state.subCategories.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>
								<textarea
									className="bg-transparent border"
									name="description"
									value={description}
									rows={8}
									placeholder="Description"
									onChange={this.handleInputChange}
								/>
								<input
									type="number"
									name="price"
									value={price}
									className="form-control bg-transparent border"
									placeholder="Price"
									step="0.01"
									min="0"
									onChange={this.handleInputChange}
								/>
							</div>
							<div className="col-md-6">
								<img
									style={{ width: '100%' }}
									src={selectedEditItem ? selectedEditItem.imageUrl : this.state.imageUrl}
									alt="upload"
								/>
								<div className="custom-file">
									<input
										type="file"
										className="custom-file-input"
										id="validatedCustomFile"
										required
										onChange={this.onImageChange}
									/>
									<label className="custom-file-label" htmlFor="validatedCustomFile">
										Choose image...
									</label>
								</div>
								<ImageUploader
									withPreview={true}
									withIcon={true}
									buttonText="Choose variations"
									label="Max file size: 2mb, accepted: png"
									onChange={this.onDrop}
									imgExtension={[ '.png' ]}
									maxFileSize={5242880}
								/>
								<button
									className="btn btn-danger float-right mt-5 mb-2"
									disabled={loading}
									onClick={this.addProduct}
									value={selectedEditItem ? 'Update' : 'Submit'}
								>
									{selectedEditItem ? 'Update' : 'Submit'}
								</button>
							</div>
						</div>
					</div>
					<div className="col-12 col-md-2 border-left mt-5 p-1">
						<form className="bg-transparent" onSubmit={this.addNewCategory}>
							<div className="form-group">
								<label htmlFor="exampleInputEmail1">Add New Category</label>
								<select className="form-control" onChange={this.handleSelectCat}>
									<option>Select Category</option>
									{this.state.categories.map((cat) => (
										<option key={cat.title} value={cat.title}>
											{cat.title}
										</option>
									))}
								</select>
								{/* <input
									type="text"
									value={this.state.category}
									className="form-control bg-transparent border"
									id="exampleInputEmail1"
									aria-describedby="emailHelp"
									placeholder="Category"
									required
									onChange={(e) => this.setState({ category: e.target.value })}
								/> */}
								<input
									type="text"
									value={this.state.subCategory}
									className="form-control bg-transparent border"
									id="exampleInputEmail1"
									aria-describedby="emailHelp"
									placeholder="Sub Category"
									onChange={(e) => this.setState({ subCategory: e.target.value })}
								/>
							</div>
							<button type="submit" className="btn btn-danger">
								Add
							</button>
						</form>
					</div>
				</div>
			</section>
		);
	}
}

export default AddProduct;
