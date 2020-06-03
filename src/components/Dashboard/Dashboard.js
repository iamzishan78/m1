import { Container, Grid } from "@material-ui/core";
import React from "react";
import CardGrid from "./components/CardsGrid";
import DateBar from "./components/WeatherCard";

const Dashboard = () => {
  return (
    <Container disableGutters>
      <Grid container direction="column" spacing={2}>
        <DateBar />
        <CardGrid />
      </Grid>
    </Container>
  );
};

export default Dashboard;
