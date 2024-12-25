import { makeStyles } from '@material-ui/core/styles';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';

import Studio from './Studio';
import { StudioContextProvider } from './StudioContext';

const useStyles = makeStyles(theme => ({
	studioWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function StudioProvider(props) {
	let classes = useStyles();
	return (
		<StudioContextProvider>
			<Studio className={classes.studioWrapper}>{props.children}</Studio>
		</StudioContextProvider>
	);
}
