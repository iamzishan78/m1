import React, { useContext } from "react";
import { Views, Navigate } from "react-big-calendar";
import moment from "moment";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import CallIcon from "@material-ui/icons/Call";
import MeetingIcon from "@material-ui/icons/Group";
import TaskIcon from "@material-ui/icons/WatchLater";
import DeadlineIcon from "@material-ui/icons/Flag";
import EmailIcon from "@material-ui/icons/Email";
import DefaultIcon from "@material-ui/icons/Event";
import ContactMailIcon from "@material-ui/icons/ContactMail";
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

  console.log(toolbar);

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <div className={classes.filterByTypeDisplay}>
          <span
            style={{
              color: activityFilterByType === "all" ? "#15a9d7" : "#d9d9d9",
              padding: "2px 8px",
              cursor: "pointer",
            }}
            onClick={() => setActivityFilterByType("all")}
          >
            All
          </span>
          <span
            className={clsx(
              classes.filterDisplay,
              (activityFilterByType === "all" ||
                activityFilterByType === "call") &&
                classes.active
            )}
            onClick={() => setActivityFilterByType("call")}
          >
            <CallIcon /> <span>Call</span>
          </span>
          <span
            className={clsx(
              classes.filterDisplay,

              (activityFilterByType === "all" ||
                activityFilterByType === "meeting") &&
                classes.active
            )}
            onClick={() => setActivityFilterByType("meeting")}
          >
            <MeetingIcon /> <span>Meeting</span>
          </span>
          <span
            className={clsx(
              classes.filterDisplay,
              (activityFilterByType === "all" ||
                activityFilterByType === "task") &&
                classes.active
            )}
            onClick={() => setActivityFilterByType("task")}
          >
            <TaskIcon /> <span>Task</span>
          </span>
          <span
            className={clsx(
              classes.filterDisplay,
              (activityFilterByType === "all" ||
                activityFilterByType === "deadline") &&
                classes.active
            )}
            onClick={() => setActivityFilterByType("deadline")}
          >
            <DeadlineIcon /> <span>Deadline</span>
          </span>
          <span
            className={clsx(
              classes.filterDisplay,
              (activityFilterByType === "all" ||
                activityFilterByType === "email") &&
                classes.active
            )}
            onClick={() => setActivityFilterByType("email")}
          >
            <EmailIcon /> <span>Email</span>
          </span>
          <span
            className={clsx(
              classes.filterDisplay,
              (activityFilterByType === "all" ||
                activityFilterByType === "mailer") &&
                classes.active
            )}
            onClick={() => setActivityFilterByType("mailer")}
          >
            <ContactMailIcon /> <span>Mailer Campaign</span>
          </span>
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
        <Select
          className={classes.viewSwitcher}
          variant="outlined"
          value={view}
          onChange={handleViewChange}
        >
          <MenuItem value={Views.WEEK}>Week</MenuItem>
          <MenuItem value={Views.MONTH}>Month</MenuItem>
        </Select>
        <div>
          <ButtonGroup>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "all" && classes.activeBtn
              }`}
              onClick={() => setActivityFilterByTime("all")}
            >
              All
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "upcoming" && classes.activeBtn
              }`}
              onClick={() => setActivityFilterByTime("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "overdue" && classes.activeBtn
              }`}
              onClick={() => setActivityFilterByTime("overdue")}
            >
              Overdue
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "open" && classes.activeBtn
              }`}
              onClick={() => setActivityFilterByTime("open")}
            >
              Open
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "closed" && classes.activeBtn
              }`}
              onClick={() => setActivityFilterByTime("closed")}
            >
              Closed
            </Button>
            {/* <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "todo" && classes.activeBtn
              }`}
              onClick={() => setActivityFilterByTime("todo")}
            >
              To-do
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "overdue" && classes.activeBtn
              }`}
              onClick={() => setActivityFilterByTime("overdue")}
            >
              Overdue
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "today" && classes.activeBtn
              }`}
              onClick={() => {
                setActivityFilterByTime("today");
                goToCurrent();
              }}
            >
              Today
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "tomorrow" && classes.activeBtn
              }`}
              onClick={() => {
                setActivityFilterByTime("tomorrow");
                goToTomorrow();
              }}
            >
              Tomorrow
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "this-week" && classes.activeBtn
              }`}
              onClick={() => {
                setActivityFilterByTime("this-week");
                goToCurrent();
              }}
            >
              This week
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "next-week" && classes.activeBtn
              }`}
              onClick={() => {
                setActivityFilterByTime("next-week");
                goToNextWeek();
              }}
            >
              Next week
            </Button> */}
            {/* <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilterByTime === "custom" && classes.activeBtn
              }`}
              onClick={() => setActivityFilterByTime("custom")}
            >
              Custom
            </Button> */}
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesToolbar;
