import React, { useContext } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useApolloClient } from "@apollo/client";

import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import RightDialog from "components/ContactDetailCard/components/RightDialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import Typography from "@material-ui/core/Typography";

import { Modals } from "styles/Modal";

import { AppContext } from "AppContext";
import { execCommonAsyncExportJobAction } from "store/actions/commonActions";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "557px",
    padding: "10px 30px",
  },
  topHeading: { fontWeight: "bold" },
  dialogTitle: {
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    padding: "10px 0px",
    "& svg": {
      fill: "#757575 !important",
    },
  },
  fullWidth: {
    width: "100%",
  },
  field: {
    marginTop: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  value: {
    fontWeight: "bold",
    alignSelf: "center",
  },
  checkbox: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const ExportContacts = ({
  isAllRowsSelected,
  filters,
  esIndex,
  onClose,
  search,
  total,
  open,
  rows,
  type,
}) => {
  const classes = useStyles();
  const modalClass = Modals();
  const [stateApp, setStateApp] = useContext(AppContext);
  const client = useApolloClient();
  const dispatch = useDispatch();
  const { control } = useForm();

  const exportContacts = useWatch({
    control,
    name: "exportContacts",
    defaultValue: false,
  });

  const exportDisabled = !exportContacts;

  const onExport = () => {
    onClose();
    dispatch(execCommonAsyncExportJobAction.STARTED({
      jobType: 'EXPORTCSV',
      client,
      setStateApp,
      userId: stateApp.user.mongoId,
      requestPayload: {
        type,
        total,
        search,
        filters,
        esIndex,
        isSelectAll: isAllRowsSelected,
        contactIds: rows.map(row => row._id),
        contactIdKey: '_id',
        datasets: {
          exportContacts: exportContacts,
          exportContactsPurchase: exportContacts,
        },
        counts: {
          exportContacts: rows.length,
          exportContactsPurchase: rows.length,
        },
      }
    }));
  };

  return (
    <RightDialog open={open} width={'700px'}>
      <MuiDialogTitle disableTypography className={classes.dialogTitle}>
        <Typography className={classes.topHeading} variant="h5" component="h1">
          Export Data to CSV
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="medium"
        >
          <KeyboardTabIcon fontSize="large" />
        </IconButton>
      </MuiDialogTitle>
      <DialogContent>
        <label className={classes.bold}>Available Data Elements</label>

        <div className={classes.field}>
          <div className={classes.checkbox}>
            <div>
              <Controller
                control={control}
                name="exportContacts"
                defaultValue={false}
                render={(props) => (
                  <Checkbox
                    {...props}
                    disabled={rows.length === 0}
                    onChange={(e) => {
                      props.onChange(e.target.checked);
                    }}
                  />
                )}
              />
              <label className={classes.bold}>
                Contact Data (Basic & Purchased Info)
              </label>
            </div>
            <label className={classes.value}>{isAllRowsSelected ? total : rows.length} selected</label>
          </div>
        </div>
      </DialogContent>
      <DialogActions className={modalClass.actionButtons}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          component="span"
          style={{
            backgroundColor: exportDisabled ? "#D3D3D3" : "#00abed",
            color: exportDisabled ? "#999999" : "white",
          }}
          onClick={onExport}
          disabled={exportDisabled}
        >
          Export
        </Button>
      </DialogActions>
    </RightDialog>
  );
};

export default ExportContacts;