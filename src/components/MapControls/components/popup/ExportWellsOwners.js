import React, { useEffect, useContext, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";

import { AppContext } from "AppContext";
import { getMapFilters, jsonToCSV, wellsToCSV } from "utils/helper";
import { NavigationContext } from "components/Navigation/NavigationContext";

import { useApolloClient } from "@apollo/client";
import { drawController } from "hookstate/drawStateController";

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

const ExportWellsOwners = ({
  getMapFilterShapeOwnersAndWellsAction,
  getShapeOwnersAndWellsAction,
  execAsyncExportJobAction,
  shapeOwnersInterest,
  shapeInterestCount,
  shapeOwners,
  shapeCount,
  wellsCount,
  fetching,
  onClose,
  wells,
  open,
}) => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav] = useContext(NavigationContext);
  const client = useApolloClient();

  const { selectedPolygonString } = drawController.useState(['selectedPolygonString'], 'drawStateValues');

  const { user } = stateApp;
  const { control } = useForm();
  const [includeFilter, setIncludeFilter] = useState(true);

  const exportWells = useWatch({ control, name: "exportWells", defaultValue: false });
  const exportOwners = useWatch({ control, name: "exportOwners", defaultValue: false });
  const exportOwnersInterest = useWatch({ control, name: "exportOwnersInterest", defaultValue: false });

  const exportDisabled = fetching || (!exportWells && !exportOwners && !exportOwnersInterest);

  useEffect(() => {
    if (!includeFilter) {
      getShapeOwnersAndWellsAction({
        client,
        currentFeature: drawController.getValue('currentFeature'),
        userId: user.mongoId,
      });
    }
    // eslint-disable-next-line
  }, [includeFilter]);

  useEffect(() => {
    if (includeFilter) {
      const { filters, search } = getMapFilters(stateNav, "", "");
      getMapFilterShapeOwnersAndWellsAction({
        client,
        currentFeature: drawController.getValue('currentFeature'),
        userId: user.mongoId,
        filters,
        search,
      });
    }
    // eslint-disable-next-line
  }, [
    includeFilter,
    stateNav.operatorName,
    stateNav.typeName,
    stateNav.profileName,
    stateNav.statusName,
    stateNav.statusName,
    stateNav.spudDateFrom,
    stateNav.spudDateTo,
    stateNav.permitDateFrom,
    stateNav.permitDateTo,
    stateNav.completetionDateFrom,
    stateNav.completetionDateTo,
    stateNav.firstProdDateFrom,
    stateNav.firstProdDateTo,
    selectedPolygonString,
  ]);

  const onExport = () => {
    // to make sure export is done once
    onClose();

    const { filters, search } = getMapFilters(stateNav, "", "");
    execAsyncExportJobAction({
      client,
      currentFeature: drawController.getValue('currentFeature'),
      filters,
      search,
      userId: user.mongoId,
      exportWells: !!exportWells,
      exportOwners: !!exportOwners,
      exportOwnersInterest: !!exportOwnersInterest,
      setStateApp,
    });

    // if (exportWells) {
    //   const csvWells = wellsToCSV(wells);
    //   const hiddenElement = document.createElement("a");
    //   hiddenElement.href = "data:attachment/text," + encodeURIComponent(csvWells);
    //   hiddenElement.target = "_blank";
    //   hiddenElement.download = "wells.csv";
    //   hiddenElement.click();
    // }
    // if (exportOwners) {
    //   const owners = jsonToCSV(shapeOwners.map(owner => owner.node));
    //   const hiddenElement = document.createElement("a");
    //   hiddenElement.href = "data:attachment/text," + encodeURIComponent(owners);
    //   hiddenElement.target = "_blank";
    //   hiddenElement.download = "taxOwners.csv";
    //   hiddenElement.click();
    // }
    // if (exportOwnersInterest) {
    //   const owners = jsonToCSV(shapeOwnersInterest.map(owner => owner.node));
    //   const hiddenElement = document.createElement("a");
    //   hiddenElement.href = "data:attachment/text," + encodeURIComponent(owners);
    //   hiddenElement.target = "_blank";
    //   hiddenElement.download = "taxOwnersInterest.csv";
    //   hiddenElement.click();
    // }
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
                name="exportWells"
                defaultValue={false}
                render={(props) => (
                  <Checkbox
                    {...props}
                    disabled={wellsCount === 0}
                    onChange={(e) => {
                      props.onChange(e.target.checked);
                    }}
                  />
                )}
              />
              <label className={classes.bold}>Wells</label>
            </div>
            <label className={classes.value}>{wellsCount} selected</label>
          </div>
        </div>

        <div className={classes.field}>
          <div className={classes.checkbox}>
            <div>
              <Controller
                control={control}
                name="exportOwners"
                defaultValue={false}
                render={(props) => (
                  <Checkbox
                    {...props}
                    disabled={shapeCount === 0}
                    onChange={(e) => {
                      props.onChange(e.target.checked);
                    }}
                  />
                )}
              />
              <label className={classes.bold}>Tax Owners (unique list of owners)</label>
            </div>
            <label className={classes.value}>{shapeCount} selected</label>
          </div>
        </div>
        <div className={classes.field}>
          <div className={classes.checkbox}>
            <div>
              <Controller
                control={control}
                name="exportOwnersInterest"
                defaultValue={false}
                render={(props) => (
                  <Checkbox
                    {...props}
                    disabled={shapeCount === 0}
                    onChange={(e) => {
                      props.onChange(e.target.checked);
                    }}
                  />
                )}
              />
              <label className={classes.bold}>Tax Owners Interests(includes well interests)</label>
            </div>
            <label className={classes.value}>{shapeInterestCount} selected</label>
          </div>
        </div>
        <div className={classes.title}>
          <h4>Include map filters</h4>
          <div>
            <Switch checked={includeFilter} onChange={() => setIncludeFilter(!includeFilter)} name="includeFilter" />
          </div>
        </div>
        <Box pt={6} mt={6} mb={6} mr={2}>
          <Grid container direction="row" justify="flex-end" alignItems="flex-end">
            <Grid item>
              <Button onClick={onClose}>Cancel</Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                component="span"
                style={{
                  backgroundColor: exportDisabled ? "#D3D3D3" : "#00abed",
                  color: exportDisabled ? "#999999" : "white"
                }}
                onClick={onExport}
                disabled={exportDisabled}
              >
                {fetching ? <CircularProgress size={14} /> : "Export"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Drawer>
  );
};

export default ExportWellsOwners;
