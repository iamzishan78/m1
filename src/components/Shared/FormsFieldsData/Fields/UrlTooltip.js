import React from 'react';

import PropTypes from 'prop-types';
import validator from 'validator';

import { normalizeUrl } from 'components/Shared/functions';

const UrlTooltip = ({ value, handleMouseEnter, handleMouseLeave, containerStyles, linkStyles }) => {
	return (
		<div
			style={{
				position: 'absolute',
				left: '0',
				transform: 'translateY(-100%)',
				backgroundColor: '#fff',
				border: '1px solid #ccc',
				padding: '8px',
				borderRadius: '4px',
				zIndex: 1,
				boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
				...containerStyles,
			}}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{value?.split(' ')?.map((subString, index) =>
				validator.isURL(subString, { require_protocol: false }) ? (
					<>
						<span
							style={{
								color: 'dodgerblue',
								textDecoration: 'underline',
								cursor: 'pointer',
								...linkStyles,
							}}
							onMouseDown={() => {
								window.open(normalizeUrl(subString), '_blank', 'noopener,noreferrer');
							}}
						>
							{subString}
						</span>
						{index < value?.split(' ')?.length - 1 && ', '}
					</>
				) : null
			)}
		</div>
	);
};

UrlTooltip.propTypes = {
	value: PropTypes.string.isRequired,
	handleMouseEnter: PropTypes.func.isRequired,
	handleMouseLeave: PropTypes.func.isRequired,
	containerStyles: PropTypes.object,
	linkStyles: PropTypes.object,
};

export default UrlTooltip;
