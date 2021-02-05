import React, { useContext, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useMutation } from "@apollo/client";
import { UPDATECONTACT } from "../../../graphQL/useMutationUpdateContact";
import { AppContext } from "../../../AppContext";
import { useDispatch } from "react-redux";
import { showSuccessMessage, showErrorMessage } from "../../../actions";

export default function ConfirmationDialog(props) {
  const dispatch = useDispatch();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [updateContact] = useMutation(UPDATECONTACT);

  const handleAccept = () => {
    props.handleDialogClose(false);
    // props.handleCloseExpandableCard();

    setStateApp((state) => ({ ...state, universalCircularLoaderAct: true }));
    let res = updateContact({
      variables: {
        contact: {
          _id: props.id,
          lastUpdateBy: stateApp.user.mongoId,
          IsDeleted: true,
        },
      },
      refetchQueries: [
        "getPaginatedContacts",
        // "getContact",
        "getCustomLayer",
        "getparcelOwners",
      ],
      awaitRefetchQueries: true,
    });

    res.then((result) => {
      const { data } = result;

      if (data && data.updateContact) {
        if (data.updateContact.success) {
          dispatch(
            showSuccessMessage(
              data.updateContact.contact && data.updateContact.contact.name //// name it's not currently bringed from db
                ? `${data.updateContact.contact.name} was successfully removed`
                : "The contact was successfully removed"
            )
          );
          // props.handleDialogClose(false);
          props.handleCloseExpandableCard();
        } else {
          dispatch(showErrorMessage("Error occurred"));
        }
        setStateApp((state) => ({
          ...state,
          universalCircularLoaderAct: false,
        }));
      }
    });
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={props.openDialog}
        onClose={() => {
          props.handleDialogClose(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          style={{ textAlign: "center", padding: "24px 24px 0 24px" }}
        >
          Are you sure you want to delete selected contact?
        </DialogTitle>
        {/* <DialogContent>
        </DialogContent> */}
        <DialogActions>
          <Button
            onClick={() => {
              props.handleDialogClose(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAccept();
            }}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
