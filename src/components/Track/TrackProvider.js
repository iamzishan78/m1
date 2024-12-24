import { makeStyles } from '@material-ui/core/styles';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';

import Track from './Track';
import { TrackContextProvider } from './TrackContext';

const useStyles = makeStyles(theme => ({
	trackWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function TrackProvider(props) {
	let classes = useStyles();
	return (
		<TrackContextProvider>
			<Track className={classes.trackWrapper}>{props.children}</Track>
		</TrackContextProvider>
	);
}
