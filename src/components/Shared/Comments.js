import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
import { CircularProgress } from "@material-ui/core";
import { AppContext } from "../../AppContext";
import { COMMENTSQUERY } from "../../graphQL/useQueryComments";
import { USERPARENTCOMMENTSQUERY } from "../../graphQL/useQueryUserParentComments";
import { UPSERTCOMMENT } from "../../graphQL/useMutationUpsertComment";
import { EDGEQUERY } from "../../graphQL/useMutationCreateEdge";
import { DROPEDGEQUERY } from "../../graphQL/useMutationDropEdge";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 10
  },
  pos: {
    marginBottom: 12
  },
  content: {
    height: "100%",
    backgroundColor: "white",
    padding: "0 !important"
  },
  list: {
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0)",
    color: "rgba(23, 170, 221, 1)",
    overflowY: "auto",
    padding: 0
  },
  listItem: {
    fontFamily: "Poppins",
    /* '&:hover': {
      background: '#4B618F'
    }, */
    backgroundColor: "white",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.black
    },
    "& .MuiListItemText-secondary": {
      color: "rgba(23, 170, 221, 1)"
    }
  },
  textInput: {
    width: "100%"
  },
  header: {
    paddingBottom: "0",
    "& .MuiTypography-h5": { fontSize: "1.2rem " }
  },
  listItemText: {
    "& .MuiTypography-body1": { fontSize: "0.85rem" },
    "& .MuiTypography-body2": { fontSize: "0.7rem" }
  },
  avatar: {
    minWidth: "50px"
  },
  foodText: {
    fontSize: "10px",
    color: "#6e6e6e",
    margin: "0",
    textAlign: "right",
    float: "right",
    marginLeft: "10px",
    "& span": {
      fontWeight: "bold"
    },
    "& .redColor": {
      color: "rgb(240, 89, 89) !important"
    }
  },
  emptyInput: {
    "& fieldset": {
      borderColor: "rgb(240, 89, 89) !important"
    }
  }
}));

export default function Comments(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [commentsArray, setCommentsArray] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [sourceVertex, setSourceVertex] = useState(null);
  const [targetVertex, setTargetVertex] = useState(null);
  const [commentVertex, setCommentVertex] = useState(null);
  const [dropTag, setDropTag] = useState(null);
  const [emptyInput, setEmptyInput] = useState(false);

  const [
    getComments,
    { loading: loadingCommentsData, data: dataComments }
  ] = useLazyQuery(COMMENTSQUERY);
  const [
    getUserParentComments,
    { loading: loadingUserParentComments, data: dataUserParentComments }
  ] = useLazyQuery(USERPARENTCOMMENTSQUERY);

  const [
    upsertComment,
    {
      data: dataUpsertComment,
      loading: loadingUpsertComment,
      errorUpsertComment
    }
  ] = useMutation(UPSERTCOMMENT);
  const [createGraphEdge, { data, loading, error }] = useMutation(EDGEQUERY);
  const [
    dropGraphEdge,
    { data: dataDrop, loading: loadingDrop, errorDrop }
  ] = useMutation(DROPEDGEQUERY);

  useEffect(() => {
    setTargetVertex({
      sourceId: props.targetSourceId,
      label: props.targetLabel,
      name: props.targetName,
      type: "vertex",
      properties: []
    });
  }, [props.targetSourceId, props.targetLabel, props.targetName]);

  ///////////////////// START FETCHING COMMENTS DATA ////////////////////////////////////////////

  //////Fetching all comments[ids] related to a logged user and a target object
  useEffect(() => {
    setLoadingComments(true);
    getUserParentComments({
      variables: {
        sourceSourceId: stateApp.user.id,
        targetSourceId: props.targetSourceId
      }
    });
    setSourceVertex({
      sourceId: stateApp.user.id,
      label: "user",
      name: stateApp.user.name,
      type: "vertex",
      properties: []
    });
  }, []);

  //////Fetching the comments info in SQL cosmos from [ids]
  useEffect(() => {
    if (dataUserParentComments && dataUserParentComments.userParentComments) {
      getComments({
        variables: {
          commentIdArray: dataUserParentComments.userParentComments
        }
      });
    } else {
      setLoadingComments(false);
      setCommentsArray([]);
    }
  }, [dataUserParentComments]);

  ///////Setting the comments array
  useEffect(() => {
    if (dataComments && dataComments.comments) {
      setCommentsArray(dataComments.comments.reverse());
    }
    setLoadingComments(false);
  }, [dataComments]);

  ///////////////////// INSERTING NEW COMMENTS ///////////////////////////////////////////////

  const handleEnteringComment = event => {
    if (
      event.target.value
        .split("\n")
        .join("")
        .trim() !== ""
    ) {
      upsertComment({ variables: { comment: { comment: event.target.value } } });
      setEmptyInput(false);
    } else {
      setEmptyInput(true);
    }
    setTextValue("");
  };

  ///////after new comment is upserted set CommentVertex
  useEffect(() => {
    if (dataUpsertComment) {
      setCommentVertex({
        sourceId: dataUpsertComment.upsertComment.comment.id,
        label: "comment",
        name: dataUpsertComment.upsertComment.comment.comment,
        type: "vertex",
        properties: []
      });
    }
  }, [dataUpsertComment]);

  ////to create edges between user-comment-targetObject
  const createEdgeAsyncAwait = async (
    sourceVertex,
    commentVertex,
    targetVertex
  ) => {
    await createGraphEdge({
      variables: {
        source: sourceVertex,
        target: commentVertex,
        relationshipLabel: "createdComment"
      }
    });

    await createGraphEdge({
      variables: {
        source: commentVertex,
        target: targetVertex,
        relationshipLabel: "commentedOn"
      },
      refetchQueries: ["getUserParentComments"],
      awaitRefetchQueries: true
    });
  };

  ///////after new commentVertex is set create edges
  useEffect(() => {
    if (!dropTag) {
      if (commentVertex && sourceVertex && targetVertex) {
        createEdgeAsyncAwait(sourceVertex, commentVertex, targetVertex);
      }
    }
  }, [commentVertex]);

  ///////////////////// DELETING A COMMENT ///////////////////////////////////////////////

  const handleDeleteClick = comment => {};

  ////////////////////////////////////////////////////////////////////////////////////////

  const compare = (a, b) => {
    if (a._ts > b._ts) return -1;
    if (b._ts > a._ts) return 1;

    return 0;
  };
  commentsArray.sort(compare);

  useEffect(() => {
    if (props.focus) {
      document.getElementById("commentInput").focus();
    }
  }, [props.focus]);

  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader className={classes.header} title="Comments" />
      <CardActions>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              className={`${classes.textInput} ${
                emptyInput ? classes.emptyInput : ""
              }`}
              id="commentInput"
              // label="Comment"
              variant="outlined"
              multiline
              rows="4"
              onChange={e => {
                setTextValue(e.target.value);
                if (
                  e.target.value
                    .split("\n")
                    .join("")
                    .trim() !== "" &&
                  emptyInput
                ) {
                  setEmptyInput(false);
                }
              }}
              value={textValue}
              onKeyDown={event => {
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
                <span>Return</span> to send
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
      <CardContent className={classes.content}>
        {!loadingComments ? (
          <List className={classes.list}>
            {commentsArray.map((comment, index) => (
              <ListItem
                key={comment.id}
                className={classes.listItem}
                alignItems="flex-start"
              >
                <ListItemAvatar className={classes.avatar}>
                  <Avatar name={stateApp.user.name} size="35" round />
                </ListItemAvatar>
                <ListItemText
                  className={classes.listItemText}
                  primary={comment.comment}
                  secondary={`${stateApp.user.name} - ${new Intl.DateTimeFormat(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    }
                  ).format(comment._ts)}`}
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
            ))}
          </List>
        ) : (
          <CircularProgress color="secondary"></CircularProgress>
        )}
      </CardContent>
    </Card>
  );
}
