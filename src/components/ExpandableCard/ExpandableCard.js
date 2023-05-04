import React, { useEffect, useContext, useState } from "react";
import _ from "underscore";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Grid,
  Breadcrumbs,
  Typography,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import FolderIcon from "@material-ui/icons/Folder";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useLazyQuery, useMutation } from "@apollo/client";
import $ from "jquery";
import "material-icons/iconfont/material-icons.css";
// Components
import ExpandIcon from "./components/svgIcons/ExpandIcon";
import ShrinkIcon from "./components/svgIcons/ShrinkIcon";
import ReportBugModal from "./components/ReportBugModal";
import TaggerWithIcon from "../Shared/TaggerWithIcon";
import CommentsWithIcon from "../Shared/CommentsWithIcon";
//import { default as DrawPoly } from "components/Shared/svgIcons/polygon";
import DrawPoly from "@material-ui/icons/EditLocationOutlined";
import TrackToggleButton from "../Shared/TrackToggleButton";
import LinkWithIcon from "../Shared/LinkWithIcon";
import DeleteConfirmationDialogContent from "../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import ContactSearch from "./components/ContactSearch";
import { modifyExandableCardStyle } from "components/Shared/functions/shapeLayer";
import { agreementTypes } from "components/ShapeDetailCard/Common/SummaryTable/agreementDefaultData";
// Mutations
import { UPDATECUSTOMLAYER } from "../../graphQL/useMutationUpdateCustomLayer";
// Queries
import { TRACKBYOBJECTID } from "../../graphQL/useQueryTrackByObjectId";
// contexts
import { AppContext } from "../../AppContext";
import { ExpandableCardContext } from "./ExpandableCardContext";
import { showInfoMessage } from "actions";

function ExpandableCard(props) {
  // initials
  const history = useHistory();
  const dispatch = useDispatch();

  // contexts
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateExpandableCard, setStateExpandableCard, handleCloseExpandableCard] = useContext(ExpandableCardContext);

  // States
  const [openBugModal, setOpenBugModal] = useState(false);
  const [toggleExpand, setToggleExpand] = useState(false);
  const [isExpanded, setExpanded] = useState([]);
  const {subTitle} = props;
  const [title, setTitle] = useState(props.title);
  const [parent] = useState(props.parent);
  const [cardWidth] = useState(props.cardWidth);
  const [cardWidthExpanded] = useState(props.cardWidthExpanded);
  const [mouseX] = useState(props.mouseX);
  const [mouseY] = useState(props.mouseY);
  const [position] = useState(props.position);
  const [cardHeight] = useState(props.cardHeight);
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  // const [zIdx, setZidx] = useState(props.zIndex);
  const [cardLeft, setCardLeft] = useState(props.cardLeft);
  const [cardTop, setCardTop] = useState(props.cardTop);
  const [cardHeightExpanded] = useState(props.cardHeightExpanded);
  const [width, setWidth] = useState(props.cardWidth);
  const [height, setHeight] = useState(props.cardHeight);
  const [target, setTarget] = useState({});
  const [targetSourceId] = useState(props.targetSourceId);
  const [targetLabel] = useState(props.targetLabel);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Mutation
  const [, { loading: isDeletingCustomLayer }] = useMutation(UPDATECUSTOMLAYER, {
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
            return existingCustomLayerRefs.filter((customLayerRef) => customLayer._id !== readField("_id", customLayerRef));
          },
        },
      });
    },
  });

  // Queries
  const [trackByObjectId, { data: dataTrack }] = useLazyQuery(TRACKBYOBJECTID);

  const { backgroundColor, headerIcons, icons, headerLabelColor } = modifyExandableCardStyle(
    stateApp.selectedShape || stateApp.selectedParcel
  );

  const useStyles = makeStyles((theme) => ({
    root: {
      // zIndex: 88888,
    },

    card: {
      position: position,
      left: cardLeft,
      borderRadius: 0,
      top: cardTop,
      webkitTransform: "translateZ(0)",
      transition: "width 0.1s, height 0.1s, left 0.1s, top 0.1s",
      width: width,
      height: props.expanded ? height : "inherit",
      background: backgroundColor,
      borderStyle: "solid",
      borderWidth: "thin",
      borderColor: backgroundColor,
      "& .MuiCardHeader-action": {
        alignSelf: "left",
      },
      "& .MuiCardHeader-root": {
        borderBottom: "1px solid rgba(224, 224, 224, 1)",
        // padding: "25px 16px !important",
      },
      zIndex: 1222, // https://material-ui.com/customization/z-index/
    },
    title: {
      fontFamily: "Poppins",
      color: "#FFFFFF",

      fontSize: ["Contact", "Contact Details", "Add Activity", "Activity Details"].includes(title) ? "20px" : "15px",
    },
    headerIcons: {
      "& .MuiBadge-anchorOriginTopRightRectangle": {
        right: "10px",
        top: "5px",
      },
      ...headerIcons,
    },
    subheader: {
      fontFamily: "Poppins",
      color: "#FFFFFF",
      fontSize: "11px",
    },
    breadcrumb: {
      backgroundColor: "#F2F2F2",
      padding: "15px 20px",
    },
    breadcrumbDiv: {
      display: "flex",
      color: "#18AADD",
      fontSize: "16px",
      cursor: "pointer",
    },
    agreementLink: {
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    content: {
      transition: "height 0.1s",
      background: "#fff",
      padding: "0 !important",
      overflow: "auto",
      overflowY:'hidden',
      "&::-webkit-scrollbar": {
        width: "0.4em",
      },
      "&::-webkit-scrollbar-track": {
        "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#929292",
        borderRadius: 5,
      },
      height: stateExpandableCard.expanded ? "calc(100% - 72px)" : "fit-content",
    },
    icons: {
      "&:hover": {
        backgroundColor: "#031d40",
      },
      ...icons,
      color: "white",
    },
    iconPolygon: {
      color: "#FFFFFF",
      stroke: "#FFFFFF",
      fill: "#FFFFFF",
      // , marginRight: '10px'
    },
    unitTitle: {
      flexWrap: 'nowrap',
      "& .name": {
        color: "#1a2341",
        textTransform: "capitalize",
        fontWeight: "bold",
        fontSize: "19px",
      },
      "& .description": {
        color: headerLabelColor,
      },
      "& .type": {
        color: headerLabelColor,
        fontWeight: "bold",
      },
      "& .MuiAvatar-root": {
        width: "65px",
        height: "65px",
      },
      "& .MuiSvgIcon-root": {
        color: "#1a2341",
        fontSize: "2.3rem",
      },
    },
    breadcrumContainer: {
      padding: "15px",
      background: "white",
      color: "lightgrey",
    },
    unClickable: {
      marginLeft: "10px",
      fontSize: "16px",
    },
    prevlocation: {
      marginLeft: "10px",
      fontSize: "16px",
      cursor: "pointer",
      "&:hover": {
        color: "#18AADD",
        textDecoration: "underline",
      },
    },
    currentLocation: {
      color: "#18AADD",
      fontSize: "16px",
    },
    menu: {
      "& .MuiPaper-root": {
        marginTop: "33px",
        marginLeft: "-77px",
        "& .MuiListItemIcon-root": {
          minWidth: "30px",
          "& .MuiSvgIcon-root": {
            fill: "red !important",
          },
        },
      },
    },
  }));

  const classes = useStyles();

  //  UseEffects
  useEffect(() => {
    setTitle(props.title);
  }, [props.title, props.targetLabel]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search?.replace("?", ""));
    const paramBreadCrumbs = searchParams.get("breadcrumbs");

    if (paramBreadCrumbs === "Documents") setBreadcrumbs([{ title: "Documents", url: "/documents" }]);
    else if (history.location?.state?.showWellBreadcrumb) setBreadcrumbs(history.location?.state?.breadcrumbs);
  }, [history.location?.state?.breadcrumbs, history?.location?.state?.showWellBreadcrumb]);

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId && targetSourceId) {
      trackByObjectId({
        variables: {
          userId: stateApp.user.mongoId,
          objectId: targetSourceId.toLowerCase(),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.user.mongoId, targetSourceId]);

  useEffect(() => {
    if (dataTrack) setTarget({ isTracked: dataTrack.trackByObjectId ? true : false });
  }, [dataTrack]);

  // useEffect(() => { setZidx(props.zIndex); }, [props.zIndex]);

  useEffect(() => {
    setWidth(cardWidth);
    setHeight(cardHeight);
    if (props.expanded) handleExpand();
    else handleShrink();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.expanded]);

  useEffect(() => {
    ///Set body style overflow hidden when card is fully expanded
    const disableBodyScrollBarIfExpanded = () => {
      if (width === "100%") document.body.style.overflow = "hidden";
    };

    disableBodyScrollBarIfExpanded();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openDialog, props.targetLabel, isExpanded, width]);

  // functions
  const handleExpand = () => {
    if (toggleExpand === false) {
      setToggleExpand(true);
      setExpanded(false);
      setWidth(cardWidthExpanded);
    } else {
      setToggleExpand(false);
      setExpanded(true);
      if (parent === "table" && targetLabel === "well") setWidth("50vw");
      else setWidth("100%");
    }
    setHeight(cardHeightExpanded);

    if (props.targetLabel === "well" || props.targetLabel === "expandedWell") {
      const newPath = `/map/wells/${stateApp.selectedWell.id}`;
      history.location.pathname !== newPath &&
        history.replace({ path: newPath, search: window.location?.search }, { ...history.location.state });
      setStateApp((state) => ({
        ...state,
        wellDetailCardOpen: true,
        popupOpen: false,
      }));
    } else if (props.targetLabel === "parcel" || props.targetLabel === "expandedParcel") {
      setStateApp((state) => ({
        ...state,
        parcelDetailCardOpen: true,
        popupOpen: false,
      }));
      const newPath = `/map/parcels/${stateApp.selectedParcel?.id}`;
      history.location.pathname !== newPath && history.replace(newPath);
    }
    setStateApp((state) => ({ ...state, expandedCard: true }));
    setStateExpandableCard((state) => ({ ...state, expanded: true }));
  };

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
      if (stateApp?.selectedShape?.type === "agreement" && !stateApp?.selectedShape?.feature?.properties?.agreementNumber) {
        dispatch(showInfoMessage("Agreement Number is required"));
        return;
      }
      if ($("#tempPopupHolder").length) {
        let popUps = document.getElementsByClassName("mapboxgl-popup");
        if (popUps[0]) popUps[0].remove();
      }

      setStateApp((state) => ({
        ...state,
        popupOpen: false,
        selectedWell: null,
        selectedParcel: null,
        selectedShape: null,
        selectedPermit: null,
        expandedCard: false,
        viewDoc: null,
        rotateableFeature: null,
      }));
      // stateApp.selectedParcel?.id && history.replace({ pathname: '/' })
      history.replace({ pathname: "/" });
    }
    handleCloseExpandableCard();
    //if EC is inside map popup you need to close it
  };

  const setDefaulTab = () => {
    if (props.targetLabel === "parcel") {
      setStateApp((state) => ({
        ...state,
        parcelDetailCardTabIndex: 0,
      }));
    }
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
        {stateApp.selectedShape ? (
          <Grid container spacing={2} alignItems="center" className={classes.unitTitle} >
            <Grid item>
              <Avatar color="#1a2341">
                <FolderIcon fontColor="#1a2341" />
              </Avatar> 
            </Grid>
            <Grid item>
              <Box className="name">{title.length > 70 ? `${title.substr(0, 75).toUpperCase()}...` : title.toUpperCase()}</Box>
              <Box className="description">{subTitle}</Box>
              {stateApp.selectedShape.type === "unit" && <Box className="type">Unit</Box>}
              {stateApp.selectedShape.type === "agreement" && (
                <Box className="type">{agreementTypes.find((at) => at.value === stateApp.selectedShape?.agreementType)?.label || ""}</Box>
              )}
            </Grid>
          </Grid>
        ) : (
          <>
            {" "}
            {targetLabel !== "contact" && targetLabel !== "parcel" && <div>{title.length > 70 ? `${title.substr(0, 75)}...` : title}</div>}
            {targetLabel === "parcel" && props.expanded === true && (
              <Grid container spacing={2} alignItems="center" className={classes.unitTitle}>
                
                <Grid item>
                  <Avatar color="#1a2341">
                    <FolderIcon fontColor="#1a2341" />
                  </Avatar>
                </Grid>
                <Grid item>
                  <Box className="name">{title.length > 70 ? `${title.substr(0, 75).toUpperCase()}...` : title.toUpperCase()}</Box>
                  {subTitle && <Box className="description">{subTitle}</Box>}
                  <Box className="type">Tract</Box>
                </Grid>
              </Grid>
            )}
            {targetLabel === "parcel" && props.expanded === false && (
              <Grid container spacing={2} alignItems="center" className={classes.unitTitle}>
                <Box
                  className="name"
                  style={{
                    fontSize: 14,
                    marginTop: -6,
                  }}
                >
                  {title.length > 70 ? `${title.substr(0, 75).toUpperCase()}...` : title.toUpperCase()}
                </Box>
              </Grid>
            )}
            {targetLabel === "contact" && parent !== "table" && <ContactSearch />}
            {targetLabel === "contact" && parent !== "table" && <div>{title.length > 70 ? `${title.substr(0, 75)}...` : title}</div>}
          </>
        )}
      </div>
    );
  };

  const openConfirmationDialog = () => {
    setOpenDialog(true);
  };

  const deleteFunc = async () => {
    if (targetLabel === "parcel" || stateApp.selectedShape || targetLabel === "expandedParcel") {
      setDeleteLoading(true);
      await deleteCustomLayer();
      setDeleteLoading(false);

      // For clearing out selected abstract land grids
      const { map } = stateApp;
      let popUps = document.getElementsByClassName("mapboxgl-popup");
      if (popUps[0]) popUps[0].remove();

      for (let i = 0; i < stateApp.selectedAbstracts.length; i++) {
        const id = stateApp.selectedAbstracts[i].properties.Id;
        map.setFeatureState({ source: "abstract_geo_source", id }, { click: false });
      }
      setStateApp((state) => ({
        ...state,
        selectedAbstracts: [],
      }));
    } else if (targetLabel === "activity") {
      setDeleteLoading(true);
      await deleteActivity();
      setDeleteLoading(false);
    }
  };

  const deleteCustomLayer = async () => {
    await props.deleteCustomLayer(targetSourceId);
    handleClose();
  };

  const deleteActivity = async () => {
    await props.handleDelete();
  };

  const handleEditParcelAndShape = () => {
    setStateApp((state) => ({
      ...state,
      popupOpen: false,
      expandedCard: false,
      showDrawShapesPopup: true,
      selectedUserDefinedLayer: state.selectedParcel?.feature || state.selectedShape?.feature,
      currentFeature: state.selectedParcel?.feature || state.selectedShape?.feature,
      featureToEdit: state.selectedParcel?.feature || state.selectedShape?.feature,
      openDrawShapesControl: true,
      editParcelAndShape: true,
      editDraw: true,
      shapeEditMode: "fullEdit",
    }));
    handleClose();
  };

  // BreadCrum for Document's well
  const DisplayBreadCrums = () => {
    return (
      <div className={classes.breadcrumContainer}>
        {history.location?.state?.fromShapeDetail && (
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Typography className={classes.unClickable} color="inherit">
              {history.location?.state?.shapeType}
            </Typography>
            <Typography
              className={classes.prevlocation}
              color="inherit"
              onClick={() => {
                setStateApp({
                  ...stateApp,
                  selectedWell: null,
                  selectedWellId: null,
                  wellSelectedCoordinates: [],
                });
                history.push(history.location?.state?.link);
              }}
            >
              {history.location?.state?.shapeName}
            </Typography>
            <Typography className={classes.unClickable} color="inherit">
              Wells
            </Typography>
            <Typography className={classes.currentLocation}> {title.toUpperCase()}</Typography>
          </Breadcrumbs>
        )}
        {breadcrumbs && (
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            {breadcrumbs.map((breadcrumb, index) => (
              <Typography
                key={index}
                className={classes.prevlocation}
                color="inherit"
                onClick={() => {
                  // setStateApp({ ...stateApp, DocumentDrawer: false });
                  history.push(breadcrumb.url);
                }}
              >
                {breadcrumb.title}
              </Typography>
            ))}
            <Typography
              // className={classes.prevlocation}
              color="inherit"
            // onClick={() => {
            //   setStateApp({ ...stateApp, DocumentDrawer: true });
            //   history.push("/documents");
            // }}
            >
              Wells
            </Typography>
            <Typography className={classes.currentLocation}> {title.toUpperCase()}</Typography>
          </Breadcrumbs>
        )}
      </div>
    );
  };

  const subHeader = subTitle === ", " ? `${stateApp?.selectedShape?.state} - ${stateApp?.selectedShape?.county}` : (subTitle ? (subTitle.length > 35 ? `${subTitle.substr(0, 35)}...` : subTitle) : "");
  return (
    <React.Fragment>
      {/* Dialog for deleting parcel  */}
      {openDialog && (
        <Dialog
          className={classes.dialog}
          open={openDialog ? true : false}
          onClose={() => setOpenDialog(false)}
          fullWidth={false}
          maxWidth="sm"
        >
          <DeleteConfirmationDialogContent
            header={`Delete ${targetLabel === "expandedParcel" ? "parcel" : targetLabel}`}
            onClose={() => setOpenDialog(false)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => { }}
          >
            Are you sure you want to delete the selected {targetLabel === "expandedParcel" ? "parcel" : targetLabel}?
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}

      <Card id="expandableCard" className={classes.card}>
        {/* Modal popup for reporting bugs on expandable card  */}
        <ReportBugModal open={openBugModal} onClose={() => setOpenBugModal(false)} />
        {(history.location?.state?.fromShapeDetail || breadcrumbs) && <DisplayBreadCrums />}

        {(history.location?.state?.showAgreementBreadcrumb || history.location?.state?.showTractsBreadcrumb) && (
          <Grid container spacing={2} alignItems="center" className={classes.breadcrumb}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Typography
                style={{
                  marginLeft: "10px",
                  fontSize: "16px",
                }}
                color="inherit"
              >
                {history.location?.state?.showAgreementBreadcrumb && (
                  <div className={classes.agreementLink} onClick={() => history.push("/land/agreements")}>
                    Agreements
                  </div>
                )}
                {history.location?.state?.showTractsBreadcrumb && (
                  <div className={classes.agreementLink} onClick={() => history.push("/land/tracts")}>
                    Tracts
                  </div>
                )}
              </Typography>
              <Typography
                style={{
                  marginLeft: "10px",
                  fontSize: "16px",
                }}
                color="inherit"
              >
                <div className={classes.breadcrumbDiv}>{title}</div>
              </Typography>
            </Breadcrumbs>
          </Grid>
        )}
        <CardHeader
          classes={{ title: classes.title, subheader: classes.subheader }}
          action={
            <div className={classes.headerIcons}>
              {(targetLabel === "parcel" || stateApp.selectedShape) && (
                <Tooltip title={`Edit shape boundary`} placement="top">
                  <IconButton
                    // size="small"
                    onClick={() => {
                      handleEditParcelAndShape();
                    }}
                    aria-label={`Edit ${targetLabel}`}
                  >
                    <DrawPoly />
                  </IconButton>
                </Tooltip>
              )}
              {targetLabel !== "activity" && targetLabel !== "contact" && targetLabel !== "parcel" && !stateApp?.selectedShape && (
                <CommentsWithIcon
                  objectId={targetSourceId.toLowerCase()}
                  targetLabel={props.targetLabel}
                  iconZiseSmall={!stateExpandableCard.expanded}
                />
              )}

              {targetLabel !== "activity" &&
                targetLabel !== "contact" &&
                targetLabel !== "parcel" &&
                !stateApp?.selectedShape &&
                targetLabel !== "recent_submitted_permits" && (
                  <TaggerWithIcon
                    objectId={targetSourceId.toLowerCase()}
                    targetLabel={props.targetLabel}
                    iconZiseSmall={!stateExpandableCard.expanded}
                  />
                )}

              {targetLabel === "contact" && parent !== "table" && (
                <LinkWithIcon
                  objectId={targetSourceId.toLowerCase()}
                  targetLabel={props.targetLabel}
                  iconZiseSmall={!stateExpandableCard.expanded}
                />
              )}

              {!props.noTrackAvailable &&
                targetLabel !== "recent_submitted_permits" &&
                targetLabel !== "parcel" &&
                targetLabel !== "unit" &&
                targetLabel !== "agreement" && (
                  <TrackToggleButton
                    target={target}
                    targetLabel={targetLabel}
                    targetSourceId={targetSourceId.toLowerCase()}
                    iconZiseSmall={!stateExpandableCard.expanded}
                  />
                )}

              {stateExpandableCard.expanded && targetLabel !== "activity" && targetLabel !== "contact" && parent !== "table" ? (
                parent !== "table" &&
                  targetLabel !== "well" &&
                  targetLabel !== "expandedWell" &&
                  targetLabel !== "parcel" &&
                  !stateApp.selectedShape &&
                  targetLabel !== "expandedParcel" &&
                  targetLabel !== "recent_submitted_permits" ? (
                  <Tooltip title={"Shrink"} placement="top">
                    <IconButton color="secondary" onClick={handleShrink} aria-label="shrink" className={classes.icons}>
                      <ShrinkIcon viewBox="0 0 64 64" color="secondary" />
                    </IconButton>
                  </Tooltip>
                ) : isExpanded === false && targetLabel !== "activity" ? (
                  <Tooltip title={"Expand"} placement="top">
                    <IconButton
                      // size="small"
                      onClick={handleExpand}
                      aria-label="expand"
                      className={classes.icons}
                      id="expandIcon"
                    >
                      <ExpandIcon viewBox="0 0 64 64" color="secondary" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title={"Shrink"} placement="top">
                    <IconButton color="secondary" onClick={handleExpand} aria-label="shrink" className={classes.icons}>
                      <ShrinkIcon viewBox="0 0 64 64" color="secondary" />
                    </IconButton>
                  </Tooltip>
                )
              ) : (
                parent !== "table" &&
                targetLabel !== "activity" &&
                targetLabel !== "recent_submitted_permits" && (
                  <Tooltip title={"Expand"} placement="top">
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleExpand();
                        setDefaulTab();
                      }}
                      aria-label="expand"
                      className={classes.icons}
                    >
                      <ExpandIcon viewBox="0 0 64 64" color="secondary" />
                    </IconButton>
                  </Tooltip>
                )
              )}
              {stateExpandableCard.expanded &&
                (["activity", "parcel", "expandedParcel"].includes(targetLabel) || stateApp.selectedShape) &&
                title !== "Add Activity" && (
                  <Tooltip title={`Delete ${targetLabel}`} placement="top">
                    {isDeletingCustomLayer || deleteLoading ? (
                      <CircularProgress size={20} color="secondary" />
                    ) : (
                      <>
                        {" "}
                        {(targetLabel == "parcel" || targetLabel == "unit" || targetLabel == "agreement") && (
                          <>
                            {" "}
                            <IconButton size="small" component="span" onClick={handleMenuClick}>
                              <MoreVertIcon id="expandCardVertIcon" size="medium" />
                            </IconButton>
                            <Menu
                              id="dealMenu"
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleMenuClose}
                              className={classes.menu}
                            >
                              <MenuItem onClick={openConfirmationDialog}>
                                <ListItemIcon>
                                  <DeleteIcon size="medium" />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                              </MenuItem>
                            </Menu>
                          </>
                        )}
                      </>
                    )}
                  </Tooltip>
                )}
              <Tooltip title={"Close"} placement="top">
                <IconButton
                  size={stateExpandableCard.expanded ? "medium" : "small"}
                  aria-label="close"
                  className={classes.icons}
                  onClick={handleClose}
                >
                  <CloseIcon id="closeIcon" color="secondary" />
                </IconButton>
              </Tooltip>
            </div>
          }
          // Expandable Card Title
          title={getTitle()}
          // Expandable Card Secondary Header
          subheader={subHeader}
        />

        <CardContent className={classes.content}>
          <div id="cardContentData">{props.component}</div>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default React.memo(ExpandableCard);
