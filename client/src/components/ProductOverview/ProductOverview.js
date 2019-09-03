import React from 'react';

import './ProductOverview.css';

const productOverview = (props) => {
	return (
		<div className=" mb-5">
			<div
				className={`col-md-5 ${props.shape === 'box-wrapper' ? 'mr-auto' : 'ml-auto'} `}
				style={{ marginTop: '10rem', zIndex: '10' }}
			>
				<h2 className="product-title" onClick={() => props.clicked(props.item)}>
					{props.item.name}
				</h2>
				<p>{props.item.description}</p>
				<h4>${props.item.price}</h4>
			</div>
			<div id={props.shape} className={`${props.shape === 'box-wrapper' ? 'ml-auto' : 'mr-auto'}`}>
				<img
					src={props.item.imageUrl}
					style={{ cursor: 'pointer', width: '100%', height: '100%' }}
					alt={props.item.name}
					onClick={() => props.clicked(props.item)}
				/>
			</div>
		</div>
	);
};

export default productOverview;
