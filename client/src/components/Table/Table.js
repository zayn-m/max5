import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const data = [
	{
		name: 'Tanner Linsley',
		age: 26,
		friend: {
			name: 'Jason Maurer',
			age: 23
		}
	},
	{
		name: 'Tanner',
		age: 26,
		friend: {
			name: 'Jason Maurer',
			age: 23
		}
	}
];

const columns = [
	{
		Header: 'Name',
		accessor: 'name' // String-based value accessors!
	},
	{
		Header: 'Age',
		accessor: 'age',
		Cell: (props) => <span className="number">{props.value}</span> // Custom cell components!
	},
	{
		id: 'friendName', // Required because our accessor is not a string
		Header: 'Friend Name',
		accessor: (d) => d.friend.name // Custom value accessors!
	},
	{
		Header: (props) => <span>Friend Age</span>, // Custom header components!
		accessor: 'friend.age'
	}
];

const table = ({ data }) => (
	<table className="table table-striped">
		<thead>
			<tr>
				<th scope="col">Name</th>
				<th scope="col">Category</th>
				<th scope="col">Sub Category</th>
				<th scope="col">Description</th>
				<th scope="col">Price</th>
				<th scope="col">Actions</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Mark</td>
				<td>Otto</td>
				<td>@mdo</td>
				<td>Mark</td>
				<td>Otto</td>
				<td>@mdo</td>
			</tr>
			<tr>
				<td>Mark</td>
				<td>Otto</td>
				<td>@mdo</td>
				<td>Mark</td>
				<td>Otto</td>
				<td>@mdo</td>
			</tr>
		</tbody>
	</table>
);

export default table;
