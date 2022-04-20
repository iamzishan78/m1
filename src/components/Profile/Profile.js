import Dialog from "@material-ui/core/Dialog";
import { Tabs, Tab, Checkbox, FormControlLabel, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { NavigationContext } from "../Navigation/NavigationContext";
import ImageModal from "./ImageModal";
import ProfileActions from "./ProfileActions";
import ProfileContent from "./ProfileContent";
import ProfileTitle from "./ProfileTitle";
import { TramOutlined, TrendingUpOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: "100px",
    marginLeft: "auto",
    marginBottom: "auto",
    maxHeight: "calc(100% - 72px)",
    overflow: "hidden",
  },
  tabs: {
    paddingLeft: theme.spacing(2),
  },
  tab: {
    minWidth: "unset",
  },
  boldCheckboxLabel: {
    "& > .MuiFormControlLabel-label": {
      fontWeight: "bold",
    },
  },
}));

const Profile = () => {
  const [tab, setTab] = React.useState(0);
  const [notificationsState, setNotificationState] = React.useState({
    flowModule: false,
    newDealsAssigned: false,
    delasEntersOnAssignedLane: false,
    mentions: false,
  });
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { isProfileOpen } = stateNav;
  const classes = useStyles();
  const handleClose = () => {
    setStateNav({ ...stateNav, isProfileOpen: false });
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const setObj = {
      [name]: checked
    }

    if (name === "flowModule"){
      setObj.newDealsAssigned = true;
      setObj.delasEntersOnAssignedLane = true;
    }

    setNotificationState({
      ...notificationsState,
      ...setObj
    });
  }

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="profile-dialog"
        open={isProfileOpen}
        classes={{ paper: classes.paper }}
      >
        {isProfileOpen && <ImageModal />}
        <ProfileTitle />
        <Tabs
          className={classes.tabs}
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Profile" className={classes.tab} />
          <Tab label="Notificatons" className={classes.tab} />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <ProfileContent />
          <ProfileActions />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Box p={2}>
            <p>Send me email notificaitons for:</p>
            <dl>
              <dt>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notificationsState.flowModule}
                      onChange={handleCheckboxChange}
                      name="flowModule"
                    />
                  }
                  className={classes.boldCheckboxLabel}
                  label="Flow Module"
                />
              </dt>
              <dd>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notificationsState.newDealsAssigned}
                      onChange={handleCheckboxChange}
                      name="newDealsAssigned"
                    />
                  }
                  label="New deals assigned to you"
                />
              </dd>
              <dd>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notificationsState.delasEntersOnAssignedLane}
                      onChange={handleCheckboxChange}
                      name="delasEntersOnAssignedLane"
                    />
                  }
                  label="Deals enters lane assigned to you"
                />
              </dd>
              <dt>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notificationsState.mentions}
                      onChange={handleCheckboxChange}
                      name="mentions"
                    />
                  }
                  className={classes.boldCheckboxLabel}
                  label="Mentions"
                />
              </dt>
            </dl>
          </Box>
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
      {value === index && (
        children
      )}
    </div>
  );
}

export default Profile;
