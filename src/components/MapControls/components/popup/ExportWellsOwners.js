import React, { useEffect, useContext, useState } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

import { AppContext } from "AppContext";
import CloseIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";

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
}));


const ExportWellsOwners = ({
  getShapeOwnersAndCountAction,
  onClose,
  open,
}) => {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const { currentFeature, user } = stateApp;
  const [includeFilter, setIncludeFilter] = useState(false);


  useEffect(() => {
    getShapeOwnersAndCountAction({
      currentFeature: currentFeature,
      userId: user.mongoId,
    });
    // eslint-disable-next-line
  }, []);

  const onConvert = () => {};

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
                onClick={onConvert}
              >
                Convert
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Drawer>
  );
};

export default ExportWellsOwners;
