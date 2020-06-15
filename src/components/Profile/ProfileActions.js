import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { UPSERTPROFILE } from "../../graphQL/useMutationUpsertProfile";
import { GETPROFILE } from "../../graphQL/useQueryGetProfile";
import { NavigationContext } from "../Navigation/NavigationContext";
import { ProfileContext } from "./ProfileContext";

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const ProfileActions = () => {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateProfile, setStateProfile] = useContext(ProfileContext);
  const { isProfileOpen } = stateNav;
  const {
    user: { email },
  } = stateApp;
  const [updateProfile, { called, loading, data }] = useMutation(UPSERTPROFILE);
  const history = useHistory();

  const handleClose = () => {
    setStateNav({ ...stateNav, isProfileOpen: false });
    history.goBack();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({
      variables: { profileData: { ...stateProfile.fields, email } },
    });
    handleClose();
  };

  return (
    <DialogActions>
      <Button
        variant="outlined"
        onClick={handleClose}
        color="primary"
        style={{ textTransform: "none" }}
      >
        Cancel
      </Button>
      <Button
        style={{
          textTransform: "none",
          color: "white",
          background: "#0e5721",
        }}
        variant="outlined"
        onClick={handleSubmit}
      >
        Save changes
      </Button>
    </DialogActions>
  );
};

export default ProfileActions;
