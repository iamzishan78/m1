/* eslint-disable react/no-array-index-key */
import React from 'react';

import { Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import validator from 'validator';

import { normalizeUrl } from 'components/Shared/functions';

const useStyles = makeStyles({
	link: {
		color: 'dodgerblue !important',
		textDecoration: 'underline',
	},
});

function CustomTypography({ value }) {
	const classes = useStyles();
	const renderValue = Array.isArray(value) && value.length > 0 ? value.join(', ') : value;

	if (typeof renderValue !== 'string') {
		return <Typography component="span">{renderValue}</Typography>;
	}

	const subStrings = renderValue?.split(' ') || [];

	return (
		<Typography component="span">
			{subStrings.map((subString, index) => {
				// Remove trailing punctuation for URL validation
				const cleanString = subString.replace(/[.,;!?]$/, '');

				// Keep original string for display
				return validator.isURL(cleanString, { require_protocol: false }) ? (
					<React.Fragment key={index}>
						<Link className={classes.link} href={normalizeUrl(cleanString)} target="_blank">
							{cleanString}
						</Link>
						{subString.slice(cleanString.length)} {/* Add back any trimmed punctuation */}
						{index < subStrings.length - 1 && ' '}
					</React.Fragment>
				) : (
					<Typography component="span" key={index}>
						{subString}
						{index < subStrings.length - 1 && ' '}
					</Typography>
				);
			})}
		</Typography>
	);
}

CustomTypography.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
};

export default CustomTypography;
