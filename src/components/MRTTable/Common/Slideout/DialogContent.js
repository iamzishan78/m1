import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { slidoutStateController } from 'hookstate/slidoutStateController';

const useStyles = makeStyles(theme => ({
	homeRoot: {
		padding: '15px 25px 0px',
	},
	otherViewRoot: {
		padding: '15px 25px 0px',
	},
}));

function DialogContent(props) {
	const classes = useStyles();

	const slideOutState = slidoutStateController.useState(['parentId', 'view']);
	const slideOutStateValues = slideOutState.stateValues;

	const { Component } = slideOutStateValues?.view;

	return <Component />;
}

export default DialogContent;
