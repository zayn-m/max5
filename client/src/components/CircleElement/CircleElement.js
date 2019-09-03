import React from 'react';

import ProductSummary from '../ProductSummary/ProductSummary';

import './CircleElement.css';

const circleElement = (props) => (
	<ProductSummary item={props.item}>
		<div id="circle-wrapper" className="col-md-5">
			<img src={props.item.imageUrl} className="img-fluid" alt={props.item.name} />
		</div>
	</ProductSummary>
);

export default circleElement;
