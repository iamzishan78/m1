import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import DialogContent from './DialogContent';
import Drawer from './Drawer';

const useStyles = makeStyles(theme => ({
	contentRoot: {
		overflowY: 'overlay',
		overflowX: 'hidden',
		marginRight: '60px',
	},
}));

function Dialog(props) {
	const classes = useStyles();

	return (
		<div className={classes.contentRoot}>
			<Drawer />
			<DialogContent />
		</div>
	);
}

export default Dialog;
