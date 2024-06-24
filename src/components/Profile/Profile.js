import React, { useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import { Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NavigationContext } from "../Navigation/NavigationContext";
import ImageModal from "./ImageModal";
import ProfileActions from "./ProfileActions";
import ProfileContent from "./ProfileContent";
import ProfileTitle from "./ProfileTitle";
import NotificationSettings from "./NotificationSettings";

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
}));

const Profile = () => {
  const [tab, setTab] = React.useState(0);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { isProfileOpen } = stateNav;
  const classes = useStyles();

  const handleClose = () => {
    setStateNav({ ...stateNav, isProfileOpen: false });
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
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
        <ProfileTitle />
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
      {value === index && (
        children
      )}
    </div>
  );
}

export default Profile;
