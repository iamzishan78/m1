import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import InitializeProfile from './InitializeProfileContext';
import Profile from './Profile';
import { ProfileContextProvider } from './ProfileContext';

const useStyles = makeStyles(theme => ({
	trackWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function ProfileProvider(props) {
	let classes = useStyles();
	return (
		<ProfileContextProvider>
			<InitializeProfile />
			<Profile className={classes.trackWrapper}>{props.children}</Profile>
		</ProfileContextProvider>
	);
}
