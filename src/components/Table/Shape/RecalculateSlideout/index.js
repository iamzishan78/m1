import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import 'components/Transact/components/DealDialog/dialog.css';
import DialogContent from './DialogContent';
import { Typography } from '@material-ui/core';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles(theme => ({
  dealDetailRoot: {
    '& .MuiDialog-paper': {
      overflowY: 'hidden',
    },
  },
  dialog: {
    zIndex: '9999999999 !important',
  },
  actionButtons: {
    margin: "0px 25px 50px 0px",
  },
  topHeading: { fontWeight: "bold" },
  dialogTitle: {
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

function RecalculateSlideout({
  rows,
  setRows,
  onClose
}) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.dealDetailRoot}>
        <RightDialog
          open={true}
          handleClickDialogClose={onClose}
          width="28vw"
          hiddenOverflow
          noBorder
          hideBackdrop={true}
        >
          <MuiDialogTitle disableTypography className={classes.dialogTitle}>
            <Typography className={classes.topHeading} variant="h6" component="h1">
              Recalculate Ownership Values
            </Typography>
            <IconButton aria-label="close" onClick={onClose} size='small'>
              <KeyboardTabIcon fontSize="large" />
            </IconButton>
          </MuiDialogTitle>

          <DialogContent rows={rows} setRows={setRows} onClose={onClose} />
        </RightDialog>
      </div>
    </>
  );
}

export default RecalculateSlideout;
