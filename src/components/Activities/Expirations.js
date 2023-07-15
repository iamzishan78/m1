import React, { useState, useEffect, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { uniqueId } from "lodash";
import { useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { GETALLACTIVITIES } from "../../graphQL/useQueryGetAllActivities";
import { GETMONGOUSERS } from "graphQL/useQueryGetUsers";
import ActivitiesToolbar from "./components/ActivitiesToolbar";
import ActivitiesEvent from "./components/ActivitiesEvent";
import M1nTable from "../Shared/M1nTable/M1nTable";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.css";
import ActivitiesAppBar from "./components/ActivitiesAppbar";
import ActivitiesModal from "./components/ActivitiesModal";
import { AppContext } from "../../AppContext";

const localizer = momentLocalizer(moment);

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h * 60 * 60 * 1000);
  return this;
};

const ActivitiesCalendar = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div>
      <Calendar
        drilldownView="month"
        popup={true}
        localizer={localizer}
        events={props.events}
        endAccessor={"end"}
        startAccessor={"start"}
        view={props.view}
        date={selectedDate || new Date()}
        style={{ height: "calc(100vh - 67px)", position: "relative" }}
        step={60}
        onSelectEvent={(e) => props.onEventClick(e)}
        showMultiDayTimes
        components={{
          toolbar: (params) => <ActivitiesToolbar selectedDate={selectedDate} setSelectedDate={setSelectedDate} {...params} {...props} />,
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
  root: {
    marginTop: "65px",
  },
  table: {
    borderTop: "solid 1px#E0E0E0",
    maxHeight: "calc(100vh - 147px) !important",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "0.75em",
      height: "0.75em",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#929292",
      borderRadius: 10,
    },
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": { minHeight: "calc(100vh - 265px) !important" },
      },
    },
  },
}));

const getFilterCondition = (e, activityFilterByType, activityFilterByTime, activityFilterByOwner) => {
  const filterByTypeCondition = e.type === activityFilterByType || activityFilterByType === "all";
  const filterByOwnerCondition = e.ownerId === activityFilterByOwner || activityFilterByOwner === "all";
  let filterByTimeCondition;
  const today = new Date();
  // const tomorrow = moment().add(1, "d");
  // const nextWeekDay = moment().add(7, "d");

  switch (activityFilterByTime) {
    case "all":
      filterByTimeCondition = true;
      break;
    case "upcoming":
      filterByTimeCondition = moment(e.start).isSameOrAfter(today, "day");
      break;
    case "overdue":
      filterByTimeCondition = moment(e.end).isBefore(today, "day");
      break;
    case "open":
      filterByTimeCondition = !e.isClosed;
      break;
    case "closed":
      filterByTimeCondition = e.isClosed;
      break;
    default:
      filterByTimeCondition = true;
  }

  return filterByTypeCondition && filterByTimeCondition && filterByOwnerCondition;
};

const Activities = () => {
  const classes = useStyles();
  let history = useHistory();
  const [getAllActivities, { data: activitiesData, loading: activitiesLoading }] = useLazyQuery(GETALLACTIVITIES, {
    fetchPolicy: `network-only`,
  });
  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: `network-only`,
  });

  const [stateApp, setStateApp] = useContext(AppContext);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activityFilterByType, setActivityFilterByType] = useState("all");
  const [activityFilterByOwner, setActivityFilterByOwner] = useState("all");
  const [activityFilterByTime, setActivityFilterByTime] = useState("all");
  const [view, setView] = React.useState(Views.MONTH);

  useEffect(() => {
    getAllActivities({
      variables: {
        category: "Expiration",
      },
    });
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const eventId = history.location.pathname.split("/")[3];
      if (eventId) {
        setSelectedActivityId(eventId);
        onModalOpen();
      }
    }
  }, [events]);

  useEffect(() => {
    if (activitiesData) {
      setEvents(
        activitiesData?.activities?.map((act) => {
          const start = new Date(act.dateTime);
          const end = act.endDateTime ? new Date(act.endDateTime) : start;
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
            // isContact: act.contactId,
          };
        })
      );
    }
  }, [activitiesData]);

  useEffect(() => {
    setFilteredEvents(events.filter((e) => getFilterCondition(e, activityFilterByType, activityFilterByTime, activityFilterByOwner)));
  }, [events, activityFilterByType, activityFilterByTime, activityFilterByOwner, view]);

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

  const setSelectedActivityId = (id) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      selectedActivityId: id,
    }));
  };

  useEffect(() => {
    if (stateApp.selectedActivityId) {
      setStateApp(() => ({ ...stateApp, selectedActivity: events.find((act) => act._id === stateApp.selectedActivityId) }));
    } else {
      setStateApp(() => ({ ...stateApp, selectedActivity: null }))
    }
  }, [stateApp.selectedActivityId]);

  React.useEffect(() => {
    getAllMongoUsers();
  }, []);

  const onEventClick = (event) => {
    window.history.pushState("", "", `/calendar/activities/${event._id}`);
    setSelectedActivityId(event._id);
    onModalOpen();
  };

  return (
    <div className={classes.root}>
      {activitiesLoading ? (
        <CircularProgress className={classes.progress} size={80} disableShrink color="secondary" />
      ) : (
        <>
          <ActivitiesAppBar onAddActivityClick={onModalOpen} />
          {stateApp.activityDisplayType === "calendar" ? (
            <ActivitiesCalendar
              activityFilterByType={activityFilterByType}
              setActivityFilterByType={setActivityFilterByType}
              activityFilterByTime={activityFilterByTime}
              setActivityFilterByTime={setActivityFilterByTime}
              activityFilterByOwner={activityFilterByOwner}
              setActivityFilterByOwner={setActivityFilterByOwner}
              view={view}
              setView={setView}
              events={filteredEvents}
              onEventClick={onEventClick}
              mongoUsers={userLists?.allMongoUsers}
              type="Expirations"
            />
          ) : (
            <div>
              <div
                style={{
                  padding: "8px 0",
                }}
              >
                <ActivitiesToolbar
                  activityFilterByType={activityFilterByType}
                  setActivityFilterByType={setActivityFilterByType}
                  activityFilterByTime={activityFilterByTime}
                  setActivityFilterByTime={setActivityFilterByTime}
                  activityFilterByOwner={activityFilterByOwner}
                  setActivityFilterByOwner={setActivityFilterByOwner}
                  view={view}
                  setView={setView}
                  events={filteredEvents}
                  onEventClick={onEventClick}
                  mongoUsers={userLists?.allMongoUsers}
                  type="Expiration"
                />
              </div>
              <div className={classes.table}>
                <M1nTable dense activities={filteredEvents} parent="Activities" />
              </div>
            </div>
          )}
          <ActivitiesModal setSelectedActivityId={setSelectedActivityId} events={events} />
        </>
      )}
    </div>
  );
};

export default Activities;
