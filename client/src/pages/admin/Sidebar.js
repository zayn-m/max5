import React from 'react';
import { Link } from 'react-router-dom';

const sidebar = () => (
	<div className="col-12">
		<table className="table table-light table-hover">
			<thead className="thead-light">
				<tr>
					<th scope="row">Dashboard</th>
				</tr>
			</thead>
		</table>
		<div className="list-group" id="list-tab" role="tablist">
			<Link to="/admin/dashboard/orders" className="list-group-item list-group-item-action">
				<i className="fas fa-tasks" /> Orders
			</Link>

			<Link to="/admin/dashboard/add-product" className="list-group-item list-group-item-action">
				<i className="fas fa-plus-circle" /> Add Product
			</Link>
			<Link to="/admin/dashboard/products" className="list-group-item list-group-item-action">
				<i className="fas fa-list" /> Products
			</Link>
		</div>
	</div>
);

export default sidebar;
