import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { NavigationContext } from "../Navigation/NavigationContext";
import ImageModal from "./ImageModal";
import ProfileActions from "./ProfileActions";
import ProfileContent from "./ProfileContent";
import ProfileTitle from "./ProfileTitle";
import { AppContext } from "../../AppContext";
import { ProfileContext } from "./ProfileContext";

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: "100px",
    marginLeft: "auto",
    marginBottom: "auto",
    maxHeight: "calc(100% - 72px)",
    overflow: 'hidden'
  },
}));

const Profile = () => {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { isProfileOpen } = stateNav;
  const classes = useStyles();
  const history = useHistory();
  const handleClose = () => {
    setStateNav({ ...stateNav, isProfileOpen: false });
    history.goBack();
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="profile-dialog"
        open={isProfileOpen}
        maxWidth={"xl"}
        classes={{ paper: classes.paper }}
      >
        {isProfileOpen && <ImageModal/>}
        <ProfileTitle />
        <ProfileContent />
        <ProfileActions />
      </Dialog>
    </div>
  );
};

export default Profile;
