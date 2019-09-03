import React from 'react';

import './Card.css';

const card = ({item, clicked}) => (
    
	<div className="product-card" onClick={clicked}>
		<div className="row no-gutters">
			<div className="col-6">
				<img className="img-fluid" src={item.imageUrl} alt="Gloves" />
			</div>
			<div className="col-6 mt-3">
				<strong className="product-card__name">{item.name}</strong>
				<label className="product-card__price">${item.price}</label>
			</div>
		</div>
	</div>
);

export default card;
