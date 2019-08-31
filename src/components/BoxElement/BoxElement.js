import React from 'react';

import ProductSummary from '../ProductSummary/ProductSummary';

import './BoxElement.css';

const boxElement = (props) => {
	return (
		<ProductSummary item={props.item}>
			<div id="box-wrapper" className="border ml-auto">
				<img src={props.item.imageUrl} className="img-fluid" alt={props.item.name} />
			</div>
		</ProductSummary>
	);
};

export default boxElement;
