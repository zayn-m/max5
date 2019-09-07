import React from 'react';
import { Link } from 'react-router-dom';

const products = ({ categories, selectedCat, products, handleChange, removeItem }) => {
	return (
		<div className="container-fluid row">
			<div className="col-12 m-2">
				<h1 className="text-left">
					Products{' '}
					<select className="col-6 col-md-3 ml-auto form-control" onChange={handleChange}>
						{categories.map((cat) => (
							<option key={cat.title} value={cat.title}>
								{cat.title}
							</option>
						))}
					</select>
				</h1>

				<div className="admin-products-container">
					<div className="admin-products-container__item">
						<ul className="list-group list-group-flush">
							<li className="list-group-item  bg-light">
								<ul className="list-group list-group-horizontal">
									<li className="list-group-item border-0 bg-light col-2">Name</li>
									<li className="list-group-item border-0 bg-light col-3">Description</li>
									<li className="list-group-item border-0 bg-light col-2">Price</li>
									<li className="list-group-item border-0 bg-light col-2">Category</li>
									<li className="list-group-item border-0 bg-light col-2">Actions</li>
								</ul>
							</li>
							{products &&
								products.map((p, i) => (
									<li className="list-group-item" key={p.id}>
										<ul className="list-group list-group-horizontal">
											<li className="list-group-item border-0 col-2">{p.name}</li>
											<li className="list-group-item border-0 col-3">
												{p.description.substring(0, 100)}...
											</li>
											<li className="list-group-item border-0 col-2">
												<strong>${p.price}</strong>
											</li>
											<li className="list-group-item border-0 col-2">{p.category}</li>
											<li className="list-group-item border-0 col-2">
												<Link
													to={{
														pathname: '/admin/edit-product',
														state: { edit: true, title: selectedCat, ...p }
													}}
												>
													<i className="fas fa-edit" />
												</Link>
												&nbsp;&nbsp;&nbsp;
												<i
													className="fas fa-trash"
													style={{ cursor: 'pointer' }}
													onClick={() => removeItem(selectedCat, p, i)}
												/>
											</li>
										</ul>
									</li>
								))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default products;
