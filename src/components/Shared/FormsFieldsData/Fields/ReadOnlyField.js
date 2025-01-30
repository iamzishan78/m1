import React from 'react';

import { Link } from '@mui/material';

import moment from 'moment';
import PropTypes from 'prop-types';

import { normalizeUrl, isValidUrl } from 'components/Shared/functions';

function ReadOnlyField({ value, type }) {
	const renderValue = Array.isArray(value) && value.length > 0 ? value.join(', ') : value;
	let isURL = !type && isValidUrl(renderValue);
	const valueType = isURL ? 'link' : type ? type : 'text';

	switch (valueType) {
		case 'link':
			return (
				<span>
					<Link style={{ color: 'dodgerblue' }} href={normalizeUrl(renderValue)} target="_blank">
						{renderValue}
					</Link>
				</span>
			);
		case 'date':
			return <span>{renderValue ? moment(renderValue).format('DD/MM/YYYY') : ''}</span>;
		default:
			return <span>{renderValue}</span>;
	}
}

ReadOnlyField.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
	type: PropTypes.string,
};

export default ReadOnlyField;
