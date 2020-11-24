import React, { useEffect, useContext, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandIcon from "./components/svgIcons/ExpandIcon";
import ShrinkIcon from "./components/svgIcons/ShrinkIcon";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import { useLazyQuery, useMutation } from "@apollo/client";
import $ from "jquery";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../AppContext";
import { ExpandableCardContext } from "./ExpandableCardContext";
import ReportBugModal from "./components/ReportBugModal";
import { TRACKBYOBJECTID } from "../../graphQL/useQueryTrackByObjectId";
import TaggerWithIcon from "../Shared/TaggerWithIcon";
import CommentsWithIcon from "../Shared/CommentsWithIcon";
import TrackToggleButton from "../Shared/TrackToggleButton";
import BugsIcon from "../Shared/svgIcons/bug.js";
import DeleteConfirmationDialogContent from "../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { UPDATECUSTOMLAYER } from "../../graphQL/useMutationUpdateCustomLayer";

import { gql } from "@apollo/client";

export default function ExpandableCard(props) {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateExpandableCard, setStateExpandableCard] = useContext(
    ExpandableCardContext
  );
  const [openBugModal, setOpenBugModal] = useState(false);
  const [toggleExpand, setToggleExpand] = useState(false);
  const [isExpanded, setExpanded] = useState([]);
  const [title] = useState(props.title);
  const [subTitle] = useState(props.subTitle);
  const [parent] = useState(props.parent);
  const [cardWidth] = useState(props.cardWidth);
  const [cardWidthExpanded] = useState(props.cardWidthExpanded);
  const [mouseX] = useState(props.mouseX);
  const [mouseY] = useState(props.mouseY);
  const [position] = useState(props.position);
  const [cardHeight] = useState(props.cardHeight);
  const [zIdx, setZidx] = useState(props.zIndex);
  const [cardLeft, setCardLeft] = useState(props.cardLeft);
  const [cardTop, setCardTop] = useState(props.cardTop);
  const [cardHeightExpanded] = useState(props.cardHeightExpanded);
  const [width, setWidth] = useState(props.cardWidth);
  const [height, setHeight] = useState(props.cardHeight);
  const [target, setTarget] = useState({});
  const [targetSourceId] = useState(props.targetSourceId);
  const [targetLabel] = useState(props.targetLabel);
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [updateCustomLayer, { loading: isDeletingCustomLayer }] = useMutation(
    UPDATECUSTOMLAYER,
    {
      update(cache, { data: { updateCustomLayer: { customLayer } } }) {
        console.log(`newCustomLayer: ${JSON.stringify(customLayer)}`);

        cache.modify({
          _id: cache.identify(customLayer),
          fields: {
            allCustomLayers(existingCustomLayerRefs, { readField }) {
              return existingCustomLayerRefs.filter(
                customLayerRef => customLayer._id !== readField('_id', customLayerRef)
              );
            },
          },
        });
      }
    }
  );

  const useStyles = makeStyles((theme) => ({
    card: {
      position: position,
      left: cardLeft,
      top: cardTop,
      zIndex: zIdx,
      WebkitTransform: "translateZ(0)",
      transition: "width 0.1s, height 0.1s, left 0.1s, top 0.1s",
      width: width,
      height: props.expanded ? height : "inherit",
      background: "#011133",
      borderStyle: "solid",
      borderWidth: "thin",
      borderColor: "#011133",
      "& .MuiCardHeader-action": {
        alignSelf: "left",
      },
    },
    title: {
      fontFamily: "Poppins",
      color: "#FFFFFF",
      fontSize: props.title === "Contact" ? "22px" : "15px",
    },
    headerIcons: {
      "& .MuiBadge-anchorOriginTopRightRectangle": {
        right: "10px",
        top: "5px",
      },
    },
    subheader: {
      fontFamily: "Poppins",
      color: "#FFFFFF",
      fontSize: "11px",
    },
    content: {
      backgroundColor: "#efefef",
      transition: "height 0.1s",
      background: "#fff",
      padding: "0 !important",
      overflowY: "auto",
      height: stateExpandableCard.expanded
        ? "calc(100% - 72px)"
        : "fit-content",
    },
    icons: {
      "&:hover": {
        backgroundColor: "#031d40",
       
      },
      color: "white"
    },
  }));
  const classes = useStyles();

  const [
    trackByObjectId,
    { loading: loadingTrack, data: dataTrack },
  ] = useLazyQuery(TRACKBYOBJECTID);

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId && props.targetSourceId) {
      trackByObjectId({
        variables: {
          userId: stateApp.user.mongoId,
          objectId: props.targetSourceId.toLowerCase(),
        },
      });
    }
  }, [stateApp.user.mongoId, props.targetSourceId]);

  useEffect(() => {
    if (dataTrack) {
      setTarget({
        isTracked: dataTrack.trackByObjectId ? true : false,
      });
    }
  }, [dataTrack]);

  useEffect(() => {
    setZidx(props.zIndex);
  }, [props.zIndex]);

  const handleExpand = () => {
    if (parent === "map" && $("#popupContainer").length) {
      console.log("jquery expand");
    }

    if (toggleExpand == false) {
      setToggleExpand(true);
      setWidth(cardWidthExpanded);
      setExpanded(false);
    } else {
      setToggleExpand(false);
      setWidth("95vw");
      setExpanded(true);
    }
    setHeight(cardHeightExpanded);

    if(props.targetLabel == 'well' || props.targetLabel == 'expandedWell'){

      setStateApp((state) => ({ ...state, 
        wellDetailCardOpen: true,
        popupOpen: false, 
      }));
    }

    setStateApp((state) => ({ ...state, expandedCard: true }));
    setStateExpandableCard((state) => ({ ...state, expanded: true }));
    
  };

  useEffect(() => {
    setWidth(cardWidth);
    setHeight(cardHeight);
    if (props.expanded) {
      handleExpand();
    } else {
      handleShrink();
    }
  }, [props.expanded]);
  
  const handleShrink = () => {
    if (parent === "map" && $("#popupContainer").length) {
      console.log("jquery shrink");
    }
    setCardTop(mouseY);
    setCardLeft(mouseX);
    setStateExpandableCard((state) => ({ ...state, expanded: false }));
    setStateApp((state) => ({ ...state, expandedCard: false }));
    setWidth(cardWidth);
    setHeight(cardHeight);

    // {showExpandableCard && !stateApp.expandedCard ? (
  };

  const handleClose = () => {
    if (parent === "map") {
      if ($("#tempPopupHolder").length) {
        console.log("jquery close");
        let popUps = document.getElementsByClassName("mapboxgl-popup");
        if (popUps[0]) popUps[0].remove();
      }

      setStateApp((state) => ({
        ...state,
        popupOpen: false,
        selectedWell: null,
        selectedParcel: null,
        expandedCard:false,
      }));
    }
    props.handleCloseExpandableCard();
    //if EC is inside map popup you need to close it
  };

  const getTitle = () => {
    if (!title) {
      return "--";
    }
    return title.length > 30 ? `${title.substr(0, 35)}...` : title;
  };

  const openConfirmationDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const deleteFunc = () => {
    if (targetLabel === "parcel") {
      deleteParcel();
    }
  };

  const deleteParcel = () => {
    console.log("Deleting Parcel ...", targetSourceId);
    updateCustomLayer({
      variables: {
        customLayerId: targetSourceId,
        customLayer: {
          IsDeleted: true,
        },
      },
      // refetchQueries: ["getCustomLayers"],
      // awaitRefetchQueries: true,
    });

    handleClose();
  };

  return (
    <React.Fragment>
      {openDialog && (
        <Dialog
          className={classes.dialog}
          open={openDialog ? true : false}
          onClose={handleCloseDialog}
          fullWidth={false}
          maxWidth="sm"
        >
          <DeleteConfirmationDialogContent
            header="Delete Parcel"
            onClose={handleCloseDialog}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => {}}
          >
            Do you want to delete {targetLabel}?
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}
      <Card className={classes.card}>
        <ReportBugModal
          open={openBugModal}
          onClose={() => setOpenBugModal(false)}
        />
        <CardHeader
          classes={{ title: classes.title, subheader: classes.subheader }}
          action={
            <div className={classes.headerIcons}>
              <CommentsWithIcon
                objectId={targetSourceId.toLowerCase()}
                targetLabel={props.targetLabel}
                iconZiseSmall={!stateExpandableCard.expanded}
              />

              <TaggerWithIcon
                objectId={targetSourceId.toLowerCase()}
                targetLabel={props.targetLabel}
                iconZiseSmall={!stateExpandableCard.expanded}
              />

              {!props.noTrackAvailable && (
                <TrackToggleButton
                  target={target}
                  targetLabel={targetLabel}
                  targetSourceId={targetSourceId.toLowerCase()}
                  iconZiseSmall={!stateExpandableCard.expanded}
                />
              )}

              {stateExpandableCard.expanded && (
              <Tooltip title={"Report Bug"} placement="top">
                <IconButton
                  size="medium"
                  onClick={() => setOpenBugModal(true)}
                  className={classes.icons}
                >
                  <BugsIcon viewBox="0 0 64 64" color="white" />
                </IconButton>
              </Tooltip>
            )}

              {stateExpandableCard.expanded && targetLabel === "parcel" && (
                <Tooltip title={"Delete Parcel"} placement="top">
                  {isDeletingCustomLayer ? (
                    <CircularProgress size={20} color="secondary" />
                  ) : (
                    <IconButton
                      onClick={openConfirmationDialog}
                      aria-label="Delete"
                      className={classes.icons}
                     
                    >
                      <DeleteIcon  />
                    </IconButton>
                  )}
                </Tooltip>
              )}
              
              {stateExpandableCard.expanded
                ? parent !== "table" && targetLabel !== "expandedWell" ? (
                  <Tooltip title={"Shrink"} placement="top">
                    <IconButton
                      color="secondary"
                      onClick={handleShrink}
                      aria-label="shrink"
                      className={classes.icons}
                    >
                      <ShrinkIcon viewBox="0 0 64 64" color="secondary" />
                    </IconButton>
                  </Tooltip>
                ) : isExpanded == false ? (
                      <Tooltip title={"Expand"} placement="top">
                        <IconButton
                          size="small"
                          onClick={handleExpand}
                          aria-label="expand"
                          className={classes.icons}
                        >
                          <ExpandIcon viewBox="0 0 64 64" color="secondary" />
                        </IconButton>
                      </Tooltip>
                    ) :
                      (
                        <Tooltip title={"Shrink"} placement="top">
                          <IconButton
                            color="secondary"
                            onClick={handleExpand}
                            aria-label="shrink"
                            className={classes.icons}
                          >
                            <ShrinkIcon viewBox="0 0 64 64" color="secondary" />
                          </IconButton>
                        </Tooltip>
                      )
                : parent !== "table" && (
                    <Tooltip title={"Expand"} placement="top">
                      <IconButton
                        size="small"
                        onClick={handleExpand}
                        aria-label="expand"
                        className={classes.icons}
                      >
                        <ExpandIcon viewBox="0 0 64 64" color="secondary" />
                      </IconButton>
                    </Tooltip>
                  )}
              <Tooltip title={"Close"} placement="top">
                <IconButton
                  size={stateExpandableCard.expanded ? "medium" : "small"}
                  onClick={handleClose}
                  aria-label="close"
                  className={classes.icons}
                >
                  <CloseIcon color="secondary" />
                </IconButton>
              </Tooltip>
            </div>
          }

          title={getTitle()}
          subheader={
            subTitle
              ? subTitle.length > 35
                ? `${subTitle.substr(0, 35)}...`
                : subTitle
              : ""
          }
        />
        <CardContent className={classes.content}>{props.component}</CardContent>
      </Card>
    </React.Fragment>
  );
}
