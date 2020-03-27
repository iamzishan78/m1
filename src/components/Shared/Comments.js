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
import { COMMENTSBYOBJECTIDQUERY } from "../../graphQL/useQueryCommentsByObjectId";
import { UPSERTCOMMENT } from "../../graphQL/useMutationUpsertComment";
import { REMOVECOMMENT } from "../../graphQL/useMutationRemoveComment";
import Grid from "@material-ui/core/Grid";
import { USERBYEMAIL } from "../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed

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
    "& .MuiTypography-body2": { fontSize: "0.7rem" },
    "&  p": {
      margin: "0"
    }
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
  const [stateApp] = useContext(AppContext);
  const [commentsArray, setCommentsArray] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [emptyInput, setEmptyInput] = useState(false);

  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL); //////////////temporary while signed user fixed

  const [getCommentsByObjectId, { data: dataComments }] = useLazyQuery(
    COMMENTSBYOBJECTIDQUERY
  );
  const [upsertComment] = useMutation(UPSERTCOMMENT);
  const [removeComment] = useMutation(REMOVECOMMENT);

  //////begin////////temporary  while signed user fixed

  const [user, setUser] = useState({ _id: "" });

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.email) {
      getUserByEmail({
        variables: {
          userEmail: stateApp.user.email
        }
      });
    }
  }, [stateApp.user.email]);

  useEffect(() => {
    if (dataUser && dataUser.userByEmail) {
      setUser(dataUser.userByEmail);
    }
    setLoadingComments(false);
  }, [dataUser]);

  /////end/////////temporary while signed user fixed

  ///////////////////// START FETCHING COMMENTS DATA ////////////////////////////////////////////

  useEffect(() => {
    setLoadingComments(true);
    getCommentsByObjectId({
      variables: {
        objectId: props.targetSourceId
      }
    });
  }, [props.targetSourceId]);

  useEffect(() => {
    if (dataComments && dataComments.commentsByObjectId) {
      setCommentsArray(dataComments.commentsByObjectId);
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
      upsertComment({
        variables: {
          comment: {
            comment:
              event.target.value.trim()[
                event.target.value.trim().length - 1
              ] === "."
                ? event.target.value
                    .split("\n")
                    .map(line => {
                      return line.trim();
                    })
                    .join("\n")
                : `${event.target.value
                    .split("\n")
                    .map(line => {
                      return line.trim();
                    })
                    .join("\n")}.`,
            user: user._id, //////stateApp.user._id////////temporary while signed user fixed
            commentedOn: props.targetSourceId
          }
        },
        refetchQueries: ["getCommentsByObjectId"],
        awaitRefetchQueries: true
      });

      setEmptyInput(false);
    } else {
      setEmptyInput(true);
    }
    setTextValue("");
  };

  ///////////////////// DELETING A COMMENT ///////////////////////////////////////////////

  const handleDeleteClick = comment => {
    removeComment({
      variables: {
        commentId: comment._id
      },
      refetchQueries: ["getCommentsByObjectId"],
      awaitRefetchQueries: true
    });
  };

  ////////////////////////////////////////////////////////////////////////////////////////

  const compare = (a, b) => {
    if (a.ts > b.ts) return -1;
    if (b.ts > a.ts) return 1;

    return 0;
  };
  commentsArray.sort(compare);

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    if (props.focus) {
      document.getElementById("commentInput").focus();
    }
  }, [props.focus]);

  return (
    <Card className={classes.root} variant="outlined">
      {/* <CardHeader className={classes.header} title="Comments" /> */}
      <CardActions>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              className={`${classes.textInput} ${
                emptyInput ? classes.emptyInput : ""
              }`}
              id="commentInput"
              variant="outlined"
              label="Comments"
              multiline
              rows="4"
              onChange={e => {
                if (e.target.value[e.target.value.length - 1] !== `\\`) {
                  if (e.target.value[e.target.value.length - 1] !== `\n`) {
                    setTextValue(
                      e.target.value
                        .split("\n")
                        .map(line => {
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
            {commentsArray.map(comment => (
              <ListItem
                key={comment._id}
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
                  secondary={`${comment.user.name} - ${new Intl.DateTimeFormat(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    }
                  ).format(comment.ts)}`}
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
