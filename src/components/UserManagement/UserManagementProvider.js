import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import UserManagementContainer from './Container';
import { UserManagementContextProvider } from './UserManagementContext';

const useStyles = makeStyles(theme => ({
	trackWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function UserManagementProvider(props) {
	let classes = useStyles();
	return (
		<UserManagementContextProvider>
			<UserManagementContainer className={classes.trackWrapper}>{props.children}</UserManagementContainer>
		</UserManagementContextProvider>
	);
}
