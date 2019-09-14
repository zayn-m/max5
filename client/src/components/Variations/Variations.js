import React from 'react';

const variations = ({ variations, startingImage, displayStartingImage, changeDisplayImage }) => (
	<div className="col-8 mx-auto d-flex justify-content-around">
		<div
			style={{ height: '6rem', width: '5rem', cursor: 'pointer' }}
			className="border"
			onClick={() => displayStartingImage(startingImage)}
		>
			<img src={startingImage} className="img-fluid" alt="variation" />
		</div>

		{variations &&
			variations.map((variation) => (
				<div
					key={variation}
					style={{ height: '6rem', width: '5rem', cursor: 'pointer' }}
					className="border"
					onClick={() => changeDisplayImage(variation)}
				>
					<img src={variation} className="img-fluid" alt="variation" />
				</div>
			))}
	</div>
);

export default variations;
