import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ActivitiesList from "./components/ActivitiesList";
import ActivitySummary from "./components/ActivitySummary";
import RightDialog from "../ContactDetailCard/components/RightDialog";
import AddActivityDialog from "../ContactDetailCard/components/AddActivityDialog";
import {grey} from "@material-ui/core/colors";

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

  addNew: {
    margin: 0,
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  groupContent: {
    display: "flex",
  },
  grouptext: {
    display: "flex",
    float: "left",
  },

  viewAllCard: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    height: "84.5vh",
  },
  inputField: {
    marginBottom: "30px",
  },
  textBtn: {
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  label: {
    backgroundColor: "white",
  },
  activitiesList: {
    padding: "20px",
  },
  activitiesFilter: {
    padding: "20px 30px",
    backgroundColor: "rgb(240, 246, 248)",
    minWidth: "250px",
    height: "100%",
  },
  checkBox: {
    minHeight: "35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  activityCardRight: {
    display: "flex",
  },
  activityStats: {
    margin: "20px 30px",
    padding: "30px",
    height: "fit-content",
    backgroundColor: "#FAFAEB",
  },
  activityScore: {
    border: "5px solid #F5A724",
    borderRadius: "50%",
    padding: "25px",
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "5px",
  },
  statsMessage: {
    color: "#7B7B7B",
    textAlign: "center",
  },
  contact: {
    color: "grey",
    fontWeight: "normal",
    marginTop: "10px",

  }
}));

export default ({
  header,
  // dataList,
  ...props
}) => {
  const classes = useStyles();
  let history = useHistory();
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const updateActivity = (activity) => {
    setSelectedActivity(activity);
    setActivityModalOpen(true);
  };

  const addActivity = () => {
    setSelectedActivity(null);
    setActivityModalOpen(true);
  };
console.log(props);
  return (
    <div className={classes.root}>
      {/* <AddActivityModal
        open={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        id={props.id}
        activityLog={props.activityLog}
        selectedActivity={selectedActivity}
      /> */}
      <RightDialog
        open={activityModalOpen ? true : false}
        handleClickDialogClose={() => setActivityModalOpen(false)}
        width="450px"
      >
        <AddActivityDialog
          onClose={() => setActivityModalOpen(false)}
          id={props.id}
          contactData={props.contactData}
          selectedActivity={selectedActivity}
        />
      </RightDialog>
      <Grid item xs={12} style={{ minHeight: "28px" }}>
        <div className={classes.grouptext}>
          <h4 style={{ margin: "0px 12px 8px 0px" }}>Recent Activities</h4>
          <h4 className={classes.addNew} onClick={addActivity}>
            Add New
            {props.activityLog.length > 0 ? <h4 className={classes.contact}>contact created</h4>: null}
          </h4>

        </div>
        <h4
          className={classes.viewAll}
          onClick={() => {
            history.push(
              `/contact/details/${props.contactData._id}/recentActivites`
            );
          }}
        >
          View All
        </h4>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={3} style={{ flexWrap: "nowrap" }}>
          <Grid item xs={7}>
            <ActivitiesList
              id={props.id}
              user_id={props.user_id}
              activityLog={props.activityLog}
              updateActivity={updateActivity}
            />
          </Grid>
          <Grid item xs={6} style={{ minWidth: "fit-content" }}>
            <ActivitySummary activityLog={props.activityLog} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
