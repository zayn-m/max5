import React from 'react';

const spinner = ({ width, height }) => (
	<div className="spinner-grow text-center mx-auto" style={{ width: width, height: height }} role="status">
		<span className="sr-only">Loading...</span>
	</div>
);

export default spinner;
