import React, { useState, useEffect, useContext } from "react";
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
import ActivitiesAppBar from "./components/ActivitiesAppbar";
import { AppContext } from "../../AppContext";
import ActivitiesSlideout from "./components/ActivitiesSlideout";
import { slidoutStateController } from "hookstate/slidoutStateController";
import { GET_CONTACTS_FOR_ACTIVITY } from "graphQL/useQueryGetContactsForActivity";
import { useHookstate } from "@hookstate/core";
import MRTTable from "components/MRTTable";
import { tableController } from "hookstate/tableController";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.css";
import { slidoutState } from "hookstate/initialStates";


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
        date={selectedDate}
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
    marginTop: "54px",
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
  },
}));

const getFilterCondition = (e, activityFilterByType, activityFilterByTime, activityFilterByOwner) => {
  const filterByTypeCondition = e.type === activityFilterByType || activityFilterByType === "all";
  const filterByOwnerCondition = e.ownerId === activityFilterByOwner || activityFilterByOwner === "all";
  let filterByTimeCondition;
  const today = new Date();

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

  const esIndex = "activities_flat";
  const searchFields = ["name", "_all"];
  const [activityId, setActivityId] = useState(""); // title change from contact.name to dealName
  const [filterToggle, setFilterToggle] = useState(false);
  const entityLoading = useHookstate(slidoutState.isLoading);
  const [appliedFilters, setAppliedFilters] = useState({
    toDate: null,
    fromDate: null,
  });
  const [tableFilters, setTableFilters] = useState([]);

  const filtersChange = (filters) => {
    setTableFilters(filters);
  };

  let history = useHistory();
  const [getAllActivities, { data: activitiesData, loading: activitiesLoading }] = useLazyQuery(GETALLACTIVITIES, {
    fetchPolicy: `network-only`,
  });
  const [getContactsForActivity, { data: getContactsForActivityResult }] = useLazyQuery(GET_CONTACTS_FOR_ACTIVITY, {
    fetchPolicy: "no-cache",
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
  const activitiesGridState = tableController("ActivitiesTable").useState(["filters"]).stateValues;
  const [view, setView] = React.useState(Views.MONTH);
  useEffect(() => {
    const contacts = getContactsForActivityResult?.getContactsForActivity?.contacts;
    setStateApp((stateApp) => ({
      ...stateApp,
      activityContacts: { contacts },
    }));
  }, [getContactsForActivityResult]);

  useEffect(() => {
    getAllActivities({
      variables: {
        category: "CRM",
      },
    });
    getAllMongoUsers();
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
            creator: { name: act?.createdBy?.name }
            // isContact: act.contactId,
          };
        })
      );
    }
  }, [activitiesData]);

  useEffect(() => {
    setFilteredEvents(events.filter((e) => getFilterCondition(e, activityFilterByType, activityFilterByTime, activityFilterByOwner)));
  }, [events, activityFilterByType, activityFilterByTime, activityFilterByOwner, view]);

  useEffect(() => {
    if (stateApp.selectedActivityId) {
      setStateApp(() => ({ ...stateApp, selectedActivity: events.find((act) => act._id === stateApp.selectedActivityId) }));
    } else {
      setStateApp(() => ({ ...stateApp, selectedActivity: null }))
    }
  }, [stateApp.selectedActivityId]);

  useEffect(() => {
    if (activitiesGridState) {
      tableController("ActivitiesTable").clearFilters();
      const filters = []

      if (activityFilterByType && activityFilterByType !== "all") {
        filters.push({ field: "type.keyword", value: activityFilterByType })
      }
      if (activityFilterByType && activityFilterByOwner !== "all") {
        filters.push({ field: "ownerId.keyword", value: activityFilterByOwner })
      }
      const today = moment().format("yyyy-MM-DD");
      switch (activityFilterByTime) {

        case "upcoming":
          filters.push({
            field: 'dateTime',
            value: {
              gte: `${today}T00:00:00.000Z`,
            },
            type: "range"
          });
          break;
        case "overdue":
          filters.push({
            field: 'endDateTime',
            value: {
              lte: `${today}T00:00:00.000Z`,
            },
            type: "range"
          });
          filters.push({ field: "isClosed", value: 'false' });
          break;
        case "open":
          filters.push({
            field: "isClosed",
            value: 'false'
          });
          break;
        case "closed":
          filters.push({
            field: "isClosed",
            value: 'true'
          });
          break;

        default:
          break;
      }
      tableController("ActivitiesTable").setFilters(filters);
    }
  }, [activityFilterByType, activityFilterByOwner, activityFilterByTime])

  const onEventClick = (event) => {
    window.history.pushState("", "", `/calendar/activities/${event._id}`);
    setSelectedActivityId(event._id);
    onModalOpen();
  };

  const onModalOpen = () => {
    setActivityId(actId => {
      getContactsForActivity({
        variables: { activityId: actId },
      }).then((contactsData) => {

        slidoutStateController.showSlideout()
      })
      return actId;
    })

  };

  const setSelectedActivityId = (id) => {
    setActivityId(id)
    setStateApp((stateApp) => ({
      ...stateApp,
      selectedActivityId: id,
    }));
  };

  const overrideMeta = {
    defaultFilters: [
      { field: "category.keyword", value: "CRM" },
      { field: "type.keyword", value: "Expiration", type: "advanced", searchType: "notEquals" }
    ],
  }


  return (
    <div className={classes.root}>
      {(activitiesLoading || entityLoading.get()) ? (
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
              activities={activitiesData?.activities}
              type="Activity"
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
                  activities={activitiesData?.activities}
                  type="Activity"
                />
              </div>



              <div className={classes.table}>
                <MRTTable name="ActivitiesTable" overrideMeta={overrideMeta} />
              </div>
            </div>
          )}
          <ActivitiesSlideout activityId={stateApp.selectedActivity?._id} setSelectedActivityId={setSelectedActivityId} events={events} getContactsForActivity={getContactsForActivity} />
        </>
      )}
    </div>
  );
};

export default Activities;
