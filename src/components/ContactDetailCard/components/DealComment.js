import React, { useState, useEffect, useContext, Fragment } from "react";

import Avatar from "react-avatar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
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
    right: "5px",
    bottom: "5px",
  },
  paddingLeft10: {
    paddingLeft: "10px !important",
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
    padding: "5px 10px",
    marginRight: "60px",
    marginBottom: "10px",
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
}));

export default function DealComment(props) {
  const { targetSourceId } = props;
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
  const [upsertComment, { data: newlyAddedComment }] =
    useMutation(UPSERTCOMMENT);
  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: "cache-and-network",
  });
  const [getProfileImage, profiledata] = useLazyQuery(GET_PROFILE_IMAGE);
  const [getProfilesImages, profilesData] = useLazyQuery(GET_PROFILES_IMAGES, {
    fetchPolicy: "cache-first",
  });
  const [getCommentsByObjectId, { data: dataComments }] = useLazyQuery(
    COMMENTSBYOBJECTIDQUERY,
    { fetchPolicy: "no-cache" }
  );

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
      setCommentsArray(
        sortArrayBasedOnTs([...dataComments.commentsByObjectId])
      );
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
    if (
      profiledata &&
      profiledata.data &&
      profiledata.data.profileByEmail &&
      profiledata.data.profileByEmail.profile
    ) {
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
          comment: newCommentCleaner(value),
          user: stateApp.user.mongoId,
          _id: editCommentId,
          isEdited: true,
        },
      },
      refetchQueries: [
        "getCommentsByObjectId",
        "getCommentsCounter",
        "getCommentsByObjectsIds",
      ],
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
      refetchQueries: [
        "getCommentsByObjectId",
        "getCommentsCounter",
        "getCommentsByObjectsIds",
      ],
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
          comment: newCommentCleaner(value),
          public: true,
          user: stateApp.user.mongoId,
          commentedOn: targetSourceId,
          objectType: props.targetLabel,
        },
      },
      refetchQueries: [
        "getCommentsByObjectId",
        "getCommentsCounter",
        "getCommentsByObjectsIds",
      ],
      awaitRefetchQueries: true,
    });
    setShowActions(false);
    setComment("");
  };

  const getCount = () => {
    let indexToShow = commentsArray.length > 3 ? commentsArray.length - 3 : 0;
    return indexToShow;
  };

  return (
    <div className={classes.container}>
      <div className={classes.comment}>
        {!loadingComments ? (
          <>
            {!showAllComments && commentsArray.length > 3 && (
              <div className={classes.moreComment}>
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
              <div className={classes.moreComment}>
                <span onClick={() => setShowAllComments(false)}>
                  Hide Earlier Comments
                </span>
              </div>
            )}

            {commentsArray.map((eachComment, index) => {
              let indexToShow =
                commentsArray.length > 3 ? commentsArray.length - 3 : 0;
              return (
                <Fragment key={index}>
                  {(showAllComments || index >= indexToShow) && (
                    <Grid
                      container
                      className={classes.gridStyle}
                      onMouseOver={() =>
                        setShowCommentActionId(eachComment._id)
                      }
                      onMouseLeave={() => setShowCommentActionId(null)}
                    >
                      <Grid item xs={1}>
                        <IconButton style={{ top: "3px" }}>
                          {profilesInfo[eachComment.user.email]?.profileImage ||
                          eachComment.isNew ? (
                            <Avatar
                              src={
                                eachComment.isNew
                                  ? profileImage
                                  : profilesInfo[eachComment.user.email]
                                      .profileImage
                              }
                              size="38"
                              round
                            />
                          ) : (
                            <Avatar
                              name={eachComment.user.name}
                              size="38"
                              round
                            />
                          )}
                        </IconButton>
                      </Grid>
                      <Grid item xs={11} className={classes.paddingLeft10}>
                        <div>
                          <span className={classes.bold}>
                            {eachComment.user.name}
                          </span>
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
                                }).format(eachComment.ts)
                              )
                            }
                            locale="en-US"
                          />
                          {eachComment.isEdited && (
                            <span className={classes.commentTime}>
                              (Edited)
                            </span>
                          )}
                          {eachComment.user.email === stateApp.user.email &&
                            showCommentActionId === eachComment._id &&
                            editCommentId !== eachComment._id && (
                              <div
                                className={`${classes.floatRight} ${classes.cursorPointer} ${classes.inlineFlex}`}
                              >
                                <ActionMenu
                                  eachComment={eachComment}
                                  setEditCommentId={setEditCommentId}
                                  setEditComment={setEditComment}
                                  deleteComment={deleteComment}
                                />
                              </div>
                            )}
                        </div>
                        {editCommentId !== eachComment._id ? (
                          <CommentText users={users} eachComment={eachComment} />
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
      <div className={classes.commentView}>
        <Grid container>
          <Grid item xs={1}>
            <IconButton style={{ top: "3px" }}>
              {profileImage ? (
                <Avatar src={profileImage} size="38" round />
              ) : (
                <Avatar name={stateApp.user.name} size="38" round />
              )}
            </IconButton>
          </Grid>
          <Grid item xs={11} className={classes.paddingLeft10}>
            <div
              className={classes.border}
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
    </div>
  );
}

const CommentText = ({ eachComment, users }) => {
  const classes = useStyles();
  return (
    <div id={eachComment._id} className={`${classes.whiteSpace}`}>
      {eachComment.comment.split(" ").map((word) => {
        if (word.includes("{{") && word.includes("}}")) {
          const firstPart = word.split("{{")[0];
          const secondPart = word.split("}}")[1];
          let id = word.split("{{")[1];
          id = id.split("}}")[0];
          return <span className="blue">{firstPart}@{users.find(user => user._id === id).name}{secondPart} </span>
        } else {
          return <span>{word} </span>;
        }
      })}
    </div>
  );
};

const ActionMenu = ({
  eachComment,
  setEditCommentId,
  setEditComment,
  deleteComment,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ExpandMoreIcon
        aria-controls={eachComment._id}
        aria-haspopup="true"
        onClick={handleClick}
      />
      <Menu
        id={eachComment._id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
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
        <MenuItem
          textcolor="red"
          onClick={() => deleteComment(eachComment._id)}
        >
          Delete Comment
        </MenuItem>
      </Menu>
    </>
  );
};
