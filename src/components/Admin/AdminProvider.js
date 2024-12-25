import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import Admin from './Admin';
import { AdminsContextProvider } from './AdminContext';
const useStyles = makeStyles(theme => ({
	AdminWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function AdminsProvider(props) {
	let classes = useStyles();
	return (
		<AdminsContextProvider>
			<Admin className={classes.AdminWrapper}>{props.children}</Admin>
		</AdminsContextProvider>
	);
}
