import React, { useState, useEffect, useContext } from "react";
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
import ActivitiesTable from "./components/ActivitiesTable";
import ActivitiesModal from "./components/ActivitiesModal";
import { AppContext } from "../../AppContext";

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
  onEventClick,
}) => {
  return (
    <div>
      <Calendar
        drilldownView="week"
        popup={true}
        localizer={localizer}
        events={events}
        endAccessor={"end"}
        startAccessor={"start"}
        view={view}
        defaultDate={new Date()}
        style={{ height: "calc(100vh - 64px - 80px)" }}
        step={60}
        onSelectEvent={(e) => onEventClick(e)}
        showMultiDayTimes
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
          event: (props) => <ActivitiesEvent {...props} />,
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
  const today = moment();
  const tomorrow = moment().add(1, "d");
  const nextWeekDay = moment().add(7, "d");

  switch (activityFilterByTime) {
    case "all":
      filterByTimeCondition = true;
      break;
    case "upcoming":
      filterByTimeCondition = moment(e.start).isSameOrAfter(today);
      break;
    case "overdue":
      filterByTimeCondition = moment(e.end).isBefore(today);
      break;
    case "open":
      filterByTimeCondition = !e.isClosed;
      break;
    case "closed":
      filterByTimeCondition = e.isClosed;
      break;
      // case "todo":
      //   filterByTimeCondition = moment(e.end).isSameOrAfter(today);
      //   break;
      // case "today":
      //   filterByTimeCondition = moment(e.end).isSame(today, "day");
      //   break;
      // case "tomorrow":
      //   filterByTimeCondition = moment(e.end).isSame(tomorrow, "day");
      //   break;
      // case "this-week":
      //   filterByTimeCondition = moment(e.end).isSame(today, "week");

      //   break;
      // case "next-week":
      //   filterByTimeCondition = moment(e.end).isSame(nextWeekDay, "week");

      break;
    default:
      filterByTimeCondition = true;
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

  const [stateApp, setStateApp] = useContext(AppContext);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activityDisplayType, setActivityDisplayType] = useState("calender");
  const [activityFilterByType, setActivityFilterByType] = useState("all");
  const [activityFilterByTime, setActivityFilterByTime] = useState("all");
  const [view, setView] = React.useState(Views.WEEK);

  useEffect(() => {
    getAllActivities();
  }, []);

  useEffect(() => {
    if (activitiesData) {
      setEvents(
        activitiesData?.activities?.map((act) => {
          const start = new Date(Number(act.dateTime));
          const end = act.endDateTime
            ? new Date(Number(act.endDateTime))
            : start;
          return {
            id: uniqueId(),
            ...act,
            start,
            end,
            title: act.fullname,
            notes: act.notes,
            ownerId: act.ownerId,
            type: act.type,
            name: act.name,
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
  }, [events, activityFilterByType, activityFilterByTime, view]);

  console.log("ACTIVITIES", activitiesData, events, filteredEvents);

  const onModalClose = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDialog: false,
    }));
  };

  const onModalOpen = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDialog: true,
    }));
  };

  const setSelectedActivity = (act) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      selectedActivity: act,
    }));
  };

  const onEventClick = (event) => {
    console.log("EVENT", event);
    setSelectedActivity(event);
    onModalOpen();
  };

  return (
    <div className={classes.root}>
      {activitiesLoading ? (
        <CircularProgress
          className={classes.progress}
          size={80}
          disableShrink
          color="secondary"
        />
      ) : (
        <>
          <ActivitiesAppBar
            activityDisplayType={activityDisplayType}
            setActivityDisplayType={setActivityDisplayType}
            onAddActivityClick={onModalOpen}
          />
          {activityDisplayType === "calender" ? (
            <ActivitiesCalendar
              activityFilterByType={activityFilterByType}
              setActivityFilterByType={setActivityFilterByType}
              activityFilterByTime={activityFilterByTime}
              setActivityFilterByTime={setActivityFilterByTime}
              view={view}
              setView={setView}
              events={filteredEvents}
              onEventClick={onEventClick}
            />
          ) : (
            <ActivitiesTable />
          )}
          <ActivitiesModal
            selectedActivity={stateApp.selectedActivity}
            events={events}
          />
        </>
      )}
    </div>
  );
};

export default Activities;
