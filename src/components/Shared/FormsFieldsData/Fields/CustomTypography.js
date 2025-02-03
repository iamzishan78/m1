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
	const subStrings = renderValue?.split(' ') || [];

	return (
		<Typography component="span">
			{subStrings.map((subString, index) =>
				validator.isURL(subString, { require_protocol: false }) ? (
					<>
						<Link key={index} className={classes.link} href={normalizeUrl(subString)} target="_blank">
							{subString}
						</Link>
						{index < subStrings.length - 1 && ' '}
					</>
				) : (
					<Typography component="span" key={index}>
						{subString}
						{index < subStrings.length - 1 && ' '}
					</Typography>
				)
			)}
		</Typography>
	);
}

CustomTypography.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
};

export default CustomTypography;
