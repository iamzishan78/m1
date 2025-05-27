import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { slidoutState } from 'stateManagement/initialStates';

import DialogContent from './DialogContent';
import Drawer from './Drawer';

const useStyles = makeStyles(theme => ({
	contentRoot: ({ selectedActivity }) => ({
		overflowY: 'overlay',
		overflowX: 'hidden',
		marginRight: selectedActivity ? '60px' : '0px',
		flexGrow: 1,
	}),
}));

function Dialog() {
	const selectedActivity = slidoutState.selectedActivity.get({ noproxy: true });
	const classes = useStyles({ selectedActivity });

	return (
		<div className={classes.contentRoot}>
			{selectedActivity && (
				<Drawer dealSettingsNumber={/* getSubtaskNumber() */ null} mapSettings={/* mapSettings */ null} />
			)}
			<DialogContent />
		</div>
	);
}

export default Dialog;
