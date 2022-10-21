import React, { useState, useEffect, useContext, Fragment } from "react";
import { get } from "lodash";
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
import { SizeMe } from 'react-sizeme'

import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import moment from "moment";
import DOMPurify from "dompurify";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#F6F8F9",
    "& .MuiFormControl-marginDense": {
      margin: "0px !important",
    },
  },
  comment: ({ commentsHeight }) => ({
    maxHeight: commentsHeight ?? "230px",
    overflow: "auto",
    padding: "5px 0px",
  }),
  noBorder: {
    border: "none",
  },
  border: {
    border: "1px solid #EBEBEB",
    background: "white",
    overflow: "auto",
  },
  commentBtn: {
    "float": "right",
    right: "10px",
    bottom: "10px",
    marginBottom: -20,
    background: "#24afdf",

  },
  paddingLeft10: {
    paddingLeft: "8px !important",
    paddingTop: "3px !important",

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
  commentTime: {
    marginLeft: "10px",
    fontSize: "12px",
  },
  floatRight: {
    "float": "right",
  },
  cursorPointer: {
    cursor: "pointer",
  },
  inlineFlex: {
    display: "inline-flex",
  },
  commentContent: {
    width: "84%",
    paddingRight: "10px"
  },
  commentTypeSection: {
    fontWeight: "bold",
    fontSize: "16px",
    display: "flex",
    marginBottom: "5px"
  }
}));

function urlify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.replace(urlRegex, function(url) {
    return '<a href="' + url + '">' + url + '</a>';
  })
}

export const CommonCommentText = ({ eachComment, users }) => {
  const classes = useStyles();
  let formatComment = (eachComment?.comment || '').split(" ")

  return (
    <div id={eachComment._id} className={`${classes.whiteSpace}`}>
      {get(eachComment, "commentType") && (
        <span className={classes.commentTypeSection}>
          {get(eachComment, "commentType.commentType", get(eachComment, "commentType"))}
        </span>
      )}
      {formatComment.map((word, index) => {
        if (word.includes("{{") && word.includes("}}")) {
          const splittedWord = word.split(/\r?\n/);

          // splitt word to manage new lines in the word
          if (splittedWord.length) {
            return (<>
              {splittedWord.map(sWord => {
                if (sWord.includes("{{") && sWord.includes("}}")) {
                  const firstPart = sWord.split("{{")[0];
                  const secondPart = sWord.split("}}")[1];
                  let id = sWord.split("{{")[1];
                  id = id.split("}}")[0];
                  return <> <span className="blue">{firstPart}@{users.find(user => user._id === id)?.name}{secondPart} </span>{splittedWord.length > 1 && <br />} </>
                }
                else return <span>{sWord} <br /> </span>;

              })}
            </>)
          }

          return <span>{splittedWord}</span>;
        } else {
          const sanitizedData = () => ({
            __html: DOMPurify.sanitize(urlify(word)),
          });
          return (
            <span dangerouslySetInnerHTML={sanitizedData()}>
            </span>
          );
        }
      })}
    </div >
  );
};

export default function CommentComponent(props) {
  const { targetSourceId, commentsHeight } = props;
  const classes = useStyles({ commentsHeight });
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
      if (props.activityLog && props.activityLog.length > 0) {
        let activittyData = [];
        props.activityLog.forEach(element => {
          activittyData.push({
            user: { name: element.ownerName, email: element.ownerName },
            activityData: element,
            comment: element.notes,
            ts: new Date(Number(element._ts)).getTime(),
            isActivity: true,
            isEdited: false,
            public: true,
            __typename: "Comment"
          })
        });
        let tempArray = dataComments.commentsByObjectId.concat(activittyData);
        setCommentsArray(
          sortArrayBasedOnTs([...tempArray])
        );
      } else {
        setCommentsArray(
          sortArrayBasedOnTs([...dataComments.commentsByObjectId])
        );
      }
    }
    setLoadingComments(false);
  }, [dataComments, props.activityLog]);

  useEffect(() => {
    setLoadingComments(false);
    if (!targetSourceId && newlyAddedComment?.upsertComment?.comment) {
      const comments = JSON.parse(JSON.stringify(commentsArray));
      comments.push({
        ...newlyAddedComment.upsertComment.comment,
        user: { name: stateApp.user.name, email: stateApp.user.email },
        isNew: true,
      });
      if (props.setNewCommentId)
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
          comment: typeof value === 'object' ? newCommentCleaner(value.comment) : newCommentCleaner(value),
          commentType: typeof value === 'object' ? (value.commentType || 'General') : 'General',
          user: stateApp.user.mongoId,
          commentedOn: targetSourceId,
          _id: editCommentId,
          objectType: props.targetLabel,
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
    const userDetails = stateApp.user
    setCommentsArray(state => {
      let newComment = {
        commentedOn: targetSourceId,
        isEdited: false,
        public: true,
        ts: Date.now(),
        user: { name: userDetails.name, email: userDetails.email, __typename: 'User' },
        __typename: "Comment",
        _id: "62e78820b4f930ae6002a7f2"
      }
      if (typeof value === 'object') {
        newComment = { ...value, ...newComment };
      } else {
        newComment['comment'] = value;
      }
      state.push(newComment)
      return state;
    });

    upsertComment({
      variables: {
        comment: {
          comment: typeof value === 'object' ? newCommentCleaner(value.comment) : newCommentCleaner(value),
          commentType: typeof value === 'object' ? (value.commentType || 'General') : 'General',
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
    <SizeMe>{({ size }) =>
      <div className={classes.container}>
        <div className={classes.comment} >
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
                        id="commentsArea"
                        container
                        className={classes.gridStyle}
                        onMouseOver={() => setShowCommentActionId(eachComment?._id)}
                        onMouseLeave={() => setShowCommentActionId(null)}
                      >
                        <Grid item style={{ maxWidth: "55px", padding: "0px" }}>
                          <IconButton>
                            {profilesInfo[eachComment?.user?.email]?.profileImage || eachComment.isNew ? (
                              <Avatar
                                src={eachComment.isNew ? profileImage : profilesInfo[eachComment?.user?.email].profileImage}
                                size="38"
                                round
                              />
                            ) : (
                              <Avatar name={eachComment?.user?.name} size="38" round />
                            )}
                          </IconButton>
                        </Grid>
                        <Grid item className={`${classes.paddingLeft10} ${classes.commentContent}`}>
                          <div>
                            <span className={classes.bold}>{eachComment?.user?.name}</span>
                            {<ReactTimeAgo className={classes.commentTime} date={new Date(Number(eachComment.ts))} locale="en-US" />}
                            {eachComment.isEdited && <span className={classes.commentTime}>(Edited)</span>}
                            {eachComment?.user?.email === stateApp.user.email &&
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
          <div style={{ paddingBottom: '20px' }}>
            <Grid container>
              <Grid item style={{ maxWidth: "55px" }}>
                <IconButton className={classes.commentView}
                // style={{ top: "3px" }}
                >
                  {profileImage ? (
                    <Avatar src={profileImage} size="38" round />
                  ) : (
                    <Avatar name={stateApp.user.name} size="38" round />
                  )}
                </IconButton>
              </Grid>
              <Grid item className={`${classes.paddingLeft10} ${classes.commentContent}`}>
                <SizeMe>{({ size }) =>
                  <div
                    className={classes.border}
                    style={{ paddingBottom: '20px' }}
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
                      showCommentType={props.showCommentType}
                    // fieldWidth={`${size - 23}px`}
                    />

                  </div>
                }</SizeMe>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    }</SizeMe >
  );
}

export const CommentText = ({ eachComment, users }) => {
  const classes = useStyles();
  let formatComment = (eachComment?.comment || '').split(" ")

  return (
    <div id={eachComment._id} className={`${classes.whiteSpace}`}>
      {formatComment.map((word, index) => {
        if (word.includes("{{") && word.includes("}}")) {
          const splittedWord = word.split(/\r?\n/);

          // splitt word to manage new lines in the word
          if (splittedWord.length) {
            return (<>
              {splittedWord.map(sWord => {
                if (sWord.includes("{{") && sWord.includes("}}")) {
                  const firstPart = sWord.split("{{")[0];
                  const secondPart = sWord.split("}}")[1];
                  let id = sWord.split("{{")[1];
                  id = id.split("}}")[0];
                  return <span className="blue">{firstPart}@{users.find(user => user._id === id)?.name}{secondPart} </span>
                }
                else if (sWord === "")
                  return <br />
                else return <span>{sWord} <br /> </span>;

              })}
            </>)
          }

          return <span>{splittedWord}</span>;
        } else {
          return <span>{word} </span>;
        }
      })}
    </div >
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
        id="expandIcon"
        aria-controls={eachComment._id}
        aria-haspopup="true"
        onClick={handleClick}
      />
      <Menu
        style={{ zIndex: '1305' }}
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
        <MenuItem
          textcolor="red"
          onClick={() => deleteComment(eachComment._id)}
          id="deleteComment"
        >
          Delete Comment
        </MenuItem>
      </Menu>
    </>
  );
};
