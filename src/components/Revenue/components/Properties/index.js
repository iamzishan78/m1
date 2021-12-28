import React, { useContext } from "react";
import { AppContext } from "AppContext";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import AnalyticsCards from "components/Revenue/components/Common/AnalyticsCards";
import CustomDates from "components/Revenue/components/Common/CustomDates";
import RevenuePropertiesTable from "components/Table/Revenue/RevenuePropertiesTable";

const useStyles = makeStyles((theme) => ({
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
    marginTop: "100px",
  },
  actionsGrid: {
    marginTop: "6px",
    "& .MuiButtonBase-root": {
      width: "149px",
      height: "35px",
      fontWeight: "bold",
    },
  },
  propertyTableContainer: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

const cards = [
  {
    heading: "Total Properties",
    points: "1,463",
  },
  {
    heading: "Active",
    points: "992",
  },
  {
    heading: "Inactive",
    points: "471",
  },
  {
    heading: "Unmapped",
    points: "17",
    type: "warning",
  },
];

export default function Portfolio() {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);

  return (
    <>
      <div className={classes.actionBar}>
        <Grid container direction="row" display="flex" justify="space-between" style={{ padding: "0px 36px" }}>
          <CustomDates />
          <Grid item xs={5} md={4}>
            <Grid container display="flex" justify="flex-end" direction="row" spacing={2} className={classes.actionsGrid}>
              <Grid item>
                <Button variant="contained" color="secondary">
                  Save View
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained">Filter</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <AnalyticsCards cards={cards} />
      <div className={classes.propertyTableContainer}>
        <RevenuePropertiesTable
          header="Properties"
          parent="RevenuePropertiesTable"
          targetLabel="property"
          loading={false}
          dense={true}
          revenueSearchQuery={stateApp.revenueSearchQuery}
        />
      </div>
    </>
  );
}
