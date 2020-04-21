import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useLazyQuery } from "@apollo/react-hooks";
import { USERBYEMAIL } from "../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import ChatIcon from "@material-ui/icons/Chat";
import Comments from "./Comments";
import Dialog from "@material-ui/core/Dialog";
import { COMMENTSCOUNTER } from "../../graphQL/useQueryCommentsCounter";

export default function CommentsWithIcon(props) {
  const [stateApp] = useContext(AppContext);
  const [commentsCounter, setCommentsCounter] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const useStyles = makeStyles((theme) => ({
    icons: {
      color: "#ffffff",
      marginLeft: "auto",
      "&:hover": {
        backgroundColor: "#031d40",
      },
    },
    iconSelected: {
      color: theme.palette.secondary.main,
    },
    tagsDiv: {
      margin: "8px",
    },
  }));
  const classes = useStyles();

  const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(
    COMMENTSCOUNTER
  );

  //////begin////////temporary  while signed user fixed

  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);
  const [user, setUser] = useState({ _id: "" });

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.email) {
      getUserByEmail({
        variables: {
          userEmail: stateApp.user.email,
        },
      });
    }
  }, [stateApp.user.email]);

  useEffect(() => {
    if (dataUser && dataUser.userByEmail) {
      setUser(dataUser.userByEmail);
    }
  }, [dataUser]);

  /////end/////////temporary while signed user fixed

  useEffect(() => {
    //////stateApp.user._id////////temporary while signed user fixed
    if (user._id !== "" && props.objectId) {
      getCommentsCounter({
        variables: {
          objectsIdsArray: [props.objectId],
          userId: user._id,
        }, //////stateApp.user._id////////temporary while signed user fixed
      });
    }
  }, [user, props.objectId]); //////stateApp.user._id////////temporary while signed user fixed

  useEffect(() => {
    if (dataCommentsCounter && dataCommentsCounter.commentsCounter) {
      if (dataCommentsCounter.commentsCounter.length > 0) {
        setCommentsCounter(dataCommentsCounter.commentsCounter[0].total);
      } else {
        setCommentsCounter(0);
      }
    }
  }, [dataCommentsCounter]);

  return (
    <React.Fragment>
      <Tooltip
        title={
          !commentsCounter || commentsCounter === 0
            ? "Add Comments"
            : "Comments"
        }
        placement="top"
      >
        <Badge
          badgeContent={commentsCounter}
          color="secondary"
          variant={props.iconZiseSmall ? "dot" : "standard"}
        >
          <IconButton
            size={props.iconZiseSmall ? "small" : "medium"}
            color="primary"
            className={`${classes.icons}  ${
              openDialog ? classes.iconSelected : ""
            }`}
            onClick={() => {
              setOpenDialog(true);
            }}
            aria-label="show tags"
          >
            <ChatIcon />
          </IconButton>
        </Badge>
      </Tooltip>
      {openDialog && (
        <Dialog
          className={classes.dialog}
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
          }}
        >
          <Comments focus targetSourceId={props.objectId} />
        </Dialog>
      )}
    </React.Fragment>
  );
}
