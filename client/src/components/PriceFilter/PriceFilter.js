import React from 'react';

const priceFilter = ({ min, max, handleMin, handleMax, handleFilter }) => (
	<div className="text-right m-5">
		<strong>Filter by Price</strong>
		<div className="d-flex justify-content-end">
			<div className="form-group m-1">
				<input
					style={{ width: 120, height: 40 }}
					name="min"
					value={min}
					type="number"
					className="form-control"
					aria-describedby="minHelp"
					placeholder="Min"
					step="0.01"
					onChange={handleMin}
				/>
			</div>
			<div className="form-group m-1">
				<input
					style={{ width: 120, height: 40 }}
					name="max"
					value={max}
					type="number"
					className="form-control"
					aria-describedby="maxHelp"
					placeholder="Max"
					step="0.01"
					onChange={handleMax}
				/>
			</div>
			<div className="form-group m-1">
				<button className="btn btn-danger font-weight-bold" onClick={handleFilter}>
					>
				</button>
			</div>
		</div>
	</div>
);

export default priceFilter;
