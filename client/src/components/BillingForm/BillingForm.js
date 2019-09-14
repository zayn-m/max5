import React from 'react';

const billingForm = () => (
	<form>
		<h3>Name & Address</h3>
		<hr />
		<div className="form-row ">
			<div className="form-group col-md-12">
				<label htmlFor="inputEmail4">Email</label>
				<input type="email" className="form-control" id="inputEmail4" placeholder="Email" />
			</div>
		</div>
		<div className="form-group">
			<label htmlFor="inputAddress">Address</label>
			<input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
		</div>
		<div className="form-group">
			<label htmlFor="inputAddress2">Address 2</label>
			<input type="text" className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
		</div>
		<div className="form-row">
			<div className="form-group col-md-4">
				<label htmlFor="inputCity">City</label>
				<input type="text" className="form-control" id="inputCity" />
			</div>
			<div className="form-group col-md-6">
				<label htmlFor="inputCity">State</label>
				<input type="text" className="form-control" id="inputState" />
			</div>

			<div className="form-group col-md-2">
				<label htmlFor="inputZip">Zip</label>
				<input type="text" className="form-control" id="inputZip" />
			</div>
		</div>
	</form>
);

export default billingForm;
