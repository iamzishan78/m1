import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { uniqueId } from "lodash";

import { useQuery } from "@apollo/client";
import { GETALLACTIVITIES } from "../../graphQL/useQueryGetAllActivities";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const ActivitiesCalendar = ({ events }) => (
  <div>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      defaultView="week"
      defaultDate={new Date()}
      style={{ height: "100%" }}
    />
  </div>
);

const useStyles = makeStyles((theme) => ({
  progress: {
    marginLeft: "30px",
    verticalAlign: "middle",
  },
  root: {
    padding: 16,
  },
}));

const Activities = () => {
  const classes = useStyles();

  const {
    data: activitiesData,
    loading: activitiesLoading,
    error: activitiesError,
  } = useQuery(GETALLACTIVITIES);

  console.log("ACTIVITIES", activitiesData, activitiesLoading);
  return (
    <div className={classes.root}>
      {activitiesLoading ? (
        <CircularProgress
          className={classes.progress}
          size={80}
          disableShrink
        />
      ) : (
        <ActivitiesCalendar
          events={
            activitiesData?.activities?.map((act) => {
              const start = new Date(act.dateTime);
              const end = act.endTime
                ? new Date(act.endTime)
                : start.setTime(start.getTime() + 1 * 60 * 60 * 1000);
              return {
                id: uniqueId(),
                start,
                end,
                title: act.fullname,
                notes: act.notes,
                type: act.type,
                allDay: true,
              };
            }) || []
          }
        />
      )}
    </div>
  );
};

export default Activities;
