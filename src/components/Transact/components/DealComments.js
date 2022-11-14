import React, { useState, useEffect, useContext, Fragment } from "react";

import Avatar from "react-avatar";
import Grid from "@material-ui/core/Grid";
import { CircularProgress, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useMutation, useLazyQuery } from "@apollo/client";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { AppContext } from "AppContext";
import { GETMONGOUSERS } from "graphQL/useQueryGetUsers";
import { GET_PROFILE_IMAGE } from "graphQL/useQueryGetProfile";
import { GET_PROFILES_IMAGES } from "graphQL/useQueryGetProfile";
import { UPSERTCOMMENT } from "graphQL/useMutationUpsertComment";
import { REMOVECOMMENT } from "graphQL/useMutationRemoveComment";
import { COMMENTSBYOBJECTIDQUERY } from "graphQL/useQueryCommentsByObjectId";
import CommentField from "components/Shared/components/Fields/CommentField";

import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import { dateIsValid } from "utils/helper";
import moment from "moment";
import { CommonCommentText } from "components/Shared/CommentComponent";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#F6F8F9",
    "& .MuiFormControl-marginDense": {
      margin: "0px !important",
    },
    "& .MuiIconButton-root": {
      padding: "0px !important",
    },
  },
  comment: {
    maxHeight: "290px",
    overflow: "auto",
    padding: "5px 10px",
    marginRight: "60px",
  },
  noBorder: {
    border: "none",
  },
  border: {
    border: "1px solid #EBEBEB",
    background: "white",
    overflow: "auto",
  },
  commentBtn: {
    float: "right",
    right: "10px",
    bottom: "10px",
    marginBottom: -20,
    background: "#24afdf",
  },
  paddingLeft10: {
    paddingLeft: "20px !important",
    paddingTop: "3px !important",
  },
  paddingCreateTask: {
    paddingLeft: "20px !important",
    paddingTop: "4px !important",
    width: "90%",
  },
  moreComment: {
    padding: "10px",
    marginLeft: "35px",
    display: "flex",
    color: "#18AADD",
    cursor: "pointer",
  },
  whiteSpace: {
    whiteSpace: "pre-wrap",
    marginTop: "5px",
  },
  gridStyle: {
    padding: "12px 0px",
  },
  bold: {
    fontWeight: "bold",
  },
  commentView: {
    padding: "10px 5px 10px 0px",
    // marginRight: "60px",
    // marginBottom: "10px",
    marginLeft: "20px",
  },
  commentTime: {
    marginLeft: "10px",
    fontSize: "12px",
  },
  floatRight: {
    float: "right",
  },
  cursorPointer: {
    cursor: "pointer",
  },
  inlineFlex: {
    display: "inline-flex",
  },
  containerWrapper:{
    display:'flex',
    justifyContent:'flex-start',
    alignItems:'center',
    gap:'10px'
  }
}));

export default function DealComment(props) {
  const { targetSourceId,contactData } = props;
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState("");
  const [editCommentId, setEditCommentId] = useState("");
  const [editComment, setEditComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [profilesInfo, setProfilesInfo] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [commentsArray, setCommentsArray] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [showCommentActionId, setShowCommentActionId] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);

  const [removeComment] = useMutation(REMOVECOMMENT);
  const [upsertComment, { data: newlyAddedComment }] = useMutation(UPSERTCOMMENT);
  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: "cache-and-network",
  });
  const [getProfileImage, profiledata] = useLazyQuery(GET_PROFILE_IMAGE);
  const [getProfilesImages, profilesData] = useLazyQuery(GET_PROFILES_IMAGES, {
    fetchPolicy: "cache-first",
  });
  const [getCommentsByObjectId, { data: dataComments }] = useLazyQuery(COMMENTSBYOBJECTIDQUERY, { fetchPolicy: "no-cache" });

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
    if (targetSourceId) {
      setLoadingComments(true);
      getCommentsByObjectId({
        variables: {
          objectId: targetSourceId,
        },
      });
    }
  }, [targetSourceId]);

  useEffect(() => {
    if (dataComments && dataComments.commentsByObjectId) {
      const sortedComments = sortArrayBasedOnTs([...dataComments.commentsByObjectId]);
      if (stateApp.activeDeal._id && stateApp.activeDeal?.createdOn) {
        sortedComments.unshift(getPinnedComment());
      }
      setCommentsArray(sortedComments);
    }
    setLoadingComments(false);
  }, [dataComments]);

  useEffect(() => {
    setLoadingComments(false);
    if (!targetSourceId && newlyAddedComment?.upsertComment?.comment) {
      const comments = JSON.parse(JSON.stringify(commentsArray));
      comments.push({
        ...newlyAddedComment.upsertComment.comment,
        user: { name: stateApp.user.name, email: stateApp.user.email },
        isNew: true,
      });
      props.setNewCommentId(newlyAddedComment.upsertComment.comment._id);
      setCommentsArray(sortArrayBasedOnTs([...comments]));
    }
  }, [newlyAddedComment]);

  useEffect(() => {
    if (profilesData?.data?.profileByEmail?.profiles) {
      setProfilesInfo(profilesData.data.profileByEmail.profiles);
    }
  }, [profilesData]);

  useEffect(() => {
    if (stateApp?.user?.email) {
      getProfileImage({
        variables: { email: stateApp.user.email },
        fetchPolicy: "network-only",
      });
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (profiledata && profiledata.data && profiledata.data.profileByEmail && profiledata.data.profileByEmail.profile) {
      const {
        data: {
          profileByEmail: {
            profile: { profileImage },
          },
        },
      } = profiledata;
      setProfileImage(profileImage);
    }
  }, [profiledata]);

  const getPinnedComment = () => ({
    user: stateApp.activeDeal.user,
    isPinned: true,
    isPublic: true,
    ts: new Date(stateApp.activeDeal.createdOn),
  });

  const sortArrayBasedOnTs = (array) => {
    const compare = (a, b) => {
      if (a.ts < b.ts) return -1;
      if (b.ts < a.ts) return 1;

      return 0;
    };
    if (!props.multipleIds) array.sort(compare);

    return array;
  };

  const newCommentCleaner = (value) =>
    value.trim()[value.trim().length - 1] === "."
      ? value
        .split("\n")
        .map((line) => {
          if (line.trim() !== ".") {
            return line.trim();
          }
        })
        .join("\n")
      : `${value
        .split("\n")
        .map((line) => {
          if (line.trim() !== ".") {
            return line.trim();
          }
        })
        .join("\n")}`;

  const updateComment = (value) => {
    setLoadingComments(true);
    upsertComment({
      variables: {
        comment: {
          comment: typeof value === "object" ? newCommentCleaner(value.comment) : newCommentCleaner(value),
          user: stateApp.user.mongoId,
          commentedOn: targetSourceId,
          _id: editCommentId,
          objectType: props.targetLabel,
          isEdited: true,
        },
      },
      refetchQueries: ["getCommentsByObjectId", "getCommentsCounter", "getCommentsByObjectsIds"],
      awaitRefetchQueries: true,
    });
    setShowActions(false);
    setComment("");
    setEditComment("");
    setEditCommentId("");
  };

  const deleteComment = (id) => {
    setLoadingComments(true);
    removeComment({
      variables: {
        commentId: id,
      },
      refetchQueries: ["getCommentsByObjectId", "getCommentsCounter", "getCommentsByObjectsIds"],
      awaitRefetchQueries: true,
    });
    setShowActions(false);
    setComment("");
    setEditComment("");
    setEditCommentId("");
  };

  const addNewComment = (value) => {
    setLoadingComments(true);
    upsertComment({
      variables: {
        comment: {
          comment: typeof value === "object" ? newCommentCleaner(value.comment) : newCommentCleaner(value),
          public: true,
          user: stateApp.user.mongoId,
          commentedOn: targetSourceId,
          objectType: props.targetLabel,
        },
      },
      refetchQueries: ["getCommentsByObjectId", "getCommentsCounter", "getCommentsByObjectsIds"],
      awaitRefetchQueries: true,
    });
    setShowActions(false);
    setComment("");
  };

  const getCount = () => {
    let indexToShow = commentsArray.length > 3 ? commentsArray?.length - 3 : 0;
    return indexToShow;
  };


  useEffect(() => {
    try {
      setLoadingComments(true);
      const activity = stateApp.activeDeal.activity;
      if (dataComments && dataComments.commentsByObjectId) {
        if (activity && activity.length > 0) {
          let activittyData = [];
          activity.forEach((element) => {
            activittyData.push({
              user: { name: element.ownerName, email: element.ownerName },
              activityData: element,
              comment: element.notes,
              ts: new Date(element._ts.includes('GMT') ? element._ts : Number(element._ts)).getTime(),
              isActivity: true,
              isEdited: false,
              public: true,
              __typename: "Comment",
            });
          });
          let tempArray = dataComments.commentsByObjectId.concat(activittyData);
          setCommentsArray(sortArrayBasedOnTs([...tempArray]));
        } else {
          setCommentsArray(sortArrayBasedOnTs([...dataComments.commentsByObjectId]));
        }
      }
    }catch (e){
      console.log("modifying the Comment Error",e);
    }finally {
      setLoadingComments(false);
    }
  }, [stateApp?.activeDeal?.activity,dataComments]);
  return (
    <div className={classes.container}>
      <div className={classes.comment}>
        {!loadingComments ? (
          <>
            {!showAllComments && commentsArray.length > 3 && (
              <div className={classes.moreComment} style={{ marginTop: 10, marginBottom: 10 }}>
                <span
                  onClick={() => {
                    setShowAllComments(true);
                  }}
                >
                  {getCount()} more comments
                </span>
              </div>
            )}
            {showAllComments && commentsArray.length > 3 && (
              <div className={classes.moreComment} style={{ marginTop: 10, marginBottom: 10 }}>
                <span onClick={() => setShowAllComments(false)}>Hide Earlier Comments</span>
              </div>
            )}

            {commentsArray.map((eachComment, index) => {
              let indexToShow = commentsArray.length > 3 ? commentsArray.length - 3 : 0;
              return (
                <Fragment key={index}>
                  {(showAllComments || index >= indexToShow) && (
                    <Grid
                      container
                      className={classes.gridStyle}
                      onMouseOver={() => setShowCommentActionId(eachComment._id)}
                      onMouseLeave={() => setShowCommentActionId(null)}
                    >
                      <Grid item style={{ maxWidth: "55px" }}>
                        <IconButton style={{ marginTop: "3px", marginLeft: "12px" }}>
                          {profilesInfo[eachComment.user?.email]?.profileImage || eachComment.isNew ? (
                            <Avatar
                              src={eachComment.isNew ? profileImage : profilesInfo[eachComment.user?.email].profileImage}
                              size="38"
                              round
                            />
                          ) : (
                            <Avatar name={eachComment.user?.name} size="38" round />
                          )}
                        </IconButton>
                      </Grid>
                      <Grid item className={classes.paddingCreateTask}>
                        <div>
                          <div className={classes.containerWrapper}>
                            <span className={classes.bold}>{eachComment.user?.name}</span>
                            <span>{
                              <ReactTimeAgo
                                  className={classes.commentTime}
                                  date={
                                    new Date(Number(eachComment.ts))
                                  }
                                  locale="en-US"
                              />
                            }</span>
                          </div>
                          {eachComment.isActivity === true && (
                              <>
                                <div className={`${classes.whiteSpace}`}>
                                  {eachComment.activityData.type.replace(/_/g, " ").toUpperCase()} - {eachComment.activityData.name}
                                </div>
                                <div className={`${classes.whiteSpace}`}>
                                  START DATE: {moment(eachComment.activityData.dateTime).format("MM/DD/YYYY hh:mm A")}
                                </div>
                                <div className={`${classes.whiteSpace}`}>
                                  END DATE: {moment(eachComment.activityData.endDateTime).format("MM/DD/YYYY hh:mm A")}
                                </div>
                              </>
                          )}
                          {eachComment.isPinned && <span> created this task.</span>}

                          {!eachComment.isPinned && (
                            <>
                              {eachComment.isEdited && <span className={classes.commentTime}>(Edited)</span>}
                              {eachComment.user?.email === stateApp.user.email &&
                                showCommentActionId === eachComment._id &&
                                editCommentId !== eachComment._id && (
                                  <div className={`${classes.floatRight} ${classes.cursorPointer} ${classes.inlineFlex}`}>
                                    <ActionMenu
                                      eachComment={eachComment}
                                      setEditCommentId={setEditCommentId}
                                      setEditComment={setEditComment}
                                      deleteComment={deleteComment}
                                    />
                                  </div>
                                )}
                            </>
                          )}
                        </div>
                        {!eachComment.isPinned && (
                          <>
                            {editCommentId !== eachComment._id ? (
                              <CommonCommentText users={users} eachComment={eachComment} />
                            ) : (
                              <div className={classes.border}>
                                <CommentField
                                  isEdit
                                  profilesInfo={profilesInfo}
                                  users={users}
                                  comment={editComment}
                                  showActions={showActions}
                                  setEditCommentId={setEditCommentId}
                                  setComment={setEditComment}
                                  upsertComment={updateComment}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}
                </Fragment>
              );
            })}
          </>
        ) : (
          <CircularProgress color="secondary"></CircularProgress>
        )}
      </div>
      {!editCommentId && (
        <div style={{ paddingBottom: "20px" }}>
          <Grid container>
            <Grid item xs={1}>
              <IconButton className={classes.commentView}>
                {profileImage ? <Avatar src={profileImage} size="38" round /> : <Avatar name={stateApp.user.name} size="38" round />}
              </IconButton>
            </Grid>
            <Grid item xs={11} className={classes.paddingLeft10}>
              <div
                className={classes.border}
                style={{ width: "calc(23vw)", paddingBottom: "20px", paddingRight: "13px" }}
                onClick={() => {
                  if (!showActions) {
                    setShowActions(true);
                  }
                }}
                onBlur={() => {
                  if (showActions && !comment) {
                    setShowActions(false);
                  }
                }}
              >
                <CommentField
                  profilesInfo={profilesInfo}
                  users={users}
                  comment={comment}
                  showActions={showActions}
                  setComment={setComment}
                  upsertComment={addNewComment}
                />
              </div>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}

const ActionMenu = ({ eachComment, setEditCommentId, setEditComment, deleteComment }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ExpandMoreIcon aria-controls={eachComment._id} aria-haspopup="true" onClick={handleClick} />
      <Menu
        style={{ zIndex: "1305" }}
        id={eachComment._id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem
          onClick={(event) => {
            setEditCommentId(eachComment._id);
            setEditComment(eachComment.comment);
            handleClose();
          }}
        >
          Edit Comment
        </MenuItem>
        <MenuItem textcolor="red" onClick={() => deleteComment(eachComment._id)}>
          Delete Comment
        </MenuItem>
      </Menu>
    </>
  );
};
