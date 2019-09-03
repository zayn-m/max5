import React from 'react';
import ContentLoader from 'react-content-loader';

const skelton = () => (
	<ContentLoader style={{ height: '70vh', width: '100%' }}>
		{/* Only SVG shapes */}
		<rect x="0" y="17" rx="4" ry="4" width="150" height="13" />
		<rect x="0" y="40" rx="3" ry="3" width="240" height="100" />
		<rect x="260" y="17" rx="0" ry="0" width="140" height="120" />
	</ContentLoader>
);

export default skelton;
