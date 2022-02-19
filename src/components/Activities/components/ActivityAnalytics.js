import React from "react";
import { Grid, Card, CardContent } from "@material-ui/core";

import DonutChart from "components/Shared/Charts/DonutChart";
import StackedBarChart from "components/Shared/Charts/StackedBarChart";

const ActivityAnalytics = ({ activities }) => {
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
                fontSize: 18
              }}
            >
              {activities.length}
            </div>
            <DonutChart
              height={240}
              marginTop={-15}
              data={[
                {
                  title: "Calls",
                  value: activities.filter((act) => act.type === "call").length,
                  color: "#A3B2DD",
                },
                {
                  title: "Emails",
                  value: activities.filter((act) => act.type === "email")
                    .length,
                  color: "#FFD78E",
                },
                {
                  title: "Texts",
                  value: activities.filter((act) => act.type === "text_message")
                    .length,
                  color: "#CDCDCD",
                },
                {
                  title: "Mailers",
                  value: activities.filter((act) => act.type === "mailer")
                    .length,
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
