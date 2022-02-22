import React, { useEffect, useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";

import CustomDates from "components/Revenue/components/Common/CustomDates";

const useStyles = makeStyles((theme) => ({
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
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
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: "38px",
    paddingRight: "38px",
    marginTop: theme.spacing(2),
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
}));

const ActivitiesDashboardFilter = ({
  setFilterToggle,
  filterToggle,
  setAppliedFilters,
  lastCheckMinDate,
}) => {
  const classes = useStyles();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    setFromDate(`${moment(lastCheckMinDate).startOf("month").format("yyyy-MM-DD")}`)
  },[lastCheckMinDate])

  return (
    <div className={classes.actionBar}>
      <Grid
        container
        direction="row"
        display="flex"
        justify="space-between"
        style={{ padding: "0px 36px 0px 45px" }}
      >
        <Grid item xs={8} md={8} lg={9} xl={8} style={{ marginTop: "4px" }}>
          <CustomDates
            isProperties
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            lastCheckMinDate={lastCheckMinDate}
          />
        </Grid>
        <Grid item xs={3} md={3} lg={3} xl={4}>
          <Grid
            container
            display="flex"
            justify="flex-end"
            direction="row"
            spacing={2}
            className={classes.actionsGrid}
          >
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setAppliedFilters({fromDate, toDate})
                  setFilterToggle(!filterToggle)
                }}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ActivitiesDashboardFilter;
