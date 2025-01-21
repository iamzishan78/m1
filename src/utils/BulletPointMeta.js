const { getMetaCss } = require('./getMetaCss');

export const BulletPointMeta = ({ option, bulletValue, iconType, index }) => {
	const bulletStyles = getMetaCss({ option, iconType });

	return (
		<li
			key={index}
			style={{
				listStyleType: 'none',
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<span style={bulletStyles} />
			<span>{bulletValue}</span>
		</li>
	);
};
