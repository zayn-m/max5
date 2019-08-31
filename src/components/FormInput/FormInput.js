import React from 'react';

import './FormInput.css';

const formInput = ({ handleChange, label, ...otherProps }) => (
	<div className="group">
		{label && (
			<label className="text-left" htmlFor={label}>
				{label}
			</label>
		)}
		<input onChange={handleChange} {...otherProps} />
	</div>
);

export default formInput;
