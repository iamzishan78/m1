import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { uniqueId } from "lodash";

import { useLazyQuery } from "@apollo/client";
import { GETALLACTIVITIES } from "../../graphQL/useQueryGetAllActivities";
import ActivitiesToolbar from "./components/ActivitiesToolbar";
import ActivitiesEvent from "./components/ActivitiesEvent";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.css";
import ActivitiesAppBar from "./components/ActivitiesAppbar";

const localizer = momentLocalizer(moment);

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h * 60 * 60 * 1000);
  return this;
};

const ActivitiesCalendar = ({
  events,
  activityFilterByType,
  setActivityFilterByType,
  activityFilterByTime,
  setActivityFilterByTime,
  view,
  setView,
}) => {
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        defaultDate={new Date()}
        style={{ height: "calc(100vh - 64px - 32px)" }}
        step={60}
        components={{
          toolbar: (props) => (
            <ActivitiesToolbar
              {...props}
              activityFilterByType={activityFilterByType}
              setActivityFilterByType={setActivityFilterByType}
              activityFilterByTime={activityFilterByTime}
              setActivityFilterByTime={setActivityFilterByTime}
              view={view}
              setView={setView}
            />
          ),
          event: ActivitiesEvent,
        }}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  progress: {
    marginLeft: "30px",
    verticalAlign: "middle",
  },
  root: {},
}));

const getFilterCondition = (e, activityFilterByType, activityFilterByTime) => {
  const filterByTypeCondition =
    e.type === activityFilterByType || activityFilterByType === "all";
  let filterByTimeCondition;
  const today = new Date();
  const tommorow = new Date(today.getDate() + 1);
  const thisWeekEnd = new Date(today.getDate() + 7);
  const nextWeekStart = new Date(today.getDate() + 8);
  const nextWeekEnd = new Date(today.getDate() + 14);

  switch (activityFilterByTime) {
    case "todo":
      filterByTimeCondition = moment(e.end).isSameOrAfter(
        today.setHours(0, 0, 0, 0)
      );
      break;
    case "overdue":
      filterByTimeCondition = moment(e.end).isBefore(
        today.setHours(0, 0, 0, 0)
      );
      break;
    case "today":
      filterByTimeCondition = moment(e.end).isSame(
        today.setHours(0, 0, 0, 0),
        "day"
      );
      break;
    case "tommorow":
      filterByTimeCondition = moment(e.end).isSame(
        tommorow.setHours(0, 0, 0, 0),
        "day"
      );
    case "this-week":
      filterByTimeCondition = moment(e.end).isBetween(
        today.setHours(0, 0, 0, 0),
        thisWeekEnd.setHours(0, 0, 0, 0),
        "day"
      );
    case "next-week":
      filterByTimeCondition = moment(e.end).isBetween(
        nextWeekStart.setHours(0, 0, 0, 0),
        nextWeekEnd.setHours(0, 0, 0, 0),
        "day"
      );
      break;
    default:
      filterByTimeCondition = moment(e.end).isSameOrAfter(
        today.setHours(0, 0, 0, 0),
        "day"
      );
  }

  return filterByTypeCondition && filterByTimeCondition;
};

const Activities = () => {
  const classes = useStyles();

  const [
    getAllActivities,
    {
      data: activitiesData,
      loading: activitiesLoading,
      error: activitiesError,
    },
  ] = useLazyQuery(GETALLACTIVITIES);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activityDisplayType, setActivityDisplayType] = useState("calender");
  const [activityFilterByType, setActivityFilterByType] = useState("all");
  const [activityFilterByTime, setActivityFilterByTime] = useState("todo");
  const [view, setView] = React.useState(Views.WEEK);

  useEffect(() => {
    getAllActivities();
  }, []);

  useEffect(() => {
    if (activitiesData) {
      setEvents(
        activitiesData?.activities?.map((act) => {
          const start = new Date(act.dateTime);
          const end = act.endDateTime ? new Date(act.endDateTime) : start;
          return {
            id: uniqueId(),
            start,
            end,
            title: act.fullname,
            notes: act.notes,
            type: act.type,
          };
        })
      );
    }
  }, [activitiesData]);

  useEffect(() => {
    setFilteredEvents(
      events.filter((e) =>
        getFilterCondition(e, activityFilterByType, activityFilterByTime)
      )
    );
  }, [events, activityFilterByType, activityFilterByTime]);

  return (
    <div className={classes.root}>
      {activitiesLoading ? (
        <CircularProgress
          className={classes.progress}
          size={80}
          disableShrink
        />
      ) : (
        <>
          <ActivitiesAppBar
            activityDisplayType={activityDisplayType}
            setActivityDisplayType={setActivityDisplayType}
          />
          <ActivitiesCalendar
            activityFilterByType={activityFilterByType}
            setActivityFilterByType={setActivityFilterByType}
            activityFilterByTime={activityFilterByTime}
            setActivityFilterByTime={setActivityFilterByTime}
            view={view}
            setView={setView}
            events={filteredEvents}
          />
        </>
      )}
    </div>
  );
};

export default Activities;
