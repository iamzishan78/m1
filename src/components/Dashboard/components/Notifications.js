import { Grid } from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import { useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import React, { Fragment, useEffect, useState, useContext } from "react";
import { sortableHandle } from "react-sortable-hoc";

import { GET_NOTIFICATIONS } from "graphQL/useQueryGetNotifications";
import { AppContext } from "AppContext";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: "8px 8px 0 8px",
    backgroundColor: "#FFFFF",
    color: "black",
  },
  container: {},
  listitem: {
    padding: "10px",
  },
  thumb: {
    height: "16px",
    maxWidth: "16px",
  },
  source: {
    fontSize: "12px",
    marginLeft: "0px",
  },
  title: {
    fontSize: "14px",
    margin: "2px 0",
    fontWeight: "bold",
    textDecoration: "none",
    color: "black",
  },
  content: {
    fontSize: "12px",
    marginBottom: "2px",
  },
  date: {
    fontSize: "10px",
  },
  paper: {
    margin: "8px 4px",
  },
  image: {
    maxHeight: "72px",
    maxWidth: "65px !important",
    borderRadius: "4px",
  },
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" htmlColor="#808080" />
  </IconButton>
));

const Notifications = () => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);

  const [getNotifications, { data: notificationsData }] = useLazyQuery(GET_NOTIFICATIONS);

  useEffect(() => {
    getNotifications({
      variables:{
        userId: stateApp.user.mongoId
      }
    })
  },[getNotifications, stateApp.user])

  useEffect(() => {
    if(notificationsData?.getNotifications?.length > 0){
      setNotifications(notificationsData.getNotifications)
    }
  },[notificationsData])

  return (
    <Fragment>
      <CardHeader
        action={<DragHandle />}
        title={`Notifications`}
        className={classes.header}
      />

      <List style={{ maxHeight: "calc(100% - 48px)", overflow: "auto" }}>
        {notifications.map(({ feed, article, source, image }, i) => {
          return (
            <Paper key={i} className={classes.paper}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                className={classes.listitem}
                spacing={1}
              >
                <Grid item xs={9} zeroMinWidth>
                </Grid>
                <Grid item xs={3} style={{ textAlign: "-webkit-center" }}>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </List>
    </Fragment>
  );
};
export default Notifications;
