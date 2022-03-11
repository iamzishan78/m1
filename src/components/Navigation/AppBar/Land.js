import React from "react";
import { useSelector } from "react-redux";

import { Grid, Typography } from "@material-ui/core";
import { SIDE_PANEL_MENU_ITEMS_LIST } from "components/Land/index";
import LandSearch from "components/Navigation/components/LandSearch";

export default function LandAppBar(props) {

  const { activeModule, quickActionsPanelState } = useSelector(({ common }) => common);

  return (
    <Grid
      container
      direction="row"
      display="flex"
      justify="space-between"
      alignItems="center"
      style={{ marginLeft: quickActionsPanelState ? "433px" : "7px" }}
    >
      <Grid item md={8}>
        <Grid container direction="row" display="flex" justify="flex-start" alignItems="center">
          <Grid item md={2.5}>
            <Typography variant="h5" style={{ color: "black", fontWeight: "bold" }}>
              {activeModule.title}
            </Typography>
          </Grid>

          {(
            activeModule.title !== SIDE_PANEL_MENU_ITEMS_LIST.REPORTING_GROUPS.title
          ) && (
              <Grid item md={5} style={{ marginLeft: "20px" }}>
                <LandSearch activeModule={activeModule} />
              </Grid>
            )}
        </Grid>
      </Grid>
    </Grid>
  );
}
