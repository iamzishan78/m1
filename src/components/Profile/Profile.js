import React, { useContext, useRef, useEffect } from 'react';

import { Tabs, Tab } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import { useMutation } from '@apollo/client';

import { deepEqual } from 'components/Shared/functions';

import { UPSERTPROFILE } from 'graphQL/useMutationUpsertProfile';

import { globalStateController } from 'stateManagement/globalStateController';

import ImageModal from './ImageModal';
import NotificationSettings from './NotificationSettings';
import ProfileContent from './ProfileContent';
import { ProfileContext } from './ProfileContext';
import ProfileTitle from './ProfileTitle';
import { NavigationContext } from '../Navigation/NavigationContext';

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: '100px',
		marginLeft: 'auto',
		marginBottom: 'auto',
		maxHeight: 'calc(100% - 72px)',
		overflow: 'hidden',
	},
	tabs: {
		paddingLeft: theme.spacing(2),
	},
	tab: {
		minWidth: 'unset',
	},
}));

const Profile = () => {
	const [tab, setTab] = React.useState(0);
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);
	const { isProfileOpen } = stateNav;
	const [stateProfile] = useContext(ProfileContext);
	const defaultProfile = useRef(null);
	const [updateProfile] = useMutation(UPSERTPROFILE);

	useEffect(() => {
		// check if defaultProfile is null and displayName is defined
		if (!defaultProfile.current && stateProfile?.fields?.displayName) {
			defaultProfile.current = stateProfile;
		}
	}, [stateProfile]);

	const handleSaveProfile = async () => {
		if (defaultProfile.current && !deepEqual(stateProfile, defaultProfile.current)) {
			const user = globalStateController.getValue('user');
			await updateProfile({
				variables: { profileData: { ...stateProfile.fields, email: user.email } },
			});
			defaultProfile.current = stateProfile;
			window.setStateApp(state => ({
				...state,
				user: {
					...state.user,
					...stateProfile.fields,
					email: user.email,
				},
			}));
		}
	};

	const handleClose = async () => {
		setStateNav({ ...stateNav, isProfileOpen: false });
		await handleSaveProfile();
	};

	const handleTabChange = async (event, newValue) => {
		setTab(newValue);
		await handleSaveProfile();
	};

	return (
		<div>
			<Dialog
				onClose={handleClose}
				aria-labelledby="profile-dialog"
				open={isProfileOpen}
				classes={{ paper: classes.paper }}
			>
				{isProfileOpen && <ImageModal />}
				<ProfileTitle handleClose={handleClose} />
				<Tabs
					className={classes.tabs}
					value={tab}
					onChange={handleTabChange}
					indicatorColor="primary"
					textColor="primary"
				>
					<Tab label="Profile" className={classes.tab} />
					<Tab label="Notifications" className={classes.tab} />
				</Tabs>

				<TabPanel value={tab} index={0}>
					<ProfileContent />
				</TabPanel>
				<TabPanel value={tab} index={1}>
					<NotificationSettings />
				</TabPanel>
			</Dialog>
		</div>
	);
};

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`wrapped-tabpanel-${index}`}
			aria-labelledby={`wrapped-tab-${index}`}
			{...other}
		>
			{value === index && children}
		</div>
	);
}

export default Profile;
