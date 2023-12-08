import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";

import ActivitiesFilters from "./ActivitiesFilters";

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
  esIndex,
  searchFields,
  setFilterToggle,
  filterToggle,
  setAppliedFilters,
  tableFilters,
  appliedFilters,
  minDate,
}) => {
  const classes = useStyles();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [qualifier, setQualifier] = useState("");

  useEffect(() => {
    setFromDate(`${moment(minDate).startOf("month").format("yyyy-MM-DD")}`);
  }, [minDate]);
  useEffect(()=>{
    console.log("fromDate++++++++++++++++++++++++++++++++++++++",fromDate);
    if(fromDate=="Invalid date"||toDate=="Invalid date")return
    setAppliedFilters({ fromDate, toDate, campaignName, qualifier });
    setFilterToggle(prev=>!prev);
  },[fromDate, toDate, campaignName, qualifier])
  return (
    <div className={classes.actionBar}>
      <Grid
        container
        direction="row"
        display="flex"
        justify="space-between"
        style={{ padding: "0px 36px 0px 45px" }}
      >
        <Grid item xs={12} md={12} lg={12} xl={12} style={{ marginTop: "4px" }}>
          <ActivitiesFilters
            isActivity
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            minDate={minDate}
            campaignName={campaignName}
            setCampaignName={setCampaignName}
            qualifier={qualifier}
            setQualifier={setQualifier}
            esIndex={esIndex}
            searchFields={searchFields}
            tableFilters={tableFilters}
            appliedFilters={appliedFilters}
            setFilterToggle={setFilterToggle}
            filterToggle={filterToggle}
            setAppliedFilters={setAppliedFilters}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ActivitiesDashboardFilter;
