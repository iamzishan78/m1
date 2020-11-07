import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  Toolbar,
  ViewSwitcher,
  MonthView,
  DayView,
} from "@devexpress/dx-react-scheduler-material-ui";

class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          title: "Book Flights to San Fran for Sales Trip",
          startDate: new Date(2018, 6, 16, 12, 0),
          endDate: new Date(2018, 6, 16, 13, 0),
        },
        {
          title: "Install New Database",
          startDate: new Date(2018, 6, 17, 15, 45),
          endDate: new Date(2018, 6, 18, 12, 15),
        },
      ],
      currentViewName: "week",
    };
    this.currentViewNameChange = (currentViewName) => {
      this.setState({ currentViewName });
    };
  }

  render() {
    const { data, currentViewName } = this.state;

    return (
      <Paper>
        <Scheduler data={data} height={660}>
          <ViewState
            defaultCurrentDate="2018-07-25"
            currentViewName={currentViewName}
            onCurrentViewNameChange={this.currentViewNameChange}
          />

          <WeekView startDayHour={10} endDayHour={19} />
          {/* <WeekView
            name="work-week"
            displayName="Work Week"
            excludedDays={[0, 6]}
            startDayHour={9}
            endDayHour={19}
          /> */}
          <MonthView />
          <DayView />

          <Toolbar />
          <ViewSwitcher />
          <Appointments />
        </Scheduler>
      </Paper>
    );
  }
}

const Activities = () => {
  return (
    <div>
      <h1>ACTIVITIES PAGE</h1>
      <Demo />
    </div>
  );
};

export default Activities;
