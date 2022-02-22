import React, { useState, useEffect, useContext } from "react";
import { Grid, Card, CardContent } from "@material-ui/core";
import { useLazyQuery } from "@apollo/client";
import get from 'lodash/get';

import { AppContext } from "AppContext";
import { GET_ACTIVITY_ANALYTICS } from "graphQL/useQueryActivityAnalytics";
import DonutChart from "components/Shared/Charts/DonutChart";
import StackedBarChart from "components/Shared/Charts/StackedBarChart";
import { getFilters } from "components/Table/Activities/ActivitiesTable";

const ActivityAnalytics = ({ appliedFilters, tableFilters }) => {
  const [stateApp] = useContext(AppContext);
  const [analyticsData, setAnalyticsData] = useState([]);

  const [getActivityAnalytics] = useLazyQuery(
    GET_ACTIVITY_ANALYTICS,
    {
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        if(data?.getActivityAnalytics){
          setAnalyticsData(data?.getActivityAnalytics)
        }
      },
    }
  );

  const getAllFilters = () => {
    let rangeFilters = [];
    if(!tableFilters.find(filter => filter.type === 'range')){
      rangeFilters = getFilters(appliedFilters);
    }
    return [...rangeFilters, ...tableFilters]
  }

  useEffect(() => {
    getActivityAnalytics({
      variables: {
        search: {
          fields: ["name", "_all"],
          query: stateApp.activitySearchQuery,
        },
        filters: getAllFilters(),
      },
    });
  }, [stateApp.activitySearchQuery, appliedFilters, tableFilters]);

  return (
    <Grid
      container
      direction="row"
      display="flex"
      align="center"
      spacing={4}
      textAlign="left"
      style={{ padding: "30px" }}
    >
      <Grid item md={4} style={{ padding: "10px" }}>
        <Card variant="outlined">
          <CardContent style={{ height: "265px" }}>
            <label>Total Activities</label>
            <div
              style={{
                position: "relative",
                top: "85px",
                fontSize: 18,
              }}
            >
              {get(analyticsData,'total', 0)}
            </div>
            <DonutChart
              height={240}
              marginTop={-15}
              data={[
                {
                  title: "Calls",
                  value: get(analyticsData,'activitiesCount.call', 0),
                  color: "#A3B2DD",
                },
                {
                  title: "Emails",
                  value: get(analyticsData,'activitiesCount.email', 0),
                  color: "#FFD78E",
                },
                {
                  title: "Texts",
                  value: get(analyticsData,'activitiesCount.text_message', 0),
                  color: "#CDCDCD",
                },
                {
                  title: "Mailers",
                  value: get(analyticsData,'activitiesCount.mailer', 0),
                  color: "#F5B296",
                },
              ]}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={4} style={{ padding: "10px" }}>
        <Card variant="outlined">
          <CardContent style={{ height: "265px" }}>
            <StackedBarChart height={250} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={4} style={{ padding: "10px" }}>
        <Card variant="outlined">
          <CardContent style={{ height: "265px" }}>
            <StackedBarChart height={250} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ActivityAnalytics;
