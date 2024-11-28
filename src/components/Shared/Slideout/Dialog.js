import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from './Drawer';
import DialogContent from './DialogContent';
import { slidoutState } from 'hookstate/initialStates';

const useStyles = makeStyles(theme => ({
	contentRoot: ({ selectedActivity }) => ({
		overflowY: 'overlay',
		overflowX: 'hidden',
		marginRight: selectedActivity ? '60px' : '0px',
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
