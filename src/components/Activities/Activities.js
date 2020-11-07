import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { uniqueId } from "lodash";

import { useQuery } from "@apollo/client";
import { GETALLACTIVITIES } from "../../graphQL/useQueryGetAllActivities";
import ActivitiesToolbar from "./components/ActivitiesToolbar";
import ActivitiesEvent from "./components/ActivitiesEvent";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.css";

const localizer = momentLocalizer(moment);

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h * 60 * 60 * 1000);
  return this;
};

const ActivitiesCalendar = ({ events }) => {
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
          toolbar: ActivitiesToolbar,
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
              const end = act.endDateTime ? new Date(act.endDateTime) : start;
              return {
                id: uniqueId(),
                start,
                end,
                title: act.fullname,
                notes: act.notes,
                type: act.type,
              };
            }) || []
          }
        />
      )}
    </div>
  );
};

export default Activities;
