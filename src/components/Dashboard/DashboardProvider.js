import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import InitializeProfile from 'components/Profile/InitializeProfileContext';
import { ProfileContextProvider } from 'components/Profile/ProfileContext';

import Dashboard from './Dashboard';
import { DashboardContextProvider } from './DashboardContext';

const useStyles = makeStyles(theme => ({
	dashboardWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function DashboardProvider(props) {
	let classes = useStyles();
	return (
		<ProfileContextProvider>
			<InitializeProfile />
			<DashboardContextProvider>
				<Dashboard className={classes.dashboardWrapper}>{props.children}</Dashboard>
			</DashboardContextProvider>
		</ProfileContextProvider>
	);
}
