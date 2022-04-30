import React, { useContext } from 'react';
import { Box, FormControlLabel, makeStyles, Checkbox } from "@material-ui/core";
// component
import { ProfileContext } from './ProfileContext';

const useStyles = makeStyles(() => ({
  boldCheckboxLabel: {
    "& > .MuiFormControlLabel-label": {
      fontWeight: "bold",
    },
  },
}));

const NotificationSettings = () => {
  const classes = useStyles();
  const [stateProfile, setStateProfile] = useContext(ProfileContext);
  const { notificationPreferences } = stateProfile.fields;

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const newNotificationsState = { ...notificationPreferences };

    if (name === "flowModule") {
      newNotificationsState.newDealsAssigned = checked;
      newNotificationsState.dealEntersAssignedLane = checked;
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
    <Box p={2}>
      <p>Send me email notificaitons for:</p>
      <dl>
        <dt>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!notificationPreferences?.newDealsAssigned ||
                          !!notificationPreferences?.dealEntersAssignedLane}
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
            label="New deals assigned to you"
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
            label="Deals enters lane assigned to you"
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
            label="Mentions"
            disabled={stateProfile.isSaving}
          />
        </dt>
      </dl>
    </Box>
  );
}

export default NotificationSettings;