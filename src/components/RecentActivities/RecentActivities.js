import React, { useState } from "react";
// import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import ActivitiesList from "./components/ActivitiesList";
import ActivitySummary from "./components/ActivitySummary";
import RightDialog from "../ContactDetailCard/components/RightDialog";
import AddActivityDialog from "../ContactDetailCard/components/AddActivityDialog";

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
  viewAllCard: {
    display: "flex",
    justifyContent: "space-between",
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
    padding: "20px",
    borderLeft: "1px solid #9A9A9A",
    minWidth: "250px",
  },
  checkBox: {
    minHeight: "35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
}));

function ViewActivities({ id, user_id, activityLog, updateActivity }) {
  const classes = useStyles();
  const [timePeriod, setTimePeriod] = useState("");

  return (
    <div className={classes.viewAllCard}>
      <div className={classes.activitiesList}>
        <h4 style={{ margin: "0 0 8px 0" }}>Recent Activities</h4>
        <ActivitiesList
          id={id}
          user_id={user_id}
          activityLog={activityLog}
          updateActivity={updateActivity}
          viewAll={true}
        />
      </div>
      <div className={classes.activitiesFilter}>
        <h4 style={{ margin: "0 0 8px 0" }}>Filter</h4>
        <FormControl
          variant="outlined"
          fullWidth
          className={classes.inputField}
          size="small"
        >
          <InputLabel
            id="demo-simple-select-outlined-label"
            className={classes.label}
          >
            Showing activities for
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={timePeriod}
            onChange={(e) => {
              setTimePeriod(e.target.value);
            }}
            fullWidth
            label="Showing activities for"
          >
            <MenuItem value={"all"}>All Time Periods</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.activityTypeCheckboxes}>
          <Grid item xs={12} style={{ minHeight: "35px" }}>
            <h4 style={{ margin: "0 0 20px 0", float: "left" }}>
              Activity Type
            </h4>

            <h4 className={classes.textBtn} onClick={() => {}}>
              Clear
            </h4>
          </Grid>

          <Grid item xs={12} className={classes.checkBox}>
            <h4 style={{ color: "#9A9A9A", margin: 0 }}>General Updates</h4>
            <Checkbox defaultChecked color="primary" />
          </Grid>

          <Grid item xs={12} className={classes.checkBox}>
            <h4 style={{ color: "#9A9A9A", margin: 0 }}>Meetings</h4>
            <Checkbox defaultChecked color="primary" />
          </Grid>

          <Grid item xs={12} className={classes.checkBox}>
            <h4 style={{ color: "#9A9A9A", margin: 0 }}>Calls</h4>
            <Checkbox defaultChecked color="primary" />
          </Grid>

          <Grid item xs={12} className={classes.checkBox}>
            <h4 style={{ color: "#9A9A9A", margin: 0 }}>Campaigns</h4>
            <Checkbox defaultChecked color="primary" />
          </Grid>

          <Grid item xs={12} className={classes.checkBox}>
            <h4 style={{ color: "#9A9A9A" }}>SMS</h4>
            <Checkbox defaultChecked color="primary" />
          </Grid>

          <Grid item xs={12} className={classes.checkBox}>
            <h4 style={{ color: "#9A9A9A" }}>Emails</h4>
            <Checkbox defaultChecked color="primary" />
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default ({
  header,
  // dataList,
  ...props
}) => {
  const classes = useStyles();
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
          activityLog={props.activityLog}
          selectedActivity={selectedActivity}
        />
      </RightDialog>
      <Grid item xs={12} style={{ minHeight: "28px" }}>
        <h4 style={{ margin: "0 0 8px 0", float: "left" }}>
          Recent Activities
        </h4>
        <h4
          className={classes.viewAll}
          onClick={() => {
            props.handleOpenExpandableCard(
              <ViewActivities
                id={props.id}
                user_id={props.user_id}
                activityLog={props.activityLog}
                updateActivity={updateActivity}
              />,
              "Activities"
            );
          }}
        >
          View All
        </h4>

        <h4
          className={classes.viewAll}
          style={{ marginRight: "10px" }}
          onClick={addActivity}
        >
          Add New
        </h4>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2} style={{ flexWrap: "nowrap" }}>
          <Grid item xs={7}>
            <ActivitiesList
              id={props.id}
              user_id={props.user_id}
              activityLog={props.activityLog}
              updateActivity={updateActivity}
            />
          </Grid>
          <Grid item xs={4} style={{ minWidth: "fit-content" }}>
            <ActivitySummary activityLog={props.activityLog} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
