import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext } from "react";
import ImageModalContent from "./ImageModalContent";
import ImageModalTitle from "./ImageModalTitle";
import { ProfileContext } from "./ProfileContext";

const useStyles = makeStyles(() => ({
  paper: {
    margin: "64px 48px auto auto",
    minWidth: "350px",
    maxHeight: "calc(100% - 88px)",
  },
}));

const ImageModal = () => {
  const [stateProfile, setStateProfile] = useContext(ProfileContext);

  const { isImageModalOpen } = stateProfile;
  const classes = useStyles();

  const handleClose = () => {
    setStateProfile({ ...stateProfile, isImageModalOpen: false });
  };


  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="profile-dialog"
      open={isImageModalOpen}
      classes={{ paper: classes.paper }}
    >
      <ImageModalTitle />
      <ImageModalContent />
    </Dialog>
  );
};

export default ImageModal;
