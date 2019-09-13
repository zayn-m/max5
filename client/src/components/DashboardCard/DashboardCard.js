import React from 'react';

const dashboardCard = ({ title, data, children }) => (
	<div className="card m-3 col-md-3">
		<h5 className="card-header">
			{children} {title}
		</h5>
		<div className="card-body">
			<h5 className="card-title">{data}</h5>
		</div>
	</div>
);

export default dashboardCard;
