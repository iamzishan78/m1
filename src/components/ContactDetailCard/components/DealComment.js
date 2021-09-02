import React, { useState, useEffect, useContext } from "react";

import Avatar from "react-avatar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useMutation, useLazyQuery } from "@apollo/client";

import { AppContext } from "AppContext";
import { GET_PROFILE_IMAGE } from "graphQL/useQueryGetProfile";
import { GET_PROFILES_IMAGES } from "graphQL/useQueryGetProfile";
import { UPSERTCOMMENT } from "graphQL/useMutationUpsertComment";
import { COMMENTSBYOBJECTIDQUERY } from "graphQL/useQueryCommentsByObjectId";

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
}));

export default function DealComment(props) {
  const { targetSourceId } = props;
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);

  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [profilesInfo, setProfilesInfo] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [commentsArray, setCommentsArray] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  const [upsertComment] = useMutation(UPSERTCOMMENT);
  const [getProfileImage, profiledata] = useLazyQuery(GET_PROFILE_IMAGE);
  const [getProfilesImages, profilesData] = useLazyQuery(GET_PROFILES_IMAGES, {
    fetchPolicy: "cache-first",
  });
  const [getCommentsByObjectId, { data: dataComments }] = useLazyQuery(
    COMMENTSBYOBJECTIDQUERY,
    { fetchPolicy: "cache-and-network" }
  );

  useEffect(() => {
    setLoadingComments(true);
    getCommentsByObjectId({
      variables: {
        objectId: targetSourceId,
      },
    });
  }, [targetSourceId]);

  useEffect(() => {
    if (dataComments && dataComments.commentsByObjectId) {
      const emails = dataComments.commentsByObjectId.map(
        (comment) => comment.user.email
      );
      getProfilesImages({
        variables: { emails },
      });
      setCommentsArray(
        sortArrayBasedOnTs([
          ...dataComments.commentsByObjectId,
          // ...dataComments.commentsByObjectId,
          // ...dataComments.commentsByObjectId,
          // ...dataComments.commentsByObjectId,
        ])
      );
    }
    setLoadingComments(false);
  }, [dataComments]);

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
          .join("\n")}.`;

  const addNewComment = (value) => {
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

            {commentsArray.map((comment, index) => {
              let indexToShow =
                commentsArray.length > 3 ? commentsArray.length - 3 : 0;
              return (
                <>
                  {(showAllComments || index >= indexToShow) && (
                    <Grid key={index} container className={classes.gridStyle}>
                      <Grid item xs={1}>
                        <IconButton style={{ top: "3px" }}>
                          {profilesInfo[comment.user.email]?.profileImage ? (
                            <Avatar
                              src={
                                profilesInfo[comment.user.email].profileImage
                              }
                              size="38"
                              round
                            />
                          ) : (
                            <Avatar name={comment.user.name} size="38" round />
                          )}
                        </IconButton>
                      </Grid>
                      <Grid item xs={11} className={classes.paddingLeft10}>
                        <div>
                          <span className={classes.bold}>
                            {comment.user.name}
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
                                }).format(comment.ts)
                              )
                            }
                            locale="en-US"
                          />
                        </div>
                        <div
                          className={`${classes.whiteSpace} ${classes.bold}`}
                        >
                          {comment.comment}
                        </div>
                      </Grid>
                    </Grid>
                  )}
                </>
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
              <TextField
                margin="dense"
                variant="outlined"
                value={comment}
                fullWidth
                rows={showActions ? 2 : 1}
                rowsMax={3}
                multiline
                placeholder="Add a question or post an update"
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                InputProps={{
                  classes: { notchedOutline: classes.noBorder },
                }}
              />
              {showActions && (
                <Button
                  className={classes.commentBtn}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    addNewComment(comment);
                  }}
                >
                  Comment
                </Button>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
