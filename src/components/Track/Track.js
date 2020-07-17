import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavigationContext } from "../Navigation/NavigationContext";
import { Container } from "@material-ui/core";
import M1nTable from "../Shared/M1nTable/M1nTable";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme) => ({
  root:{
    backgroundColor:'#efefef',
    height: '100%'
  },
  container: {
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  card: {
    width: "100%",
  },
}));

export default function Track() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  return (
    <div className={classes.root}>
    <Container maxWidth="xl" className={classes.container}>
      <Card className={classes.card}>
        {stateNav.trackTabsValue === 1 ? (
          <M1nTable parent="trackWells" />
        ) : null}
        {stateNav.trackTabsValue === 0 ? (
          <M1nTable parent="trackOwners" />
        ) : null}
      </Card>
    </Container>
    </div>
  );
}
