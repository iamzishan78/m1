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
import { ExpandableCardContext } from "./ExpandableCardContext";
import ReportBugModal from "./components/ReportBugModal";
import { TRACKBYOBJECTID } from "../../graphQL/useQueryTrackByObjectId";
import TaggerWithIcon from "../Shared/TaggerWithIcon";
import CommentsWithIcon from "../Shared/CommentsWithIcon";
import TrackToggleButton from "../Shared/TrackToggleButton";
import LinkWithIcon from "../Shared/LinkWithIcon";
import BugsIcon from "../Shared/svgIcons/bug.js";
import DeleteConfirmationDialogContent from "../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { UPDATECUSTOMLAYER } from "../../graphQL/useMutationUpdateCustomLayer";
import ContactSearch from "./components/ContactSearch";

// contexts 
import { AppContext } from "../../AppContext";
import { MapControlsContext } from "../MapControls/MapControlsContext";



function ExpandableCard(props) {

  // contexts 
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateMapControls, setStateMapControls] = useContext(MapControlsContext);


  const [stateExpandableCard, setStateExpandableCard] = useContext(
    ExpandableCardContext
  );
  const [openBugModal, setOpenBugModal] = useState(false);
  const [toggleExpand, setToggleExpand] = useState(false);
  const [isExpanded, setExpanded] = useState([]);
  const [title, setTitle] = useState(props.title);
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
      update(
        cache,
        {
          data: {
            updateCustomLayer: { customLayer },
          },
        }
      ) {

        cache.modify({
          _id: cache.identify(customLayer),
          fields: {
            allCustomLayers(existingCustomLayerRefs, { readField }) {
              return existingCustomLayerRefs.filter(
                (customLayerRef) =>
                  customLayer._id !== readField("_id", customLayerRef)
              );
            },
          },
        });
      },
    }
  );

  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (props.targetLabel === "activity") {
      setTitle(props.title);
    }
  }, [props.title, props.targetLabel]);




  const useStyles = makeStyles((theme) => ({
    root: {
        zIndex: 88888,
    },

    card: {
      position: position,
      left: cardLeft,
      top: cardTop,
      webkitTransform: "translateZ(0)",
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
      zIndex: 9999, // consistent with mapbox popup summary card for map interactions
    },
    title: {
      fontFamily: "Poppins",
      color: "#FFFFFF",
      fontSize: [
        "Contact",
        "Contact Details",
        "Add Activity",
        "Activity Details",
      ].includes(title)
        ? "20px"
        : "15px",
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
      backgroundColor: "#fffff",
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
      color: "white",
    },
  }));

  const classes = useStyles();

  const [
    trackByObjectId,
    { loading: loadingTrack, data: dataTrack },
  ] = useLazyQuery(TRACKBYOBJECTID);

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId && targetSourceId) {
      trackByObjectId({
        variables: {
          userId: stateApp.user.mongoId,
          objectId: targetSourceId.toLowerCase(),
        },
      });
    }
  }, [stateApp.user.mongoId, targetSourceId]);

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

    // if (parent === "map" && $("#popupContainer").length) {
    // }

    if (toggleExpand == false) {
      setToggleExpand(true);
      setExpanded(false);
      setWidth(cardWidthExpanded);
    } else {
      setToggleExpand(false);
      setExpanded(true);
      if (parent === "table" && targetLabel === "well") setWidth("50vw");
      else setWidth("95vw");
    }
    setHeight(cardHeightExpanded);


    if (props.targetLabel == "well" || props.targetLabel == "expandedWell") {
      setStateApp((state) => ({
        ...state,
        wellDetailCardOpen: true,
        popupOpen: false,
      }));


    } else if (props.targetLabel == "parcel" || props.targetLabel == "expandedParcel") {
      setStateApp((state) => ({
        ...state,
        parcelDetailCardOpen: true,
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
        let popUps = document.getElementsByClassName("mapboxgl-popup");
        if (popUps[0]) popUps[0].remove();
      }

      setStateApp((state) => ({
        ...state,
        popupOpen: false,
        selectedWell: null,
        selectedParcel: null,
        expandedCard: false,
      }));
    }
    setStateApp((state) => ({
      ...state,
      viewDoc: null
    }));
    props.handleCloseExpandableCard();
    //if EC is inside map popup you need to close it
  };

  const getTitle = () => {
    if (!title) {
      return "--";
    }
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          marginRight: "48px",
        }}
      >
        {(targetLabel != "contact"
        ) && 
        <div>{title.length > 30 ? `${title.substr(0, 35)}...` : title}</div>
        }

        {(targetLabel === "contact"
          && parent != 'table'
        ) && <ContactSearch />}

      {(targetLabel === "contact"
          && parent != 'table'
        ) && 
        <div>{title.length > 30 ? `${title.substr(0, 35)}...` : title}</div>
        }

      </div>
    );
  };

  const openConfirmationDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const deleteFunc = async () => {
    if (targetLabel === "parcel" || targetLabel === "expandedParcel") {
      setDeleteLoading(true);
      await deleteParcel();
      setDeleteLoading(false);

      // For clearing out selected abstract land grids
      const { map } = stateApp;
      let popUps = document.getElementsByClassName("mapboxgl-popup");
      if (popUps[0]) popUps[0].remove();

      for (let i = 0; i < stateApp.selectedAbstracts.length; i++) {
        const id = stateApp.selectedAbstracts[i].properties.Id;
        map.setFeatureState(
          { source: 'abstract_geo_source', id },
          { click: false }
        );
      }
      setStateApp((state) => ({
        ...state,
        selectedAbstracts: []
      }));
    } else if (targetLabel === "activity") {
      setDeleteLoading(true);
      await deleteActivity();
      setDeleteLoading(false);
    }
  };

  const deleteParcel = async () => {
    await props.deleteParcel(targetSourceId)
    handleClose();
  };

  const deleteActivity = async () => {
    await props.handleDelete();
  };

  useEffect(() => {
    ///Set body style overflow hidden when card is fully expanded
    const disableBodyScrollBarIfExpanded = () => {
      if (width === '95vw') {
        document.body.style.overflow = 'hidden';
      }
    };

    disableBodyScrollBarIfExpanded();
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openDialog, props.targetLabel, isExpanded, width]);


  return (
    <React.Fragment>

      {/* Dialog for deleting parcel  */}
      {openDialog && (
        <Dialog
          className={classes.dialog}
          open={openDialog ? true : false}
          onClose={handleCloseDialog}
          fullWidth={false}
          maxWidth="sm"
        >
          <DeleteConfirmationDialogContent
            header={`Delete ${targetLabel == "expandedParcel" ? "parcel" : targetLabel}`}
            onClose={handleCloseDialog}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => { }}
          >
            Are you sure you want to delete the selected {targetLabel === "expandedParcel" ? "parcel" : targetLabel}?
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}



      <Card className={classes.card}>

        {/* Modal popup for reporting bugs on expandable card  */}
        <ReportBugModal
          open={openBugModal}
          onClose={() => setOpenBugModal(false)}
        />
        <CardHeader
          classes={{ title: classes.title, subheader: classes.subheader }}
          action={
            <div className={classes.headerIcons}>
              { targetLabel !== "activity" &&
                targetLabel !== "contact" &&
                (
                    <CommentsWithIcon
                      objectId={targetSourceId.toLowerCase()}
                      targetLabel={props.targetLabel}
                      iconZiseSmall={!stateExpandableCard.expanded}
                    />
                )}

              { targetLabel !== "activity" &&
                targetLabel !== "contact" &&
                targetLabel !== "recent_submitted_permits" && (
                  <TaggerWithIcon
                    objectId={targetSourceId.toLowerCase()}
                    targetLabel={props.targetLabel}
                    iconZiseSmall={!stateExpandableCard.expanded}
                  />
                )}

              { targetLabel == "contact" &&
                parent !== "table" && (
                  <LinkWithIcon
                    objectId={targetSourceId.toLowerCase()}
                    targetLabel={props.targetLabel}
                    iconZiseSmall={!stateExpandableCard.expanded}
                />
                )}

              {!props.noTrackAvailable 
                && targetLabel !== "recent_submitted_permits"
                && (
                <TrackToggleButton
                  target={target}
                  targetLabel={targetLabel}
                  targetSourceId={targetSourceId.toLowerCase()}
                  iconZiseSmall={!stateExpandableCard.expanded}
                />
              )}

              {stateExpandableCard.expanded &&
                targetLabel !== "activity" &&
                targetLabel !== "contact" &&
                targetLabel !== "parcel" &&
                targetLabel !== "expandedParcel" && (
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

              {stateExpandableCard.expanded &&
                ["activity", "parcel", "expandedParcel"].includes(targetLabel) &&
                title !== "Add Activity" && (
                  <Tooltip title={`Delete ${targetLabel}`} placement="top">
                    {isDeletingCustomLayer || deleteLoading ? (
                      <CircularProgress size={20} color="secondary" />
                    ) : (
                      <IconButton
                        onClick={openConfirmationDialog}
                        aria-label="Delete"
                        className={classes.icons}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Tooltip>
                )}


              {stateExpandableCard.expanded 
              
                && targetLabel !== "activity" 
                && targetLabel !== "contact"
                ? parent !== "table" 
                  && targetLabel !== "well" 
                  && targetLabel !== "expandedWell" 
                  && targetLabel !== "parcel" 
                  && targetLabel !== "expandedParcel"
                  && targetLabel !== "recent_submitted_permits"
                  ? (
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
                  ) : isExpanded == false && targetLabel !== "activity" ? (
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
                  ) : (
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
                : (
                  parent !== "table" &&
                  targetLabel !== "activity" && 
                  targetLabel !== "recent_submitted_permits" && (
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
                  )
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

          // Expandable Card Title 
          title={getTitle()}

          // Expandable Card Secondary Header 
          subheader={
            subTitle
              ? subTitle.length > 35
                ? `${subTitle.substr(0, 35)}...`
                : subTitle
              : ""
          }
        />

        <CardContent className={classes.content}>
          <div id="cardContent">{props.component}</div>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

ExpandableCard.whyDidYouRender = true
export default React.memo(ExpandableCard);