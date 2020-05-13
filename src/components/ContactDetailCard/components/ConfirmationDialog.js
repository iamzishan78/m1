import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { REMOVECONTACT } from "../../../graphQL/useMutationRemoveContact";
import { useMutation } from "@apollo/react-hooks";

export default function ConfirmationDialog(props) {
  const [removeContact] = useMutation(REMOVECONTACT);

  const handleAccept = () => {
    props.handleDialogClose(false);
    removeContact({
      variables: {
        contactId: props.id,
      },
      refetchQueries: [
        "getContacts",
        "getContactsByOwnerId",
        "getContactsCounter",
        "getContact",
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
          Do you want to permanently delete the contact?
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
