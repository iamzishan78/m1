import React, { useContext, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useMutation } from "@apollo/react-hooks";
import { UPDATECONTACT } from "../../../graphQL/useMutationUpdateContact";
import { AppContext } from "../../../AppContext";
import { useDispatch } from "react-redux";
import { showSuccessMessage, showErrorMessage } from "../../../actions";

export default function ConfirmationDialog(props) {
  const dispatch = useDispatch();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [updateContact, { data: contactDeleted }] = useMutation(UPDATECONTACT);

  useEffect(() => {
    if (contactDeleted && contactDeleted.updateContact) {
      if (contactDeleted.updateContact.success) {
        dispatch(
          showSuccessMessage(
            contactDeleted.updateContact.contact &&
              contactDeleted.updateContact.contact.name
              ? `${contactDeleted.updateContact.contact.name} was successfully removed`
              : "The contact was successfully removed"
          )
        );
        props.handleDialogClose(false);
        props.handleCloseExpandableCard();
        setStateApp((state) => ({
          ...state,
          universalCircularLoaderAct: false,
        }));
      } else {
        dispatch(showErrorMessage("Error occurred"));
      }
    }
  }, [contactDeleted]);

  const handleAccept = () => {
    props.handleDialogClose(false);
    setStateApp((state) => ({ ...state, universalCircularLoaderAct: true }));
    updateContact({
      variables: {
        contact: {
          _id: props.id,
          lastUpdateBy: stateApp.user.mongoId,
          IsDeleted: true,
        },
      },
      refetchQueries: [
        "getContacts",
        // "getContactsByOwnerId",
        // "getContact",
        "getContactsCounter",
      ],
      awaitRefetchQueries: true,
    });
    props.handleCloseExpandableCard();
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
          Do you want delete the contact?
        </DialogTitle>
        {/* <DialogContent>
        </DialogContent> */}
        <DialogActions>
          <Button
            onClick={() => {
              handleAccept();
            }}
            color="primary"
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              props.handleDialogClose(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
