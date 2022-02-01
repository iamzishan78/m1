import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { Grid, Typography, Button } from "@material-ui/core";
import { Add, ArrowDropDown } from "@material-ui/icons";


import RevenueSearch from "components/Navigation/components/RevenueSearch";
import { SIDE_PANEL_MENU_ITEMS_LIST } from "components/Revenue/Revenue";

export default function RevenueAppBar(props) {
  const { classes } = props;
  let history = useHistory();
  const { activeModule, actionsPanelState } = useSelector((state) => state.Revenue);

  return (
    <Grid
      container
      direction="row"
      display="flex"
      justify="space-between"
      alignItems="center"
      style={{ marginLeft: actionsPanelState ? "433px" : "7px" }}
    >
      <Grid item md={8}>
        <Grid container direction="row" display="flex" justify="flex-start" alignItems="center">
          <Grid item md={2.5}>
            <Typography variant="h5" style={{ color: "black", fontWeight: "bold" }}>
              {activeModule.title}
            </Typography>
          </Grid>
          {(
            activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.REVENUE_STATEMENTS.title ||
            activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.PROPERTIES.title
          ) && (
              <Grid item md={5} style={{ marginLeft: "20px" }}>
                <RevenueSearch activeModule={activeModule} />
              </Grid>
            )}
        </Grid>
      </Grid>
      {(activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.REVENUE_STATEMENTS.title) && (
          <Grid item>
            <div className={classes.filterTabs} style={{ paddingRight: "10px" }}>
              <Button color="primary" variant="contained" startIcon={<Add />} endIcon={<ArrowDropDown />}>
                Add {activeModule.title}
              </Button>
            </div>
          </Grid>
        )}
      {(activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.PROPERTIES.title) && (
          <Grid item>
            <div className={classes.filterTabs} style={{ paddingRight: "10px" }}>
              <Button color="primary" variant="contained" startIcon={<Add />} onClick={() => history.push('/revenue/property/details/add')}>
                Add New Property
              </Button>
            </div>
          </Grid>
        )}
    </Grid>
  );
}
