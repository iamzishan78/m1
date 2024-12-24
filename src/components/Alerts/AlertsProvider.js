import { makeStyles } from '@material-ui/core/styles';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';

import Alerts from './Alerts';
import { AlertsContextProvider } from './AlertsContext';

const useStyles = makeStyles(theme => ({
	alertsWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function AlertsProvider(props) {
	let classes = useStyles();
	return (
		<AlertsContextProvider>
			<Alerts className={classes.alertsWrapper}>{props.children}</Alerts>
		</AlertsContextProvider>
	);
}
