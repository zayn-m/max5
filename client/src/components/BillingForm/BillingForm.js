import React from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

const billingForm = ({ controls, region, country, currentUser, regionChange, countryChange, handleChange, submit }) => {
	const { name, email, address, address2, city, zip } = controls;
	return (
		<form onSubmit={submit}>
			<h3>Name & Address</h3>
			<hr />
			<div className="form-group">
				<label htmlFor="name">Full Name</label>
				<input
					type="text"
					className="form-control"
					id="name"
					name="name"
					value={name}
					placeholder="Jon Doe"
					onChange={handleChange}
					required
				/>
			</div>
			<div className="form-row ">
				<div className="form-group col-md-12">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						className="form-control"
						id="email"
						name="email"
						value={currentUser ? currentUser.email : email}
						placeholder="jon@example.com"
						onChange={handleChange}
						required
					/>
				</div>
			</div>
			<div className="form-group">
				<label htmlFor="address">Address</label>
				<input
					type="text"
					className="form-control"
					id="address"
					name="address"
					value={address}
					placeholder="1234 Main St"
					onChange={handleChange}
					required
				/>
			</div>
			<div className="form-group">
				<label htmlFor="address2">Address 2</label>
				<input
					type="text"
					className="form-control"
					id="address2"
					name="address2"
					value={address2}
					placeholder="Apartment, studio, or floor"
					onChange={handleChange}
				/>
			</div>
			<div className="form-row">
				<div className="form-group col-md-8">
					<label htmlFor="city">City</label>
					<input
						type="text"
						className="form-control"
						id="city"
						name="city"
						value={city}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group col-md-4">
					<label htmlFor="zip">Zip Code</label>
					<input
						type="number"
						className="form-control"
						id="zip"
						name="zip"
						value={zip}
						onChange={handleChange}
						required
					/>
				</div>
			</div>
			<div className="d-flex justify-content-between">
				<CountryDropdown style={{ width: '50%' }} value={country} onChange={countryChange} />
				<RegionDropdown style={{ width: '45%' }} country={country} value={region} onChange={regionChange} />
			</div>
			<div className="mx-auto text-center mb-5">
				<button className="btn btn-danger" type="submit">
					Continue
				</button>
			</div>
		</form>
	);
};

export default billingForm;
