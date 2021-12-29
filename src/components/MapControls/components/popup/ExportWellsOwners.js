import React, { useEffect, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
import { getMapFilters, jsonToCSV } from "utils/helper";
import { NavigationContext } from "components/Navigation/NavigationContext";

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
  checkbox: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const ExportWellsOwners = ({
  getMapFilterShapeOwnersAndWellsAction,
  getShapeOwnersAndWellsAction,
  shapeOwners,
  shapeCount,
  wellsCount,
  fetching,
  onClose,
  wells,
  open,
}) => {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const [stateNav] = useContext(NavigationContext);

  const { currentFeature, user } = stateApp;
  const { control, watch } = useForm();
  const [includeFilter, setIncludeFilter] = useState(false);

  const exportWells = watch("exportWells", false);
  const exportOwners = watch("exportOwners", false);

  useEffect(() => {
    if (!includeFilter) {
      getShapeOwnersAndWellsAction({
        currentFeature: currentFeature,
        userId: user.mongoId,
      });
    }
    // eslint-disable-next-line
  }, [includeFilter]);

  useEffect(() => {
    if (includeFilter) {
      const { filters, search } = getMapFilters(stateNav, "", "");
      getMapFilterShapeOwnersAndWellsAction({
        currentFeature: currentFeature,
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
    stateApp.gridPolygonString,
    stateNav.completetionDateFrom,
    stateNav.completetionDateTo,
    stateNav.firstProdDateFrom,
    stateNav.firstProdDateTo,
  ]);

  const onExport = () => {
    if (exportWells) {
      const csvWells = jsonToCSV(wells);
      const hiddenElement = document.createElement("a");
      hiddenElement.href = "data:attachment/text," + encodeURIComponent(csvWells);
      hiddenElement.target = "_blank";
      hiddenElement.download = "wells.csv";
      hiddenElement.click();
    }
    if (exportOwners) {
      const owners = jsonToCSV(shapeOwners.map(owner => owner.node));
      const hiddenElement = document.createElement("a");
      hiddenElement.href = "data:attachment/text," + encodeURIComponent(owners);
      hiddenElement.target = "_blank";
      hiddenElement.download = "taxOwners.csv";
      hiddenElement.click();
    }
    onClose()
  };

  return (
    <Drawer anchor="right" open={open}>
      <div className={classes.root}>
        <div className={classes.title}>
          <h3>Export Data to CSV</h3>
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
            <label className={classes.bold}>{wellsCount} selected</label>
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
              <label className={classes.bold}>Tax Owners</label>
            </div>
            <label className={classes.bold}>{shapeCount} selected</label>
          </div>
        </div>

        <div className={classes.title}>
          <h4>Include map filters</h4>
          <div>
            <Switch
              checked={includeFilter}
              onChange={() => setIncludeFilter(!includeFilter)}
              name="includeFilter"
            />
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
                style={{ backgroundColor: "#00abed", color: "white" }}
                onClick={onExport}
              >
                {fetching? <CircularProgress size={14} /> :'Export'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Drawer>
  );
};

export default ExportWellsOwners;
