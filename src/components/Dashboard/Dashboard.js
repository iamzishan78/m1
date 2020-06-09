import { Container, Grid } from "@material-ui/core";
import CardGrid from "./components/CardsGrid";
import DateBar from "./components/WeatherCard";
import React, {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
} from "react";



const Dashboard = () => {

  return (
    // <Container>
      <Grid container
            direction="column" 
            spacing={2}>
        <DateBar />
        <CardGrid />
      </Grid>
    // </Container>
  );
};

export default Dashboard;
