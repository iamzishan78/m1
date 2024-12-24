import { makeStyles, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import React from 'react';

import { Modals } from 'styles/Modal';

const useStyles = makeStyles(theme => ({
	downloadIcon: {
		color: '#A6A6A6',
		width: '30px',
		height: '28px',
	},
	areaExceed: {
		fontSize: 16,
		marginTop: 10,
	},
}));

const LimitExceedPopUp = ({ open, onClose }) => {
	const modalClass = Modals();
	const classes = useStyles();
	return (
		<Dialog className={classes.dialog} open={open} onClick={onClose} fullWidth={false} maxWidth="sm">
			<React.Fragment>
				<DialogTitle className={modalClass.title} id="customized-dialog-title">
					<span style={{ marginRight: 20 }}>Shape Boundry Size Limit Exceeded</span>
					<HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={onClose} />
				</DialogTitle>
				<DialogContent>
					<div className={classes.areaExceed}>The drawn shape exceeds the maximum size of 500,000 acres.</div>
					<div className={classes.areaExceed}>Please draw a smaller shape to leverage this functionality.</div>
				</DialogContent>
			</React.Fragment>
		</Dialog>
	);
};

export default LimitExceedPopUp;
