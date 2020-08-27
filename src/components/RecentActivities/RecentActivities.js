import React, { useState } from "react";
// import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import {
  MenuItem,
  Checkbox,
  Select,
  InputLabel,
  Grid,
  Button,
  FormControl,
  Typography,
} from "@material-ui/core";
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
    backgroundColor: "#ffffff",
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
}));

function ActivityStats() {
  const classes = useStyles();

  const getStatsMessage = (primary, secondary) => {
    return (
      <div className={classes.statsMessage}>
        <Typography
          variant="subtitle1"
          style={{ fontWeight: "bold", fontSize: "0.9rem" }}
        >
          {primary}
        </Typography>
        <Typography
          variant="body2"
          style={{ fontSize: "0.75rem" }}
          gutterBottom
        >
          {secondary}
        </Typography>
      </div>
    );
  };

  return (
    <div className={classes.activityStats}>
      <div className={classes.activityScore}>99</div>
      {getStatsMessage("Last contacted", "8 hours ago")}
      {getStatsMessage("Last modified", "3 months ago")}
    </div>
  );
}

function ActivitiesFilter({ activitiesFilter, setActivitiesFilter }) {
  const classes = useStyles();
  const [timePeriod, setTimePeriod] = useState("all");

  const handleChange = (e, type) => {
    if (activitiesFilter) {
      let newActivitiesFilter = [...activitiesFilter];
      if (e.target.checked) {
        newActivitiesFilter.push(type);
      } else {
        const filterIndex = newActivitiesFilter.findIndex(
          (act) => act === type
        );
        if (filterIndex !== -1) {
          newActivitiesFilter.splice(filterIndex, 1);
        }
      }
      setActivitiesFilter(newActivitiesFilter);
    }
  };

  const getCheckboxItem = (type) => {
    let name = "";
    switch (type) {
      case "general":
        name = "General Updates";
        break;
      case "phone":
        name = "Calls";
        break;
      case "email":
        name = "Emails";
        break;
      case "meeting":
        name = "Meetings";
        break;
      case "sms":
        name = "SMS";
        break;
      case "campaign":
        name = "Campaigns";
        break;
      default:
        name = "General Updates";
    }

    return (
      <Grid item xs={12} className={classes.checkBox}>
        <h4 style={{ color: "#9A9A9A", margin: 0 }}>{name}</h4>
        <Checkbox
          checked={activitiesFilter.includes(type)}
          onChange={(e) => handleChange(e, type)}
          color="secondary"
        />
      </Grid>
    );
  };

  return (
    <div className={classes.activitiesFilter}>
      <h4 style={{ margin: "0 0 8px 0" }}>Filter</h4>
      {/* <FormControl
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
          color="secondary"
        >
          <MenuItem value={"all"}>All Time Periods</MenuItem>
        </Select>
      </FormControl> */}

      <div className={classes.activityTypeCheckboxes}>
        <Grid item xs={12} style={{ minHeight: "35px" }}>
          <h4 style={{ margin: "0 0 20px 0", float: "left" }}>Activity Type</h4>

          <h4
            className={classes.textBtn}
            onClick={() => {
              setActivitiesFilter([]);
            }}
          >
            Clear
          </h4>
        </Grid>

        {getCheckboxItem("general")}
        {getCheckboxItem("meeting")}
        {getCheckboxItem("phone")}
        {getCheckboxItem("campaign")}
        {getCheckboxItem("sms")}
        {getCheckboxItem("email")}
      </div>
    </div>
  );
}

function ViewActivities({
  id,
  user_id,
  activityLog,
  updateActivity,
  addActivity,
}) {
  const classes = useStyles();
  const [activitiesFilter, setActivitiesFilter] = useState([
    "general",
    "meeting",
    "phone",
    "campaign",
    "sms",
    "email",
  ]);

  const filteredActivities = activityLog.filter((act) =>
    activitiesFilter.includes(act.type)
  );

  return (
    <div className={classes.viewAllCard}>
      <div className={classes.activitiesList}>
        <h4 style={{ margin: "0 0 8px 0" }}>Recent Activities</h4>
        <ActivitiesList
          id={id}
          user_id={user_id}
          activityLog={filteredActivities}
          updateActivity={updateActivity}
          viewAll={true}
        />
      </div>
      <div className={classes.activityCardRight}>
        <h4
          className={classes.viewAll}
          style={{ margin: "20px 10px 0 0" }}
          onClick={addActivity}
        >
          Add New
        </h4>
        <ActivityStats />
        <ActivitiesFilter
          activitiesFilter={activitiesFilter}
          setActivitiesFilter={setActivitiesFilter}
        />
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
                addActivity={addActivity}
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
        <Grid container spacing={3} style={{ flexWrap: "nowrap" }}>
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
