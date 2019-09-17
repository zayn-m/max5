import React from 'react';
import { connect } from 'react-redux';
import { firestore, storage, addCategory, addNewProd, updateProductDoc } from '../../firebase/firebaseUtils';
import { addVariations } from '../../store/actions/addProduct';

import PlaceholderImg from '../../assets/images/placeholder.png';
import slugify from 'react-slugify';
import ImageUploader from 'react-images-upload';
import ImagesUpload from '../../components/ImagesUpload/ImagesUpload';
import { ToastContainer, toast } from 'react-toastify';

import Alert from '../../components/Alert/Alert';
import Variations from '../../components/Variations/Variations';

const uuidv1 = require('uuid/v1');

class AddProduct extends React.Component {
	state = {
		loading: false,
		error: '',
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
			const { name, description, price, title, variations, category } = this.props.location.state;
			this.handleSelectCat(null, title);
			this.setState({
				title: name,
				description,
				price,
				variations,
				editCategory: title,
				selectedCat: title,
				selectedSubCat: category
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

	handleSelectCat = (e, title) => {
		let value;
		if (e) {
			value = e.target.value;
			this.setState({ selectedCat: e.target.value });
		}

		// Fetch sub categories based on selected category option
		const collectionRef = firestore.collection('products');
		this.unsubscribeSubCat = collectionRef.doc(slugify(value ? value : title)).onSnapshot(async (s) => {
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

	imageDimensions = (file) =>
		new Promise((resolve, reject) => {
			try {
				const img = new Image();
				img.onload = () => {
					const { naturalWidth: width, naturalHeight: height } = file;
					console.log(width);
					resolve({ width, height });
				};
				img.onerror = () => {
					reject('There was some problem during the image loading');
				};
				img.src = URL.createObjectURL(file);
			} catch (error) {
				reject(error);
			}
		});

	getInfo = async (file) => {
		await this.imageDimensions(file)
			.then((result) => {
				console.info(result);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	onDrop = async (picture) => {
		// const { variations } = this.state;
		// if (variations.length === 3) {
		// 	alert('Maximum 3 variations are allowed');
		// 	return;
		// }
		this.setState({
			variations: picture
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
		const { image, selectedCat, selectedSubCat, variations } = this.state;

		// // Validating form
		// if (image !== '' && !this.validateForm()) {
		// 	this.setState({ error: 'Please fill in all the fields!' });
		// 	return;
		// }

		this.setState({ loading: true });

		const variationsImages = [];

		if (image === '') {
			const selectedEditItem = this.props.location.state;
			const updateVariations = [];
			// Uploading variations for selected product
			this.props.variations.forEach((v) => {
				if (typeof v === 'object') {
					// Push to array if image is selected
					const path = uuidv1();
					storage.ref(`images/${path}/${v.name}`).put(v).on(
						'state_changed',
						() => {},
						(err) => {
							console.log(err);
						},
						() => {
							storage.ref(`images/${path}`).child(v.name).getDownloadURL().then((url) => {
								updateVariations.push(url);

								if (this.props.variations.length === updateVariations.length) {
									const item = {
										id: selectedEditItem.id,
										category: selectedSubCat,
										routeName: slugify(selectedSubCat),
										imageUrl: selectedEditItem.imageUrl,
										name: this.state.title,
										description: this.state.description,
										price: this.state.price,
										variations: updateVariations
									};
									updateProductDoc(selectedCat, item)
										.then(() => {})
										.catch((err) => this.setState({ error: err, loading: false }));
								}
							});
						}
					);
				} else {
					// Push to array if image is already uploaded
					updateVariations.push(v);
				}

				if (this.props.variations.length === updateVariations.length) {
					const item = {
						id: selectedEditItem.id,
						category: selectedSubCat,
						routeName: slugify(selectedSubCat),
						imageUrl: selectedEditItem.imageUrl,
						name: this.state.title,
						description: this.state.description,
						price: this.state.price,
						variations: updateVariations
					};
					updateProductDoc(selectedCat, item)
						.then(() => {
							toast('Updated successfuly');
							this.setState({ loading: false, error: '' });
						})
						.catch((err) => this.setState({ error: err, loading: false }));
				}
			});
		} else {
			const path = uuidv1();
			const uploadtask = storage.ref(`images/${path}/${image.name}`).put(image);
			uploadtask.on(
				'state_changed',
				(snapshot) => {
					// Progress function
					// const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
				},
				(err) => {
					console.log(err);
				},
				() => {
					storage.ref(`images/${path}`).child(image.name).getDownloadURL().then((url) => {
						// Uploading product @variations images
						const imageUrl = url;
						if (this.props.variations) {
							this.props.variations.forEach((variation) => {
								const path = uuidv1();
								storage.ref(`images/${path}/${variation.name}`).put(variation).on(
									'state_changed',
									(snapshot) => {
										// const progress = Math.round(
										// 	snapshot.bytesTransferred / snapshot.totalBytes * 100
										// );
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

												if (this.props.variations.length === variationsImages.length) {
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

	removePicture = (p) => {
		this.setState({ variations: this.state.variations.filter((v) => v !== p) });
	};

	validateForm = () => {
		const { title, selectedCat, selectedSubCat, description, price, image } = this.state;

		if (title && selectedCat && selectedSubCat && description && price && image) {
			return true;
		}

		return false;
	};

	resetForm = () => {
		// Setting store @variations to default
		this.props.clearVariations([]);
		this.setState({
			loading: false,
			error: '',
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
		const { title, description, price, loading, editCategory, selectedCat, variations, error } = this.state;
		const selectedEditItem = this.props.location.state;

		return (
			<section>
				<ToastContainer autoClose={2000} hideProgressBar={true} style={{ fontWeight: 'bold', color: '#000' }} />
				<div className="row no-gutters">
					<div className="col-12 col-md-9">
						<h1 className="col-12 text-left m-3">
							{selectedEditItem ? ' Update Product ' : 'New Product'}{' '}
						</h1>

						<div className="row col-12">
							<div className="col-md-6">
								{error && <Alert msg={error} />}
								<input
									type="text"
									name="title"
									value={title}
									className="form-control bg-transparent border"
									placeholder="Title"
									onChange={this.handleInputChange}
								/>
								<select
									className={'form-control'}
									value={this.state.selectedCat}
									onChange={this.handleSelectCat}
								>
									{!selectedEditItem && <option value="Select Category">Select Category</option>}

									{this.state.categories.map((cat) => (
										<option key={cat.title} value={cat.title}>
											{cat.title}
										</option>
									))}
								</select>
								<select
									className="form-control"
									value={this.state.selectedSubCat}
									onChange={(e) => this.setState({ selectedSubCat: e.target.value })}
								>
									{!selectedEditItem && (
										<option value="Select Sub Category">Select Sub Category</option>
									)}
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
									style={{ width: '100%', height: '400px' }}
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
								{/* <div className="d-flex bd-highlight justify-content-center mt-3">
									{selectedEditItem &&
										this.state.variations.map((v) => (
											<div className="p-2 bd-highlight bg-light border m-2" key={v}>
												<img style={{ height: 80, width: 80 }} src={v} alt={v.name} />{' '}
												<div className="overlay">
													<i
														className="fas fa-times-circle"
														style={{ cursor: 'pointer' }}
														title="Remove Picture"
														onClick={() => this.removePicture(v)}
													/>
												</div>
											</div>
										))}
								</div> */}

								<ImagesUpload images={selectedEditItem && selectedEditItem.variations} />
								{/* <ImageUploader
										withPreview={true}
										withIcon={true}
										buttonText="Choose variations"
										label="Max file size: 2mb, accepted: png"
										imgExtension={[ '.png' ]}
										maxFileSize={2000000}
										singleImage={true}
										onChange={this.onDrop}
									/> */}

								<button
									className="btn btn-danger float-right mt-3 mb-2"
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

const mapStateToProps = (state) => ({
	variations: state.addProductReducer.variations
});

const mapDispatchToProps = (dispatch) => ({
	clearVariations: (variations) => dispatch(addVariations(variations))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
