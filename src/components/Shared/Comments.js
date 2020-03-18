import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "react-avatar";
import Typography from "@material-ui/core/Typography";
import { CircularProgress } from "@material-ui/core";
import { AppContext } from "../../AppContext";
import { COMMENTSQUERY } from "../../graphQL/useQueryComments";
import { USERPARENTCOMMENTSQUERY } from "../../graphQL/useQueryUserParentComments";
import { UPSERTCOMMENT } from "../../graphQL/useMutationUpsertComment";
import { EDGEQUERY } from "../../graphQL/useMutationCreateEdge";
import { DROPEDGEQUERY } from "../../graphQL/useMutationDropEdge";

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
    upsertComment({ variables: { comment: { comment: event.target.value } } });
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

  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader className={classes.header} title="Comments" />
      <CardActions>
        <TextField
          className={classes.textInput}
          id="outlined-input"
          // label="Comment"
          variant="outlined"
          multiline
          rows="5"
          onChange={e => {
            setTextValue(e.target.value);
          }}
          value={textValue}
          onKeyDown={event => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleEnteringComment(event);
            }
          }}
        />
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
                  secondary={stateApp.user.name}
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
