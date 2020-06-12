import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useLazyQuery } from "@apollo/react-hooks";
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

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId && props.objectId) {
      getCommentsCounter({
        variables: {
          objectsIdsArray: [props.objectId],
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user, props.objectId]);

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
          badgeContent={props.iconZiseSmall ? null : commentsCounter}
          color="secondary"
          // variant={props.iconZiseSmall ? "dot" : "standard"}s
        >
          <IconButton
            size={props.iconZiseSmall ? "small" : "medium"}
            color="primary"
            className={`${classes.icons}  ${
              openDialog || (commentsCounter && commentsCounter > 0)
                ? classes.iconSelected
                : ""
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
          <Comments
            focus
            targetSourceId={props.objectId}
            targetLabel={props.targetLabel}
          />
        </Dialog>
      )}
    </React.Fragment>
  );
}
