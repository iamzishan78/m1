import React, { useState, Fragment, useEffect, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog as MuiDialog } from '@material-ui/core';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';
import 'components/Transact/components/DealDialog/dialog.css';
import Dialog from './Dialog';
import DialogHeader from './DialogHeader';
import {
  slidoutStateController,
} from 'hookstate/slidoutStateController';
import { useHookstate } from '@hookstate/core';
import { slidoutState } from 'hookstate/initialStates';

const useStyles = makeStyles(theme => ({
  dealDetailRoot: {
    '& .MuiDialog-paper': {
      overflowY: 'hidden',
    },
  },
  dialog: {
    zIndex: '9999999999 !important',
  },
}));

function Slideout({
  isTransactPage,
  show
}) {
  const classes = useStyles();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formMode = useHookstate(slidoutState.formMode);
  const parentType = useHookstate(slidoutState.parentType);

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleClose = async () => {
    slidoutState.formMode.set('update');
  };

  const openConfirmationDialog = () => {
    setDeleteDialogOpen(true);
  };

  if (!show) return null;

  return (
    <>
      {deleteDialogOpen && (
        <MuiDialog
          className={classes.dialog}
          open={deleteDialogOpen ? true : false}
          onClose={handleCloseDialog}
          fullWidth={false}
          maxWidth="sm"
        >
          <DeleteConfirmationDialogContent
            header={`Delete ${parentType.get()}`}
            onClose={handleCloseDialog}
            deleteFunc={() => { formMode.set('delete'); }}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => { }}
          >
            Do you want to delete the selected item?
          </DeleteConfirmationDialogContent>
        </MuiDialog>
      )}
      <div className={classes.dealDetailRoot}>
        <RightDialog
          open={true}
          handleClickDialogClose={handleClose}
          width="28vw"
          isTransactPage={isTransactPage}
          hiddenOverflow
          noBorder
          hideBackdrop={true}
        >
          <DialogHeader
            handleClickDialogClose={handleClose}
            openConfirmationDialog={openConfirmationDialog}
          />
          <Dialog />
        </RightDialog>
      </div>
    </>
  );
}

export default memo(Slideout);
