import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import Data from './Data';

const useStyles = makeStyles(() => ({
	ContactsWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function DataProvider(props) {
	let classes = useStyles();

	return <Data className={classes.ContactsWrapper}>{props.children}</Data>;
}

DataProvider.propTypes = {
	children: PropTypes.node.isRequired, // Ensures `children` is provided and is a valid React node
};
