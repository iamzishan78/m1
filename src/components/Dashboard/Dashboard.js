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
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor:'#efefef',
  },
  header: {    
    paddingTop: '25px',
    paddingBottom: '75px',
    paddingLeft: "20px"
  }
}));

const Dashboard = () => {
  
  const classes = useStyles();

  return (
    <div className={classes.root}>
    <Container maxWidth='false'>
      {/* <Grid container
            direction="column" 
            spacing={2}> */}

        <div className={classes.header}>
        <DateBar />
        </div>
        <CardGrid />

      {/* </Grid> */}
    </Container>
    </div>
  );
};

export default Dashboard;
