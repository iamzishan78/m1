import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import TitleOpinionsList from "../components/titleOpinionList";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    paddingLeft: "20px",
    paddingRight: "20px",
    textAlign: "center",
    marginTop: "15px",
    marginBottom: "0",
    color:"rgb(1, 26, 80)"
  },
  TOList: {
    padding: "0 !important",
    marginLeft: "20px"
  }
}));

export default function InteractiveList(props) {
  const classes = useStyles();
  const [dense] = React.useState(false);

  return (
    <div>
      <Grid item xs={12}>
        <Divider />
        <h2 className={classes.title}>{`${props.project.name} -(${props.project.client.name})`}</h2>
        <div className={classes.demo}>
          <List dense={dense} className={classes.TOList}>
            <TitleOpinionsList titleOpinions={props.project.titleOpinions} />
          </List>
        </div>
      </Grid>
    </div>
  );
}
