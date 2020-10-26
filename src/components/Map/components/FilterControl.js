import React, { useState, useContext, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";

import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Collapse from "@material-ui/core/Collapse";
import { CircularProgress } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import DeleteIcon from "@material-ui/icons/Delete";
import SelectAllIcon from "@material-ui/icons/SelectAll";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import { NavigationContext } from "../../Navigation/NavigationContext";
import { BULKTRACKALLUNTRACKALL } from "../../../graphQL/useMutationBulkTrackAllUntrackAll";
import { WELLSOWNERSQUERY } from "../../../graphQL/useQueryWellsOwners";
import MenuIcon from "@material-ui/icons/Menu";
import ShrinkIcon from "../../Shared/components/svgIcons/ShrinkIcon";
import { deepEqualObjects } from "../../Shared/functions";
import { useDispatch } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "../../../actions";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  subHeaderItem: {
    backgroundColor: "#011133 !important",
    width: "350px",
  },
  list: {
    padding: "0",
  },
}));

const StyledIconButton = withStyles((theme) => ({
  root: {
    "&:hover": {
      background: "#4B618F",
    },
    backgroundColor: "#263451",
    borderRadius: "50%",
    padding: "0",
    transform: "translateY(1px)",
    "& .MuiIconButton-label": {
      color: theme.palette.common.white,
    },
  },
}))(IconButton);

const StyledListItem = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    "&:hover": {
      background: "#4B618F",
    },
    backgroundColor: "#263451",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
  },
}))(ListItem);

const StyledListItem2 = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    "&:hover": {
      background: "#a3b2cf",
    },
    backgroundColor: "#4B618F",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
  },
}))(ListItem);

const StyledListItem3 = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    "&:hover": {
      background: "#a3b2cf",
    },
    backgroundColor: "#4B618F",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
  },
}))(ListItem);

const StyledMenuItem = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    "&:hover": {
      background: "#263451",
      cursor: "context-menu",
    },
    backgroundColor: "#263451",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
    "& button": {
      color: theme.palette.common.white,
      "&:hover": {
        backgroundColor: "rgb(255 255 255 / 26%)",
      },
    },
  },
}))(MenuItem);

const StyledMenu = withStyles({
  paper: {
    minHeight: ({ showTrack }) => (showTrack ? "300px" : "230px"),
    backgroundColor: "transparent",
    marginTop: "50px",
    "& ul": {
      border: "1px solid #011133",
      backgroundColor: "#4B618F",
    },
  },
})((p) => {
  const props = { ...p };
  delete props.showTrack;

  return (
    <Menu
      elevation={0}
      variant="menu"
      transitionDuration={300}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      MenuListProps={{
        disablePadding: true,
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      {...props}
    />
  );
});

function FilterControl() {
  const dispatch = useDispatch();

  const classes = useStyles;
  const [openedControl, setOpenControl] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openTrack, setOpenTrack] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [isTrackWells, setTrackWells] = useState(false);
  const [isTrackOwners, setTrackOwners] = useState(false);
  const [trackingOwners, setTrackingOwners] = useState(false);
  const [trackingWells, setTrackingWells] = useState(false);
  const [bulkTrackAllUntrackAllWells, { data: dataWells }] = useMutation(
    BULKTRACKALLUNTRACKALL
  );
  const [bulkTrackAllUntrackAllOwners, { data: dataOwners }] = useMutation(
    BULKTRACKALLUNTRACKALL
  );

  const [getWellsOwners, { data: dataWellsOwners }] = useLazyQuery(
    WELLSOWNERSQUERY
  );

  /// success wells tracked
  useEffect(() => {
    if (dataWells) {
      if (
        dataWells.bulkTrackAllUntrackAll &&
        dataWells.bulkTrackAllUntrackAll.success
      ) {
        dispatch(showSuccessMessage("Wells are successfully tracked"));
        stateApp.toggleLayersActivity("Tracked Wells", true);
      } else {
        dispatch(showErrorMessage("The tracking process failed."));
      }
      setTrackingWells(false);
    }
  }, [dataWells]);
  /// success owners tracked
  useEffect(() => {
    if (dataOwners) {
      if (
        dataOwners.bulkTrackAllUntrackAll &&
        dataOwners.bulkTrackAllUntrackAll.success
      ) {
        dispatch(
          showSuccessMessage("The wells owners are successfully tracked")
        );
        stateApp.toggleLayersActivity("Tracked Owners", true);
      } else {
        dispatch(showErrorMessage("The tracking process failed."));
      }
      setTrackingOwners(false);
    }
  }, [dataOwners]);

  const toggleOpenContorl = (event) => {
    if (openedControl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
    setOpenControl(!openedControl);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenControl(false);
  };

  const handleOpenTrack = () => {
    setOpenTrack(!openTrack);
  };

  const handleRemoveFilter = () => {
    setStateNav((stateNav) => ({
      ...stateNav,
      drawingMode: null,
      filterFeatureId: null,
      filterDrawing: [],
    }));
    setStateApp((stateApp) => ({
      ...stateApp,
      popupOpen: false,
      zoomFault: null,
      hugeRequest: null,
    }));
  };

  const handleSelectAllAbstract = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      filterSelectAllAbstract: !stateApp.filterSelectAllAbstract,
    }));
  };

  const handleTrackWells = () => {
    const { map } = stateApp;
    const zoom = map.getZoom();
    if (zoom >= 11) {
      const points = map.queryRenderedFeatures({
        layers: ["wellpoints", "welllines"],
      });
      const targetLabel = "well";
      const user = stateApp.user.mongoId;

      setStateApp((stateApp) => ({
        ...stateApp,
        zoomFault: null,
        hugeRequest: null,
      }));

   
      if (points && points.length > 0) {
        if (points.length > 100) {
          setStateApp((stateApp) => ({
            ...stateApp,
            hugeRequest: `You have selected too many wells to track at once - ${points.length} selected (max of 100 wells). Zoom in further and draw a smaller shape to select fewer wells.`,
          }));
        } else if (points.length <= 0) {
          setStateApp((stateApp) => ({
            ...stateApp,
            hugeRequest: `We can't find any wells in your current selection`,
          }));
        } else {
          setTrackWells(!isTrackWells);
          setTrackingWells(true);

          const tracks = [];
          points.forEach((point) => {
            const targetSourceId = point.properties.id.toLowerCase();
            const track = {
              user: user,
              objectType: targetLabel,
              trackOn: targetSourceId,
            };
            tracks.push(track);
          });
          bulkTrackAllUntrackAllWells({
            variables: {
              tracks: tracks,
              trackAll: !isTrackWells,
            },
            refetchQueries: ["tracksByObjectType", "trackByObjectId"], ////add all queries for components with track icons////
            awaitRefetchQueries: true,
          });
        }
      }
    } else {
      setStateApp((stateApp) => ({
        ...stateApp,
        hugeRequest: `We can't find any wells in your selection`,
      }));
    }
  };

  const trackOwners = (wellownerList) => {
    const user = stateApp.user.mongoId;
    const targetLabel = "owner";
    const tracks = [];
    wellownerList.forEach((well) => {
      well.owners.forEach((owner) => {
        const targetSourceId = owner.ownerId.toLowerCase();
        const track = {
          user: user,
          objectType: targetLabel,
          trackOn: targetSourceId,
        };
        tracks.push(track);
      });
    });

    if (tracks.length > 100) {
      setStateApp((stateApp) => ({
        ...stateApp,
        hugeRequest: `The wells you have selected have too many owners to track at once - ${tracks.length} selected (max of 100 wells). Zoom in further and draw a smaller shape to select fewer wells.`,
      }));
    } else if (tracks.length <= 0) {
      setStateApp((stateApp) => ({
        ...stateApp,
        hugeRequest: `We can't find any owners in your selection`,
      }));
    } else {
      setTrackOwners(!isTrackOwners);
      setTrackingOwners(true);

      bulkTrackAllUntrackAllOwners({
        variables: {
          tracks: tracks,
          trackAll: !isTrackOwners,
        },
        refetchQueries: ["tracksByObjectType", "trackByObjectId"], ////add all queries for components with track icons////
        awaitRefetchQueries: true,
      });
    }
  };

  useEffect(() => {
    if (dataWellsOwners)
      if (dataWellsOwners.wellsOwners) trackOwners(dataWellsOwners.wellsOwners);
      else
        setStateApp((stateApp) => ({
          ...stateApp,
          hugeRequest: `We can't find any owners in your selection`,
        }));
  }, [dataWellsOwners]);

  const handleTrackOwners = () => {
    const { map } = stateApp;
    const zoom = map.getZoom();
    if (zoom >= 11) {
      setStateApp((stateApp) => ({
        ...stateApp,
        zoomFault: null,
        hugeRequest: null,
      }));
      const points = map.queryRenderedFeatures({
        layers: ["wellpoints", "welllines"],
      });

      if (points && points.length > 0) {
        if (points.length > 100) {
          setStateApp((stateApp) => ({
            ...stateApp,
            hugeRequest: `You have selected too many wells to track at once - ${points.length} selected (max of 100 wells). Zoom in further and draw a smaller shape to select fewer wells.`,
          }));
        } else {
          setStateApp((stateApp) => ({
            ...stateApp,
            hugeRequest: null,
          }));
          const wellApiArray = [];
          points.forEach((point) => {
            const wellApi = point.properties.id;
            wellApiArray.push(wellApi);
          });

          if (wellApiArray.length > 0)
            getWellsOwners({
              variables: {
                api: wellApiArray,
              },
            });
          else {
            setStateApp((stateApp) => ({
              ...stateApp,
              hugeRequest: `We can't find any wells in your selection`,
            }));
          }
        }
      } else {
        setStateApp((stateApp) => ({
          ...stateApp,
          hugeRequest: `We can't find any wells in your selection`,
        }));
      }
    } else {
      setStateApp((stateApp) => ({
        ...stateApp,
        zoomFault: true,
        hugeRequest: null,
      }));
    }
  };

  const id = openedControl ? "filter-control-popover" : undefined;
  const showTrack = stateApp.map && stateApp.map.getZoom() >= 11;

  return (
    <>
      <StyledIconButton
        onClick={toggleOpenContorl}
        aria-label="toggle"
        aria-describedby={id}
      >
        {!openedControl && (
          <MenuIcon
            fontSize="small"
            style={{ margin: "5px", padding: "2px" }}
          />
        )}
      </StyledIconButton>

      <StyledMenu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={openedControl}
        onClose={handleClose}
        showTrack={showTrack}
      >
        <StyledMenuItem
          disableRipple
          key="subheader"
          role={undefined}
          dense
          className={classes.subHeaderItem}
        >
          <ListItemText primary="Filter Control" />
          <IconButton size="small" onClick={toggleOpenContorl}>
            <ShrinkIcon viewBox="0 0 64 64" htmlColor="#fff" />
          </IconButton>
        </StyledMenuItem>
        <Tooltip
          title={!showTrack ? "Please zoom in" : ""}
          placement="top-start"
        >
          <span>
            <StyledListItem2
              button
              onClick={handleOpenTrack}
              disabled={!showTrack}
            >
              <ListItemIcon>
                <MyLocationIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Track" />
              {openTrack && showTrack ? <ExpandLess /> : <ExpandMore />}
            </StyledListItem2>
          </span>
        </Tooltip>

        <Collapse in={openTrack && showTrack} timeout="auto" unmountOnExit>
          <List disablePadding>
            <Tooltip title={!showTrack ? "Please zoom in" : ""} placement="top">
              <StyledListItem
                ContainerComponent="li"
                onClick={handleTrackWells}
                disabled={!showTrack}
              >
                <ListItemText primary="Wells" />
                <ListItemIcon>
                  {trackingWells ? (
                    <CircularProgress size={24} color="secondary" />
                  ) : (
                    <MyLocationIcon
                      color={isTrackWells ? "secondary" : "primary"}
                    />
                  )}
                </ListItemIcon>
              </StyledListItem>
            </Tooltip>
            <Tooltip title={!showTrack ? "Please zoom in" : ""} placement="top">
              <StyledListItem
                ContainerComponent="li"
                onClick={handleTrackOwners}
                disabled={!showTrack}
              >
                <ListItemText primary="Owners" />
                <ListItemIcon>
                  {trackingOwners ? (
                    <CircularProgress size={24} color="secondary" />
                  ) : (
                    <MyLocationIcon
                      color={isTrackOwners ? "secondary" : "primary"}
                    />
                  )}
                </ListItemIcon>
              </StyledListItem>
            </Tooltip>
          </List>
        </Collapse>

        {/* <StyledListItem2 button onClick={handleSelectAllAbstract}>
          <ListItemIcon>
            <SelectAllIcon
              fontSize="small"
              color={stateApp.filterSelectAllAbstract ? "secondary" : "white"}
            />
          </ListItemIcon>
          <ListItemText primary="Highlight" />
        </StyledListItem2> */}
        <StyledListItem2 button onClick={handleRemoveFilter}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Clear Filter" />
        </StyledListItem2>
      </StyledMenu>
    </>
  );
}

export default React.memo(FilterControl, deepEqualObjects);
