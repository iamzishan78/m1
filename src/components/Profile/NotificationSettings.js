import React, { useContext } from 'react';
import { Box, FormControlLabel, makeStyles, Checkbox, Grid } from '@material-ui/core';
import MuiDialogContent from '@material-ui/core/DialogContent';
// component
import { ProfileContext } from './ProfileContext';
import ProfileActions from './ProfileActions';

const useStyles = makeStyles(() => ({
	boldCheckboxLabel: {
		'& > .MuiFormControlLabel-label': {
			fontWeight: 'bold',
		},
	},
}));

const NotificationSettings = () => {
	const classes = useStyles();
	const [stateProfile, setStateProfile] = useContext(ProfileContext);
	const { notificationPreferences } = stateProfile.fields;

	const handleCheckboxChange = event => {
		const { name, checked } = event.target;
		const newNotificationsState = { ...notificationPreferences };

		if (name === 'flowModule') {
			newNotificationsState.newDealsAssigned = checked;
			newNotificationsState.dealEntersAssignedLane = checked;
		} else if (name === 'activities') {
			newNotificationsState.newTaskAssigned = checked;
			newNotificationsState.myClosedTasks = checked;
		} else {
			newNotificationsState[name] = checked;
		}

		setStateProfile({
			...stateProfile,
			fields: {
				...stateProfile.fields,
				notificationPreferences: newNotificationsState,
			},
		});
	};

	return (
		<MuiDialogContent>
			<Box style={{ padding: '6px' }}>
				<h3>Send me email notifications for the following:</h3>
				<dl>
					<dt>
						<FormControlLabel
							control={
								<Checkbox
									checked={
										!!notificationPreferences?.newDealsAssigned || !!notificationPreferences?.dealEntersAssignedLane
									}
									onChange={handleCheckboxChange}
									name="flowModule"
								/>
							}
							className={classes.boldCheckboxLabel}
							label="Flow Module"
							disabled={stateProfile.isSaving}
						/>
					</dt>
					<dd>
						<FormControlLabel
							control={
								<Checkbox
									checked={!!notificationPreferences?.newDealsAssigned}
									onChange={handleCheckboxChange}
									name="newDealsAssigned"
								/>
							}
							label="New deals assigned to me"
							disabled={stateProfile.isSaving}
						/>
					</dd>
					<dd>
						<FormControlLabel
							control={
								<Checkbox
									checked={!!notificationPreferences?.dealEntersAssignedLane}
									onChange={handleCheckboxChange}
									name="dealEntersAssignedLane"
								/>
							}
							label="Deal enters a lane assigned to me"
							disabled={stateProfile.isSaving}
						/>
					</dd>
					<dt>
						<FormControlLabel
							control={
								<Checkbox
									checked={!!notificationPreferences?.mentions}
									onChange={handleCheckboxChange}
									name="mentions"
								/>
							}
							className={classes.boldCheckboxLabel}
							label="Comment Mentions"
							disabled={stateProfile.isSaving}
						/>
					</dt>
					<dt>
						<FormControlLabel
							control={
								<Checkbox
									checked={!!notificationPreferences?.newTaskAssigned || !!notificationPreferences?.myClosedTasks}
									onChange={handleCheckboxChange}
									name="activities"
								/>
							}
							className={classes.boldCheckboxLabel}
							label="Activities/Tasks"
							disabled={stateProfile.isSaving}
						/>
					</dt>
					<dd>
						<FormControlLabel
							control={
								<Checkbox
									checked={!!notificationPreferences?.newTaskAssigned}
									onChange={handleCheckboxChange}
									name="newTaskAssigned"
								/>
							}
							label="New Tasks that are assigned to me"
							disabled={stateProfile.isSaving}
						/>
					</dd>
					<dd>
						<FormControlLabel
							control={
								<Checkbox
									checked={!!notificationPreferences?.myClosedTasks}
									onChange={handleCheckboxChange}
									name="myClosedTasks"
								/>
							}
							label="Closed Tasks created by me assigned to others"
							disabled={stateProfile.isSaving}
						/>
					</dd>
				</dl>
			</Box>

			<Grid sm={12}>
				<ProfileActions />
			</Grid>
		</MuiDialogContent>
	);
};

export default NotificationSettings;
