import React, { useState } from "react";
// import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import ActivitiesList from "./components/ActivitiesList";
import ActivitySummary from "./components/ActivitySummary";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  avatar: {
    marginRight: "20px",
  },
  moreIcon: {
    color: "lightgray",
  },
  viewAll: {
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
}));

export default ({
  header,
  // dataList,
  ...props
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid item xs={12} style={{ minHeight: "28px" }}>
        <h4 style={{ margin: "0 0 8px 0", float: "left" }}>
          Recent Activities
        </h4>
        <h4
          className={classes.viewAll}
          onClick={() => {
            props.handleOpenExpandableCard(
              "Pass your card content here",
              "Conversations"
            );
          }}
        >
          View All
        </h4>

        <h4
          className={classes.viewAll}
          style={{ marginRight: "10px" }}
          onClick={() => {
            props.handleOpenExpandableCard(
              "Pass your card content here",
              "Conversations"
            );
          }}
        >
          Add New
        </h4>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <ActivitiesList
              id={props.id}
              user_id={props.user_id}
              activityLog={props.activityLog}
            />
            {/* <Activities
          id={contactData._id}
          user_id={stateApp.user.email}
          activityLog={contactData.activityLog}
        /> */}
          </Grid>
          <Grid item xs={4}>
            <ActivitySummary />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
