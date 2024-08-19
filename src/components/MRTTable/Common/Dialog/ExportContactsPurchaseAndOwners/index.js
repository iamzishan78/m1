import React from "react";
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

import { execCommonAsyncExportJobAction } from "store/actions/commonActions";
import { globalStateController } from "hookstate/globalStateController";

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

const ExportContactsAndPurchase = ({
  isAllRowsSelected,
  filters,
  esIndex,
  onClose,
  search,
  total,
  open,
  shapeType,
  sort,
  columns,
  contactIdKey,
}) => {
  const classes = useStyles();
  const modalClass = Modals();
  const { user } = globalStateController.useState(['user']);
  const getUser = user.get({ noproxy: true });
  const client = useApolloClient();
  const dispatch = useDispatch();
  const { control } = useForm();

  const exportContacts = useWatch({
    control,
    name: "exportContacts",
    defaultValue: false,
  });

  const exportInterestOwners = useWatch({
    control,
    name: "exportInterestOwners",
    defaultValue: false,
  });

  const exportDisabled = !exportContacts && !exportInterestOwners;

  const onExport = () => {
    let datasets = {}
    let counts = {}
    if (exportContacts) {
      datasets.exportContacts = true;
      datasets.exportContactsPurchase = true;
      counts.exportContacts = total;
      counts.exportContactsPurchase = total;
    }

    if (exportInterestOwners) {
      datasets.exportShapeInterestOwner = true;
      counts.exportShapeInterestOwner = total;
    }

    onClose();
    let sortOrder = {};

    if (Object.keys(sort).length > 0) {
      // Using column name as a field key beacause it has .keyword appended based on its type
      const column = columns?.find(col => col.accessorKey === sort?.field); // Safely find the column with matching accessorKey and sort field
      sortOrder = { field: column?.name || sort?.field, order: sort?.order };
    }

    dispatch(execCommonAsyncExportJobAction.STARTED({
      jobType: 'EXPORTCSV',
      client,
      setStateApp: window.setStateApp,
      userId: getUser?._id,
      requestPayload: {
        type: shapeType,
        total,
        search,
        filters,
        esIndex,
        sort: sortOrder,
        isSelectAll: isAllRowsSelected,
        contactIdKey,
        datasets,
        counts,
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

        {shapeType && <div className={classes.field}>
          <div className={classes.checkbox}>
            <div>
              <Controller
                control={control}
                name="exportInterestOwners"
                defaultValue={false}
                render={(props) => (
                  <Checkbox
                    {...props}
                    disabled={total === 0}
                    onChange={(e) => {
                      props.onChange(e.target.checked);
                    }}
                  />
                )}
              />
              <label className={classes.bold}>{`${shapeType} Ownership Interest`}</label>
            </div>
            <label className={classes.value}>{total} selected</label>
          </div>
        </div>}

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
                    disabled={total === 0}
                    onChange={(e) => {
                      props.onChange(e.target.checked);
                    }}
                    data-testid='export-contact-and-purchse-icon-checkbox'
                  />
                )}
              />
              <label className={classes.bold}>
                Contact Data (Basic & Purchased Info)
              </label>
            </div>
            <label className={classes.value}>{total} selected</label>
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
          data-testid="export-contact-and-purchse-confirm-button"
        >
          Export
        </Button>
      </DialogActions>
    </RightDialog>
  );
};

export default ExportContactsAndPurchase;