import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { TAGSAMPLES } from "../../graphQL/useQueryTagSamples";
import { useLazyQuery } from "@apollo/react-hooks";
import { USERBYEMAIL } from "../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Tags from "../Shared/Tagger";
import Dialog from "@material-ui/core/Dialog";

export default function TaggerWithIcon(props) {
  const [stateApp] = useContext(AppContext);
  const [tagsCounter, setTagsCounter] = useState(0);
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

  const [getTagSamples, { data: dataTagSamples }] = useLazyQuery(TAGSAMPLES);

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
      getTagSamples({
        variables: {
          objectsIdsArray: [props.objectId],
          userId: user._id,
        }, //////stateApp.user._id////////temporary while signed user fixed
      });
    }
  }, [user, props.objectId]); //////stateApp.user._id////////temporary while signed user fixed

  useEffect(() => {
    if (dataTagSamples && dataTagSamples.tagSamples) {
      if (dataTagSamples.tagSamples.length > 0) {
        setTagsCounter(dataTagSamples.tagSamples[0].total);
      } else {
        setTagsCounter(0);
      }
    }
  }, [dataTagSamples]);

  return (
    <React.Fragment>
      <Tooltip
        title={!tagsCounter || tagsCounter === 0 ? "Add Tags" : "Tags"}
        placement="top"
      >
        <Badge
          badgeContent={tagsCounter}
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
            <LocalOfferIcon />
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
          <div className={classes.tagsDiv}>
            <Tags targetSourceId={props.objectId} />
          </div>
        </Dialog>
      )}
    </React.Fragment>
  );
}
