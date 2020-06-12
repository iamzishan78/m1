import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { TAGSAMPLES } from "../../graphQL/useQueryTagSamples";
import { useLazyQuery } from "@apollo/react-hooks";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Tags from "./Tagger";
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

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId && props.objectId) {
      getTagSamples({
        variables: {
          objectsIdsArray: [props.objectId],
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user, props.objectId]);

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
          badgeContent={props.iconZiseSmall ? null : tagsCounter}
          color="secondary"
          // variant={props.iconZiseSmall ? "dot" : "standard"}
        >
          <IconButton
            size={props.iconZiseSmall ? "small" : "medium"}
            color="primary"
            className={`${classes.icons}  ${
              openDialog || (tagsCounter && tagsCounter > 0)
                ? classes.iconSelected
                : ""
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
            <Tags
              targetSourceId={props.objectId}
              targetLabel={props.targetLabel}
            />
          </div>
        </Dialog>
      )}
    </React.Fragment>
  );
}
