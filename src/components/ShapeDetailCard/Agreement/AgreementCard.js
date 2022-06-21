import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import AgreementDetailCard from "./AgreementDetailCard";

// contexts 
import { AppContext } from "AppContext";
import { ExpandableCardContext } from "components/ExpandableCard/ExpandableCardContext";
import { setMapGridCardState } from "actions";

const useStyles = makeStyles((theme) => ({
  card: {
    borderStyle: "none",
    height: "100%",
    boxShadow: "none"
  },
  content: {
    padding: "0 !important",
    height: "100%",
  }
}));

export default function AgreementCard(props) {

  // contexts 
  const [stateApp] = useContext(AppContext);
  const [stateExpandableCard] = useContext(ExpandableCardContext);

  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMapGridCardState({ mapGridCardActivated: false }));
  }, [dispatch]);

  return (
    <>
      {
        stateExpandableCard.expanded && (
          <div style={{ height: "100%" }}>
            <Card className={classes.card}>
              <CardContent className={classes.content}>
                <AgreementDetailCard id={stateApp.selectedShape.id} />
              </CardContent>
            </Card>
          </div>
        )
      }
    </>
  )
}
