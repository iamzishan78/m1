import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

export default function DeleteDocumentConfirmation({ open, handleClose, handleAccept, document }) {
  return (
    <div>
      <Dialog open={open} onClose={handleClose} style={{ zIndex: 99999999999 }}>
        <DeleteConfirmationDialogContent
          header="Delete Document"
          onClose={handleClose}
          deleteFunc={handleAccept}
          // m1nSelectedRowsIds={[document._id]}
          // setM1nSelectedRowsIndexes={[document._id]}
        >
          Do you want to delete the selected documents?
        </DeleteConfirmationDialogContent>
      </Dialog>
    </div>
  );
}
