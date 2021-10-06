import { Grid } from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import MarkUnreadIcon from "components/Shared/svgIcons/mark-unread";
import ArchiveIcon from "components/Shared/svgIcons/archive";
import React, { Fragment, useEffect, useState, useContext } from "react";
import { sortableHandle } from "react-sortable-hoc";
import { useHistory } from "react-router-dom";
import Avatar from "react-avatar";
import Tooltip from "@material-ui/core/Tooltip";

import { CommentText } from "components/Transact/components/DealComments";
import { GET_NOTIFICATIONS } from "graphQL/useQueryGetNotifications";
import { UPDATE_NOTIFICATION_STATUS } from "graphQL/useMutationUpdateNotificationStatus";
import { GET_PROFILES_IMAGES } from "graphQL/useQueryGetProfile";
import { GETMONGOUSERS } from "graphQL/useQueryGetUsers";
import { AppContext } from "AppContext";

import ReactTimeAgo from "react-time-ago";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: "8px 8px 0 8px",
    backgroundColor: "#FFFFF",
    color: "black",
  },
  listitem: {
    padding: "10px",
    backgroundColor: "#F6F8F9",
    "& .MuiFormControl-marginDense": {
      margin: "0px !important",
    },
    "& .MuiIconButton-root": {
      padding: "0px !important",
    },
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
    fontSize: "16px",
    marginLeft: "10px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "black",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
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
  gridStyle: {
    padding: "12px 0px",
  },
  paddingLeft10: {
    paddingLeft: "20px !important",
    paddingTop: "3px !important",
  },
  bold: {
    fontWeight: "bold",
  },
  commentTime: {
    marginLeft: "10px",
    fontSize: "12px",
  },
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" htmlColor="#808080" />
  </IconButton>
));

const Notifications = () => {
  const classes = useStyles();
  let history = useHistory();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [profilesInfo, setProfilesInfo] = useState({});
  const [users, setUsers] = useState([]);

  const [updateNotificationStatus] = useMutation(UPDATE_NOTIFICATION_STATUS);
  const [getNotifications, { data: notificationsData }] =
    useLazyQuery(GET_NOTIFICATIONS);
  const [getProfilesImages, profilesData] = useLazyQuery(GET_PROFILES_IMAGES, {
    fetchPolicy: "cache-first",
  });
  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    getNotifications({
      variables: {
        userId: stateApp.user.mongoId,
      },
    });
  }, [getNotifications, stateApp.user]);

  useEffect(() => {
    getAllMongoUsers();
  }, [getAllMongoUsers]);

  useEffect(() => {
    if (userLists && userLists.allMongoUsers) {
      const data = userLists.allMongoUsers
        .map((user) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
        }))
        .filter((user) => user._id && user.name);
      setUsers(data);
      const emails = userLists.allMongoUsers.map((user) => user.email);
      getProfilesImages({
        variables: { emails },
      });
    }
  }, [userLists]);

  useEffect(() => {
    if (notificationsData?.getNotifications?.length > 0) {
      setNotifications(notificationsData.getNotifications);
    }
  }, [notificationsData]);

  useEffect(() => {
    if (profilesData?.data?.profileByEmail?.profiles) {
      setProfilesInfo(profilesData.data.profileByEmail.profiles);
    }
  }, [profilesData]);

  return (
    <Fragment>
      <CardHeader
        action={<DragHandle />}
        title={`Notifications`}
        className={classes.header}
      />

      <List style={{ maxHeight: "calc(100% - 48px)", overflow: "auto" }}>
        {notifications.map(
          (
            {
              _id,
              state,
              source,
              parent,
              notificationType,
              parentType,
              pipelineId,
              stageId,
            },
            i
          ) => {
            const user = users.find((user) => source.user === user._id);
            return (
              <Paper key={i} className={classes.paper}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  style={
                    state === "UNREAD"
                      ? { borderLeft: "4px solid #01B0F0" }
                      : { borderLeft: "4px solid #BFBFBF" }
                  }
                  className={classes.listitem}
                  spacing={1}
                >
                  <Grid item xs={10} zeroMinWidth>
                    {parent && parentType === "DEAL" && (
                      <span
                        className={classes.title}
                        onClick={() => {
                          updateNotificationStatus({
                            variables: {
                              id: _id,
                              state: "READ",
                            },
                            refetchQueries: ["getNotifications"],
                            awaitRefetchQueries: false
                          });
                          history.push(
                            `/flow/${pipelineId}/lane/${stageId}/card/${parent._id}/`
                          );
                        }}
                      >
                        {parent.name}
                      </span>
                    )}
                    {notificationType === "MENTION" && (
                      <Grid container className={classes.gridStyle}>
                        <Grid item xs={1}>
                          <IconButton
                            style={{ marginTop: "4px", marginLeft: "14px" }}
                          >
                            {profilesInfo[user?.email]?.profileImage ? (
                              <Avatar
                                src={profilesInfo[user?.email].profileImage}
                                size="38"
                                round
                              />
                            ) : (
                              <Avatar name={user?.name} size="38" round />
                            )}
                          </IconButton>
                        </Grid>
                        <Grid item xs={11} className={classes.paddingLeft10}>
                          <div>
                            <span className={classes.bold}>{user?.name}</span>
                            <ReactTimeAgo
                              className={classes.commentTime}
                              date={
                                new Date(
                                  new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(Date.parse(source.ts))
                                )
                              }
                              locale="en-US"
                            />
                          </div>
                          <CommentText users={users} eachComment={source} />
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={2} style={{ textAlign: "-webkit-center" }}>
                    <Tooltip title="Mark as unread">
                      <IconButton
                        onClick={() => {
                          updateNotificationStatus({
                            variables: {
                              id: _id,
                              state: "UNREAD",
                            },
                            refetchQueries: ["getNotifications"],
                            awaitRefetchQueries: false,
                          });
                        }}
                      >
                        <MarkUnreadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Archive notification">
                      <IconButton
                        onClick={() => {
                          updateNotificationStatus({
                            variables: {
                              id: _id,
                              state: "ARCHIVED",
                            },
                            refetchQueries: ["getNotifications"],
                            awaitRefetchQueries: false,
                          });
                        }}
                      >
                        <ArchiveIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Paper>
            );
          }
        )}
      </List>
    </Fragment>
  );
};
export default Notifications;
