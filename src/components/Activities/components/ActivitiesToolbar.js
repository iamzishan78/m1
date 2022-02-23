import React, { useContext } from "react";
import { Views } from "react-big-calendar";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AppContext } from "../../../AppContext";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewSwitcher: {
    height: 30,
    marginRight: 8,
  },
  filterByTypeDisplay: {
    border: "1px solid #d9d9d9",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
  },
  filterDisplay: {
    color: "#d9d9d9",
    display: "flex",
    alignItems: "center",
    padding: "2px 4px",
    border: "1px solid #fff",
    borderRadius: 3,
    cursor: "pointer",

    "& span": {
      marginLeft: 4,
    },
  },
  active: {
    backgroundColor: "#d0f1fc",
    color: "#15a9d7 !important",
  },
  right: {
    display: "flex",
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  marginLeft: {
    marginLeft: 8,
  },
  centerNav: {
    display: "flex",
    alignItems: "center",
  },
  filterToggleBtn: {
    borderRadius: 5,
    border: "1px solid #d9d9d9",
    color: "#333",
    transition: "200ms all",
    backgroundColor: "#f5f5f5",
  },
  activeBtn: {
    borderRadius: 5,
    border: "1px solid #1CB6DA",
    backgroundColor: "#1CB6DA",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1CB6DAdd",
    },
  },
}));

const activitiesTypesOptions = [
  { label: 'All', value: 'all' },
  { label: 'Call', value: 'call' },
  { label: 'Meeting', value: 'meeting' },
  { label: 'Task', value: 'task' },
  { label: 'Deadline', value: 'deadline' },
  { label: 'Email', value: 'email' },
  { label: 'Text Message', value: "text_message" },
  { label: 'Mailer', value: 'mailer' }
]

const ActivitiesToolbar = ({
  activityFilterByType,
  setActivityFilterByType,
  activityFilterByTime,
  setActivityFilterByTime,
  view,
  setView,
  ...toolbar
}) => {
  const classes = useToolbarStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };
  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };
  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
  };
  const goToNextWeek = () => {
    var today = new Date();
    toolbar.onNavigate(
      "DATE",
      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    );
  };
  const goToTomorrow = () => {
    var today = new Date();
    toolbar.onNavigate(
      "DATE",
      new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)
    );
  };

  const handleViewChange = (event) => {
    const view = event.target.value;
    setView(view);
    toolbar.onView(view);
  };

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <div className={classes.filterByTypeDisplay}>
          <Autocomplete
            id="combo-box-demo"
            options={activitiesTypesOptions}
            getOptionLabel={(option) => option.label}
            style={{ width: 250 }}
            size="small"
            defaultValue={activitiesTypesOptions.find(o => o.value === activityFilterByType)}
            value={activitiesTypesOptions.find(o => o.value === activityFilterByType)}
            onChange={(_, value) => {
              setActivityFilterByType(value?.value ?? 'all');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Activity Type"
                variant="outlined"
                value={activityFilterByType}
              />
            )}
          />
        </div>
      </div>
      {stateApp.activityDisplayType === "calendar" && (
        <div className={classes.centerNav}>
          <IconButton
            size="small"
            className={classes.marginLeft}
            onClick={() => goToBack()}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <p className={classes.marginLeft}>{toolbar.label}</p>
          <IconButton
            size="small"
            className={classes.marginLeft}
            onClick={() => goToNext()}
          >
            <NavigateNextIcon />
          </IconButton>
        </div>
      )}
      <div className={classes.right}>

        {stateApp.activityDisplayType === "calendar" ? (

          <Select
            className={classes.viewSwitcher}
            variant="outlined"
            value={view}
            onChange={handleViewChange}
          >
            <MenuItem value={Views.WEEK}>Week</MenuItem>
            <MenuItem value={Views.MONTH}>Month</MenuItem>
          </Select>

        ) : null}

        <div>
          <ButtonGroup>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${activityFilterByTime === "all" && classes.activeBtn
                }`}
              onClick={() => setActivityFilterByTime("all")}
            >
              All
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${activityFilterByTime === "upcoming" && classes.activeBtn
                }`}
              onClick={() => setActivityFilterByTime("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${activityFilterByTime === "overdue" && classes.activeBtn
                }`}
              onClick={() => setActivityFilterByTime("overdue")}
            >
              Overdue
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${activityFilterByTime === "open" && classes.activeBtn
                }`}
              onClick={() => setActivityFilterByTime("open")}
            >
              Open
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${activityFilterByTime === "closed" && classes.activeBtn
                }`}
              onClick={() => setActivityFilterByTime("closed")}
            >
              Closed
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesToolbar;
