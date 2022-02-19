import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { uniqueId } from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import ActivityAnalytics from "./ActivityAnalytics";
import ActivitiesDashboardFilter from "./ActivitiesDashboardFilter";
import M1nTable from "components/Shared/M1nTable/M1nTable";
import { GETALLACTIVITIES } from "graphQL/useQueryGetAllActivities";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0px 30px",
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "78vh",
          minHeight: "78vh",
          "@media (max-height:900px)": {
            maxHeight: "72vh",
            minHeight: "72vh",
          },
          "@media (max-height:800px)": {
            maxHeight: "70vh",
            minHeight: "70vh",
          },
          "@media (max-height:768px)": {
            maxHeight: "70vh",
            minHeight: "70vh",
          },
        },
      },
    },
  },
}));

const ActivitiesTable = () => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const [filterToggle, setFilterToggle] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [lastCheckMinDate, setLastCheckMinDate] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [getAllActivities, { data: activitiesData, loading }] = useLazyQuery(
    GETALLACTIVITIES,
    {
      fetchPolicy: `network-only`,
    }
  );

  useEffect(() => {
    let allEvents = JSON.parse(JSON.stringify(events))
    if(toDate && fromDate){
      allEvents = allEvents.filter(e => new Date(e.start) >= new Date(fromDate) && new Date(e.end) <= new Date(toDate))
    }
    setFilteredEvents(allEvents);
  }, [events, filterToggle]);

  useEffect(() => {
    getAllActivities();
  }, []);

  useEffect(() => {
    let minDate = 0;
    if (activitiesData) {
      setEvents(
        activitiesData?.activities?.map((act, index) => {
          if (minDate > act.dateTime || index === 0) {
            minDate = act.dateTime;
          }
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
      const d =new Date(Number(minDate))
      setLastCheckMinDate(d.toISOString());
      setFilterToggle(!filterToggle)
      setFromDate(`${moment(d).startOf('month').format("yyyy-MM-DD")}`);
    }
  }, [activitiesData]);

  return (
    loading ? (
      <CircularProgress className={classes.progress} size={80} disableShrink color="secondary" />
    ) : (
      <>
        <ActivitiesDashboardFilter
          setFilterToggle={setFilterToggle}
          filterToggle={filterToggle}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          lastCheckMinDate={lastCheckMinDate}
        />
        <ActivityAnalytics activities={filteredEvents}/>
        <div className={classes.root}>
          <M1nTable dense activities={filteredEvents} parent="Activities" />
        </div>
      </>
    )
  );
};

export default ActivitiesTable;
