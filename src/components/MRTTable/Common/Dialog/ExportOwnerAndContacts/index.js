import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useApolloClient } from "@apollo/client";

import { useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";

import { execCommonAsyncExportJobAction } from "store/actions/commonActions";
import { globalStateController } from "hookstate/globalStateController";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "557px",
    padding: "10px 30px",
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

const ExportOwnerAndContacts = ({
  filters,
  esIndex,
  onClose,
  search,
  total,
  open,
  jobType,
  contactIdKey,
}) => {
  const classes = useStyles();
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
    if (exportContacts) {
      datasets.exportContacts = exportContacts;
      datasets.exportContactsPurchase = exportContacts;
    }

    if (exportInterestOwners) {
      datasets.exportShapeInterestOwner = exportInterestOwners;
    }

    dispatch(execCommonAsyncExportJobAction.STARTED({
      jobType: 'EXPORTCSV',
      client,
      setStateApp: window.setStateApp,
      userId: getUser?._id,
      requestPayload: {
        type: jobType,
        total,
        search,
        filters,
        esIndex,
        contactIdKey,
        datasets,
        counts: {
          exportContacts: total,
          exportContactsPurchase: total,
          exportShapeInterestOwner: total
        },
      }
    }));
    setTimeout(() => {
      onClose();
    }, 2000)
  };

  return (
    <Drawer anchor="right" open={open}>
      <div className={classes.root}>
        <div className={classes.title}>
          <h1>Export Data to CSV</h1>
          <div style={{ cursor: "pointer" }}>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <label className={classes.bold}>Available Data Elements</label>

        <div className={classes.field}>
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
              <label className={classes.bold}>Tract Ownership Interest</label>
            </div>
            <label className={classes.value}>{total} selected</label>
          </div>
        </div>

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
        <Box pt={6} mt={6} mb={6} mr={2}>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            <Grid item>
              <Button onClick={onClose}>Cancel</Button>
            </Grid>
            <Grid item>
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
            </Grid>
          </Grid>
        </Box>
      </div>
    </Drawer>
  );
};

export default ExportOwnerAndContacts;