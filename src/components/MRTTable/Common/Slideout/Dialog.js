import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from './Drawer';
import DialogContent from './DialogContent';

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
