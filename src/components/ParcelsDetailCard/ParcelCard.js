import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

import { AppContext } from "../../AppContext";
import { ExpandableCardContext } from "../ExpandableCard/ExpandableCardContext";
import { ParcelCardContext } from "./ParcelCardContext";
import ParcelsDetailCard from "./ParcelsDetailCard";

const useStyles = makeStyles((theme) => ({
  card: {
    borderStyle: "none",
    height: "100%",
  },
  content: {
    padding: "0 !important",
    height: "100%",
  },
  cardAction: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
  },
}));

export default function ParcelCard(props) {

  const [stateApp, setStateApp] = useContext(AppContext);
  const [parcelContext, setParcelContext] = useContext(ParcelCardContext);
  const [stateExpandableCard, setStateExpandableCard] = useContext(ExpandableCardContext);
  const classes = useStyles();

  return stateApp.selectedParcel ? (
    !stateExpandableCard.expanded ? (
      <div style={{ height: "100%", padding: "9px" }}>
        <Card>
          <CardActions classes={{root: classes.cardAction}}></CardActions>
          <CardContent className={classes.content}>
            Coming soon
          </CardContent>
        </Card>
      </div>
    ) : (
        <div style={{ height: "100%" }}>
          <Card className={classes.card}>
            <CardContent className={classes.content}>
              <ParcelsDetailCard id={stateApp.selectedParcel.id} />
            </CardContent>
          </Card>
        </div>
      )
  ) : (
      <CircularProgress color="secondary" />
    )
}