import React, { useContext, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "react-avatar";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { CircularProgress } from "@material-ui/core";
import { AppContext } from "../../AppContext";
import { COMMENTSBYOBJECTIDQUERY } from "../../graphQL/useQueryCommentsByObjectId";
import { COMMENTSBYOBJECTSIDS } from "../../graphQL/useQueryCommentsByObjectsIds";
import { UPSERTCOMMENT } from "../../graphQL/useMutationUpsertComment";
import { REMOVECOMMENT } from "../../graphQL/useMutationRemoveComment";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#12ABE0",
        borderColor: "#12ABE0",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "#fff",
  },
  title: {
    fontSize: 10,
  },
  pos: {
    marginBottom: 12,
  },
  content: {
    height: "100%",
    padding: "0",
    padding: (props) =>
      props.detailCard
        ? "0 23px 0 23px"
        : props.handleRightDialogClose
        ? "0 0 0 8px"
        : "0",
    overflowY: "auto",
    maxHeight: (props) => (props.handleRightDialogClose ? "none" : "60vh"),
  },
  list: {
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0)",
    color: "rgba(23, 170, 221, 1)",
    overflowY: "auto",
    padding: 0,
  },
  listItem: {
    fontFamily: "Poppins",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.black,
    },
    "& .MuiListItemText-secondary": {
      color: "rgba(23, 170, 221, 1)",
    },
  },
  textInput: {
    width: "100%",
    backgroundColor: "#fff",
  },
  header: {
    paddingBottom: "0",
    "& .MuiTypography-h5": { fontSize: "1.2rem " },
  },
  listItemText: {
    "& .MuiTypography-body1": { fontSize: "0.85rem" },
    "& .MuiTypography-body2": { fontSize: "0.7rem" },
    "&  p": {
      margin: "0",
    },
  },
  avatar: {
    minWidth: "50px",
  },
  foodText: {
    fontSize: "10px",
    color: "#6e6e6e",
    margin: "0",
    textAlign: "right",
    float: "right",
    marginLeft: "10px",
    "& span": {
      fontWeight: "bold",
    },
    "& .redColor": {
      color: "rgb(240, 89, 89) !important",
    },
  },
  emptyInput: {
    "& fieldset": {
      borderColor: "rgb(240, 89, 89) !important",
    },
  },
  switchButtom: {
    float: "right",
    alignSelf: "flex-end",
    marginRight: 0,
    "& span.MuiTypography-body1": {
      fontSize: "0.9rem",
    },
  },
  switchTextDeselected: {
    color: "rgb(141, 141, 141)",
  },
  viewAll: {
    textDecoration: "underline",
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  closeIcon: {
    color: theme.palette.secondary.main,
  },
  sharedCommentLabel: {
    width: "fit-content",
    margin: "0",
    float: "left",
    color: "#757575",
    fontWeight: "normal",
  },
  nameAndDateLine: {
    color: "rgb(176, 176, 176)",
    margin: "0",
    fontWeight: "normal",
  },
  deleteLine: {
    textDecoration: "underline",
    color: "#757575",
    margin: "0",
    fontWeight: "normal",
    "&:hover": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
}));

export default function Comments(props) {
  //// props.detailCard - to show a version for a detail card ////
  const [stateApp] = useContext(AppContext);
  const [commentsArray, setCommentsArray] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [emptyInput, setEmptyInput] = useState(false);
  const [publicComment, setPublicComment] = useState(true);
  const classes = useStyles({
    ...props,
    commentsArrayLength: commentsArray.length,
  });

  const [getCommentsByObjectId, { data: dataComments }] = useLazyQuery(
    COMMENTSBYOBJECTIDQUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [
    getCommentsByObjectsIds,
    { data: dataCommentsMultiIds },
  ] = useLazyQuery(COMMENTSBYOBJECTSIDS, {
    fetchPolicy: "cache-and-network",
  });

  const [upsertComment] = useMutation(UPSERTCOMMENT);
  const [removeComment] = useMutation(REMOVECOMMENT);

  ///////////////////// START FETCHING COMMENTS DATA ////////////////////////////////////////////

  useEffect(() => {
    setLoadingComments(true);
    if (!props.multipleIds) {
      getCommentsByObjectId({
        variables: {
          objectId: props.targetSourceId,
        },
      });
    } else {
      getCommentsByObjectsIds({
        variables: {
          objectsIdsArray: props.multipleIds,
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [props.targetSourceId, props.multipleIds]);

  useEffect(() => {
    if (dataComments && dataComments.commentsByObjectId) {
      setCommentsArray(dataComments.commentsByObjectId);
    }
    setLoadingComments(false);
  }, [dataComments]);

  useEffect(() => {
    if (dataCommentsMultiIds && dataCommentsMultiIds.commentsByObjectsIds) {
      const checkIfUserMatch = (user) => {
        for (let i = 0; i < user.length; i++) {
          if (user[i]._id !== stateApp.user.mongoId) return false;
        }
        return user[0];
      };

      let comments = [];
      for (
        let i = 0;
        i < dataCommentsMultiIds.commentsByObjectsIds.length;
        i++
      ) {
        const element = dataCommentsMultiIds.commentsByObjectsIds[i];
        if (
          element.commentedOn.length === props.multipleIds.length &&
          element.public.filter((v) => v === publicComment).length ===
            props.multipleIds.length
        ) {
          comments.push({
            ...element,
            user: checkIfUserMatch(element.user)
              ? checkIfUserMatch(element.user)
              : { name: "", email: "" },
            public: publicComment,
          });
        }
      }

      setCommentsArray(comments);
    }
    setLoadingComments(false);
  }, [dataCommentsMultiIds, publicComment]);

  ///////////////////// INSERTING NEW COMMENT ///////////////////////////////////////////////

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

  const addNewComent = (value, commentedOn) => {
    upsertComment({
      variables: {
        comment: {
          comment: newCommentCleaner(value),
          public: publicComment,
          user: stateApp.user.mongoId,
          commentedOn,
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
  };

  const handleEnteringComment = (event) => {
    event.persist();
    if (
      event.target.value.split("\n").join("").trim() !== "" &&
      event.target.value.split("\n").join("").trim() !== "."
    ) {
      if (!props.multipleIds) {
        addNewComent(event.target.value, props.targetSourceId);
      } else {
        for (let i = 0; i < props.multipleIds.length; i++) {
          addNewComent(event.target.value, props.multipleIds[i]);
        }

        // //// adding the new comment to the down list
        // setCommentsArray((commentsArray) => [
        //   ...commentsArray,
        //   {
        //     ts: Date.now(),
        //     public: publicComment,
        //     user: { name: stateApp.user.name, email: stateApp.user.email },
        //     comment: newCommentCleaner(event.target.value),
        //   },
        // ]);
      }
      setEmptyInput(false);
    } else {
      setEmptyInput(true);
    }
    setTextValue("");
  };

  ///////////////////// DELETING A COMMENT ///////////////////////////////////////////////

  const handleDeleteClick = (comment) => {
    if (!props.multipleIds)
      removeComment({
        variables: {
          commentId: comment._id,
        },
        refetchQueries: [
          "getCommentsByObjectId",
          "getCommentsCounter",
          "getCommentsByObjectsIds",
        ],
        awaitRefetchQueries: true,
      });
    else {
      for (let i = 0; i < comment.ids.length; i++) {
        removeComment({
          variables: {
            commentId: comment.ids[i],
          },
          refetchQueries: [
            "getCommentsByObjectId",
            "getCommentsCounter",
            "getCommentsByObjectsIds",
          ],
          awaitRefetchQueries: true,
        });
      }
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////

  const textFieldHandleChange = (e) => {
    if (e.target.value[e.target.value.length - 1] !== `\\`) {
      if (e.target.value[e.target.value.length - 1] !== `\n`) {
        setTextValue(
          e.target.value
            .split("\n")
            .map((line) => {
              return capitalizeFirstLetter(line);
            })
            .join("\n")
        );
      } else {
        if (e.target.value[e.target.value.length - 2] !== `\n`) {
          setTextValue(`${textValue}.\n`);
        }
      }
    }
    if (e.target.value.split("\n").join("").trim() !== "" && emptyInput) {
      setEmptyInput(false);
    }
  };

  const compare = (a, b) => {
    if (a.ts > b.ts) return -1;
    if (b.ts > a.ts) return 1;

    return 0;
  };

  if (!props.multipleIds) commentsArray.sort(compare);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    if (props.focus) {
      document.getElementById("commentInput").focus();
    }
  }, [props.focus]);

  let commentsDisplayedCount = 0;

  return (
    <Card
      className={classes.root}
      variant="outlined"
      style={
        props.detailCard
          ? { backgroundColor: "transparent", border: "none" }
          : {}
      }
    >
      {/* <CardHeader className={classes.header} title="Comments" /> */}

      <CardActions
        style={
          props.detailCard || props.handleRightDialogClose
            ? {
                padding: "23px 23px 8px 23px",
              }
            : {}
        }
      >
        <Grid container>
          {(props.detailCard || props.handleRightDialogClose) && (
            <Grid item xs={12} style={{ minHeight: "35px" }}>
              <h4 style={{ margin: "0 0 8px 0", float: "left" }}>
                Recent Comments
              </h4>
              {props.viewAll ? (
                <h4
                  className={classes.viewAll}
                  onClick={(e) => {
                    e.preventDefault();
                    props.viewAll("comments");
                  }}
                >
                  View All
                </h4>
              ) : (
                <IconButton
                  onClick={(e) => {
                    if (props.handleRightDialogClose)
                      props.handleRightDialogClose(e);
                  }}
                  size="small"
                  style={{ float: "right", top: "-5px", right: "-5px" }}
                >
                  <CloseIcon className={classes.closeIcon} fontSize="small" />
                </IconButton>
              )}
            </Grid>
          )}
          <Grid item xs={12} style={{ marginBottom: "8px" }}>
            <FormGroup style={{ display: "block" }}>
              {(props.detailCard || props.handleRightDialogClose) && (
                <h4 className={classes.sharedCommentLabel}>Share comments</h4>
              )}
              <FormControlLabel
                className={`${classes.switchButtom} ${
                  !publicComment ? classes.switchTextDeselected : ""
                }`}
                control={
                  <React.Fragment>
                    <AntSwitch
                      checked={publicComment}
                      onChange={() => {
                        setPublicComment(!publicComment);
                      }}
                      name="checkedC"
                    />
                  </React.Fragment>
                }
                label={
                  !props.detailCard && !props.handleRightDialogClose
                    ? "Shared"
                    : ""
                }
                labelPlacement="start"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={`${classes.textInput} ${
                emptyInput ? classes.emptyInput : ""
              }`}
              id="commentInput"
              variant="outlined"
              label={
                props.detailCard || props.handleRightDialogClose
                  ? null
                  : "Comments"
              }
              placeholder={
                props.detailCard || props.handleRightDialogClose
                  ? "Add Comments"
                  : null
              }
              multiline
              rows="4"
              onChange={(e) => {
                textFieldHandleChange(e);
              }}
              value={textValue}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleEnteringComment(event);
                }
              }}
              onBlur={() => {
                setEmptyInput(false);
              }}
            />
          </Grid>
          {!emptyInput ? (
            <Grid item xs={12}>
              <p className={classes.foodText}>
                <span>Shift+Return</span> to add a new line
              </p>
              <p className={classes.foodText}>
                <span>Return</span> to save
              </p>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <p className={classes.foodText}>
                <span className="redColor">Required Field </span>
              </p>
            </Grid>
          )}
        </Grid>
      </CardActions>
      <CardContent
        className={classes.content}
        style={{
          paddingBottom:
            props.detailCard && commentsArray.length > 0 ? "23px" : "0",
          height: props.handleRightDialogClose ? "calc(100vh - 218px)" : null,
        }}
      >
        {!loadingComments ? (
          <List className={classes.list}>
            {commentsArray.map((comment, index) =>
              props.detailCard
                ? ((publicComment && comment.public) ||
                    (!publicComment &&
                      stateApp.user.email === comment.user.email &&
                      !comment.public)) &&
                  (commentsDisplayedCount += 1) &&
                  (props.top && props.top < commentsDisplayedCount ? null : (
                    //// ListItem ////
                    <>
                      {commentsDisplayedCount !== 1 && (
                        <Divider
                          style={{
                            marginTop: "13px",
                            marginBottom: "13px",
                          }}
                        />
                      )}
                      {/* //// name and date line //// */}
                      <h5 className={classes.nameAndDateLine}>{`${
                        comment.user.name
                      } · ${new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(comment.ts)}`}</h5>

                      {/* //// comment line //// */}
                      <div style={{ marginTop: "7px", marginBottom: "7px" }}>
                        {comment.comment.split("\n").map((line, i) => {
                          return (
                            <p
                              key={i}
                              style={{
                                color: "#757575",
                                margin: "0",
                              }}
                            >
                              {line}
                            </p>
                          );
                        })}
                      </div>

                      {/* //// delete line //// */}
                      <h5
                        className={classes.deleteLine}
                        onClick={() => handleDeleteClick(comment)}
                      >
                        Delete
                      </h5>
                    </>
                  ))
                : //// ListItem  End ////
                  ((publicComment && comment.public) ||
                    (!publicComment &&
                      stateApp.user.email === comment.user.email &&
                      !comment.public)) && (
                    <ListItem
                      key={index}
                      className={classes.listItem}
                      alignItems="flex-start"
                    >
                      <ListItemAvatar className={classes.avatar}>
                        <Avatar name={comment.user.name} size="35" round />
                      </ListItemAvatar>
                      <ListItemText
                        className={classes.listItemText}
                        primary={
                          <React.Fragment>
                            {comment.comment.split("\n").map((line, i) => {
                              return <p key={i}>{line}</p>;
                            })}
                          </React.Fragment>
                        }
                        secondary={
                          `${comment.user.name}` +
                          (comment.ids
                            ? ""
                            : ` - ${new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(comment.ts)}`)
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteClick(comment)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
            )}
          </List>
        ) : (
          <CircularProgress color="secondary"></CircularProgress>
        )}
      </CardContent>
    </Card>
  );
}
