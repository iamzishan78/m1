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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { CircularProgress } from "@material-ui/core";
import TractIcon from "components/Shared/svgIcons/tract";
import UnitIcon from "components/Shared/svgIcons/unit";
import NotificationsIcon from "@material-ui/icons/Notifications";
import FolderIcon from "@material-ui/icons/Folder";
import ContactIcon from "@material-ui/icons/Group";
import FlowIcon from "@material-ui/icons/Repeat";
import { LocalAtm } from "@material-ui/icons";
import { DescriptionOutlined } from "@material-ui/icons";

import { GET_NOTIFICATIONS } from "graphQL/useQueryGetNotifications";
import { UPDATE_NOTIFICATION_STATUS } from "graphQL/useMutationUpdateNotificationStatus";
import { GET_PROFILES_IMAGES } from "graphQL/useQueryGetProfile";
import { GETMONGOUSERS } from "graphQL/useQueryGetUsers";
import { AppContext } from "AppContext";

import ReactTimeAgo from "react-time-ago";
import { dateIsValid } from "utils/helper";
import { CommonCommentText } from "components/Shared/CommentComponent";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: "8px 8px 0 16px",
    backgroundColor: "#FFFFF",
    color: "black",
  },
  listitem: {
    padding: "10px",
    backgroundColor: "#F6F8F9",
    "&:hover": {
      backgroundColor: "#DDDFE0",
    },
    "& .MuiFormControl-marginDense": {
      margin: "0px !important",
    },
    "& .MuiIconButton-root": {
      padding: "10px !important",
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
    display: "flex",
    "& svg": {
      color: "#000000",
      marginRight: "7px",
    },
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
    margin: "12px 8px",
    cursor: "pointer",
  },
  image: {
    maxHeight: "72px",
    maxWidth: "65px !important",
    borderRadius: "4px",
  },
  gridStyle: {
    padding: "8px 0px",
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
  sysNotification: {
    marginLeft: 0,
  },
  customTabs: {
    float: "right",
    paddingRight: "30px",
    "& .MuiTab-root": {
      minWidth: "60px",
    },
    "& .Mui-selected": {
      color: "#18AADD",
    },
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
  const [tab, setTab] = useState(0);

  const [updateNotificationStatus] = useMutation(UPDATE_NOTIFICATION_STATUS);

  const [getNotifications, { data: notificationsData, loading }] =
    useLazyQuery(GET_NOTIFICATIONS, {
      fetchPolicy: 'cache-and-network'
    });

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
        state: "Active",
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
    if (notificationsData?.getNotifications) {
      setNotifications(notificationsData.getNotifications);
    }
  }, [notificationsData]);

  useEffect(() => {
    if (profilesData?.data?.profileByEmail?.profiles) {
      setProfilesInfo(profilesData.data.profileByEmail.profiles);
    }
  }, [profilesData]);

  const Title = () => {
    return (
      <Grid container className={classes.gridStyle}>
        <Grid item xs={6}>
          <div>Notifications</div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.customTabs}>
            <Tabs
              value={tab}
              textColor="primary"
              onChange={(e, newValue) => {
                setTab(newValue);
                getNotifications({
                  variables: {
                    userId: stateApp.user.mongoId,
                    state: newValue === 0 ? "Active" : "Archived",
                  },
                });
              }}
            >
              <Tab label="Active" />
              <Tab label="Archive" />
            </Tabs>
          </div>
        </Grid>
      </Grid>
    );
  };
  const getNotificationIcon = (type) => {
    switch (type) {
      case "PARCEL":
        return <TractIcon />;
      case "UNIT":
        return <UnitIcon />;
      case "AGREEMENT":
        return <FolderIcon />;
      case "CONTACT":
        return <ContactIcon />;
      case "DEAL":
        return <FlowIcon />;
      case "CHECK":
        return <LocalAtm />;
      case "PROPERTY":
        return <DescriptionOutlined />;
      default:
        return;
    }
  };
  return (
    <Fragment>
      <CardHeader
        // action={<DragHandle />}
        title={<Title />}
        className={classes.header}
      />

      {loading ? (
        <CircularProgress className={classes.progress} size={80} disableShrink color="secondary"></CircularProgress>
      ) : (
        <List style={{ maxHeight: "calc(100% - 48px)", overflow: "auto" }}>
          {notifications.map(({ _id, state, source, parent, notificationType, parentType, dateTimeAdded, message, pipelineId, stageId }, i) => {
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
                  onClick={() => {
                    updateNotificationStatus({
                      variables: {
                        id: _id,
                        state: "READ",
                      },
                      refetchQueries: ["getNotifications"],
                      awaitRefetchQueries: false,
                    });
                    if (parentType === "DEAL") {
                      history.push(
                        `/flow/${pipelineId}/lane/${stageId}/card/${parent._id}/`
                      );
                    } else if (
                      parentType === "PARCEL" ||
                      parentType === "UNIT"
                    ) {
                      history.push(
                        `/map/${parentType.toLowerCase()}s/${parent._id}`
                      );
                    } else if (parentType === "AGREEMENT") {
                      history.push(`/map/${parent.layer}s/${parent._id}`);
                    } else if (parentType === "CHECK") {
                      history.push(`/revenue/statement/details/${parent._id}`);
                    } else if (parentType === "PROPERTY") {
                      history.push(`/revenue/property/details/${parent._id}`);
                    } else if (parentType === "CONTACT") {
                      history.push(`/contact/details/${parent._id}`);
                    }
                  }}
                >
                  <Grid item xs={10} zeroMinWidth>
                    {parent &&
                      (parentType === "DEAL" ||
                        parentType === "PARCEL" ||
                        parentType === "UNIT" ||
                        parentType === "AGREEMENT" ||
                        parentType === "CONTACT") && (
                        <span className={classes.title}>
                          {getNotificationIcon(parentType)}
                          {parent.name}
                        </span>
                      )}
                    {parent && parentType === "CHECK" && (
                      <span className={classes.title}>
                        {getNotificationIcon(parentType)}
                        {parent.checkNumber}-{parent?.payor?.name}
                      </span>
                    )}
                    {parent && parentType === "PROPERTY" && (
                      <span className={classes.title}>
                        {getNotificationIcon(parentType)}
                        {parent.number}-{parent.name}
                      </span>
                    )}
                    {notificationType === "SYSTEM" && (
                      <Grid container className={classes.gridStyle}>
                        <Grid item xs={1}>
                          <IconButton
                            style={{ marginTop: "0px", marginLeft: "14px" }}
                          >
                            <NotificationsIcon />
                          </IconButton>
                        </Grid>
                        <Grid item xs={11} className={classes.paddingLeft10}>
                          <div>
                            {
                              dateIsValid(Date.parse(dateTimeAdded)) && <ReactTimeAgo
                                className={[classes.commentTime, classes.sysNotification]}
                                date={
                                  new Date(
                                    new Intl.DateTimeFormat("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }).format(Date.parse(dateTimeAdded))
                                  )
                                }
                                locale="en-US"
                              />
                            }
                            <br />
                            <span>{message}</span>
                          </div>
                        </Grid>
                      </Grid>
                    )}
                    {notificationType === "MENTION" && (
                      <Grid container className={classes.gridStyle}>
                        <Grid item xs={1}>
                          <IconButton
                            style={{ marginTop: "0px", marginLeft: "14px" }}
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
                            {
                              <ReactTimeAgo
                                className={classes.commentTime}
                                date={new Date(!isNaN(Number(source.ts)) ? Number(source.ts) : source.ts)}
                                locale="en-US"
                              />
                            }
                          </div>
                          <CommonCommentText users={users} eachComment={source} />
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={2} style={{ textAlign: "-webkit-center" }}>
                    <Tooltip title="Mark as unread">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
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
                        onClick={(e) => {
                          e.stopPropagation();
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
          })}
        </List>
      )}
    </Fragment>
  );
};
export default Notifications;
