import { makeStyles } from '@material-ui/core/styles';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';

import Transact from './Transact';
import { TransactContextProvider } from './TransactContext';

const useStyles = makeStyles(theme => ({
	transactWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function TransactProvider(props) {
	let classes = useStyles();
	return (
		<TransactContextProvider>
			<Transact className={classes.transactWrapper}>{props.children}</Transact>
		</TransactContextProvider>
	);
}
