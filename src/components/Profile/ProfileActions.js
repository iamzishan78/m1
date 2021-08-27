import { useMutation } from "@apollo/client";
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
import { CircularProgress } from "@material-ui/core";
const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const ProfileActions = () => {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateProfile, setStateProfile] = useContext(ProfileContext);
  const [appContext, setAppContext] = useContext(AppContext);

  const [updateProfile] = useMutation(UPSERTPROFILE);
  const history = useHistory();
  const { isSaving } = stateProfile;
  const { user } = appContext;

  const handleClose = () => {
    setStateNav({ ...stateNav, isProfileOpen: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStateProfile({ ...stateProfile, isSaving: true });
    await updateProfile({
      variables: { profileData: { ...stateProfile.fields, email: user.email } },
    });
    handleClose();
    setStateProfile({ ...stateProfile, isSaving: false });
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
        style={{ backgroundColor: "#00abed", color: "white" }}
        variant="contained"
        onClick={handleSubmit}
        endIcon={isSaving && <CircularProgress style={{ width: 12, height: 12 }} />}
      >
        {isSaving ? "Saving..." : "Save changes"}
      </Button>
    </DialogActions>
  );
};

export default ProfileActions;
