import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import 'components/Transact/components/DealDialog/dialog.css';
import Dialog from './Dialog';
import DialogHeader from './DialogHeader';
import { tableGlobalController } from 'hookstate/tableController';

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
  show,
  deleteFunc
}) {
  const classes = useStyles();

  const handleClose = async () => {
    tableGlobalController.updateState({
      documentDialog: {
        type: {}
      },
    });
  };

  if (!show) return null;

  return (
    <>
      <div className={classes.dealDetailRoot}>
        <RightDialog
          open={true}
          handleClickDialogClose={handleClose}
          width="28vw"
          hiddenOverflow
          noBorder
          hideBackdrop={true}
        >
          <DialogHeader
            handleClickDialogClose={handleClose}
            deleteFunc={deleteFunc}
          />
          <Dialog />
        </RightDialog>
      </div>
    </>
  );
}

export default memo(Slideout);
