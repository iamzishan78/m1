import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    width: "60%",
    marginTop: "20px",
    marginRight: "20%",
    marginLeft: "20%"
  }
});

export default function OutlinedCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      {props.children}
    </Card>
  );
}
