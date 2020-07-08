import React, {useState, useContext, useEffect} from 'react';
import { useMutation, useLazyQuery } from "@apollo/react-hooks";

import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Collapse from "@material-ui/core/Collapse";

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DeleteIcon from '@material-ui/icons/Delete';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";

import { AppContext } from "../../../AppContext";
import { NavigationContext } from "../../Navigation/NavigationContext";
import { TOGGLETRACKS } from "../../../graphQL/useMutationToggleCreateRemoveTracks";
import { WELLSOWNERSQUERY } from "../../../graphQL/useQueryWellsOwners";

const useStyles = makeStyles((theme) => ({
  subHeaderItem: {
    backgroundColor: "#011133 !important",
    width: "350px",
  },
  list: {
    padding: '0',
  },
}));

const StyledIconButton = withStyles((theme) => ({
  root: {
    "&:hover": {
      background: "#4B618F",
    },
    backgroundColor: "#263451",
    borderRadius: 0,
    padding: "5px",
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

const StyledMenuItem = withStyles((theme) => ({
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
}))(MenuItem);

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #011133",
  },
})((props) => (
  <Menu
    elevation={0}
    variant="menu"
    transitionDuration={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    MenuListProps={{
      disablePadding: true,
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
));

export default (props) => {
  const classes = useStyles
  const [openedControl, setOpenControl] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openTrack, setOpenTrack] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [isTrackWells, setTrackWells] = useState(false);
  const [isTrackOwners, setTrackOwners] = useState(false);
  const [toggleCreateRemoveTracks, { data, loading }] = useMutation(TOGGLETRACKS);

  const [getWellsOwners, { data: dataWellsOwners }] = useLazyQuery(
    WELLSOWNERSQUERY
  );

  const toggleOpenContorl = (event) => {
    if (openedControl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
    setOpenControl( !openedControl );
  }

  const handleClose = () => {
    setAnchorEl(null);
    setOpenControl( false );
  }

  const handleOpenTrack = () => {
    setOpenTrack(!openTrack);
  }

  const handleRemoveFilter = () => {
    setStateNav(stateNav => ({ ...stateNav, drawingMode: null, filterFeatureId: null, filterDrawing: []}));
    setStateApp(stateApp => ({ ...stateApp, popupOpen: false}));
  };

  const handleTrackWells = () => {
    const { map } = stateApp;
    const points = map.queryRenderedFeatures({
      layers: ["wellpoints", "welllines"]
    });
    const targetLabel = 'well';
    const user = stateApp.user.mongoId;

    setTrackWells(!isTrackWells);

    if (points && points.length > 0) {
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
      toggleCreateRemoveTracks({
        variables: {
          tracks: tracks,
        },
        refetchQueries: ["tracksByUserAndObjectType", "trackByUserAndObjectId"], ////add all queries for components with track icons////
        awaitRefetchQueries: true,
      });
    }
  }

  const trackOwners = (wellownerList) => {
    const user = stateApp.user.mongoId;
    const targetLabel = "owner";
    const tracks = []
    wellownerList.forEach((well) => {
      well.owners.forEach((owner) => {
        const targetSourceId = owner.ownerId.toLowerCase();
        const track = {
          user: user,
          objectType: targetLabel,
          trackOn: targetSourceId,
        }
        tracks.push(track);
      });
    });
    toggleCreateRemoveTracks({
      variables: {
        tracks: tracks
      },
      refetchQueries: ["tracksByUserAndObjectType", "trackByUserAndObjectId"], ////add all queries for components with track icons////
      awaitRefetchQueries: true,
    });
  }

  useEffect(() => {
    if (dataWellsOwners && dataWellsOwners.wellsOwners && dataWellsOwners.wellsOwners.length > 0) {
      trackOwners(dataWellsOwners.wellsOwners);
    }
  }, [dataWellsOwners])

  const handleTrackOwners = () => {
    const { map } = stateApp;
    const points = map.queryRenderedFeatures({
      layers: ["wellpoints", "welllines"]
    });
    setTrackOwners(!isTrackOwners);
    // const targetLabel = 'owner';
    // const user = stateApp.user.mongoId;

    if (points && points.length > 0) {
      const wellApiArray = [];
      points.forEach((point) => {
        // const targetSourceId = point.id;
        const wellApi = point.properties.id;
        wellApiArray.push(wellApi);
      });
      getWellsOwners({
        variables: {
          api: wellApiArray,
        },
      })
    }
  }

  const id = openedControl ? 'filter-control-popover' : undefined;

  return (
    <React.Fragment>
      <StyledIconButton onClick={toggleOpenContorl} aria-label="toggle" aria-describedby={id}>
        {
          openedControl ? (
            <ArrowBackIosIcon  fontSize="small" />
          ) : (
            <ArrowForwardIosIcon  fontSize="small" />
          )
        }
      </StyledIconButton>
      <StyledMenu 
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={openedControl}
        onClose={handleClose}
      >
        <StyledMenuItem
          disableRipple
          key="subheader"
          role={undefined}
          dense
          className={classes.subHeaderItem}
        >
          <ListItemText primary="Filter Control" />
        </StyledMenuItem>

        <StyledListItem2 button onClick={handleOpenTrack}>
          <ListItemIcon>
            <MyLocationIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Track" />
          {openTrack ? <ExpandLess /> : <ExpandMore />}
          </StyledListItem2>
          <Collapse in={openTrack} timeout="auto" unmountOnExit>
            <List disablePadding>
              <StyledListItem
                ContainerComponent="li"
                onClick={handleTrackWells}
              >
                <ListItemText
                  primary="Wells"
                />
                <ListItemIcon>
                  <MyLocationIcon color={isTrackWells ? 'secondary' : 'primary'} />
                </ListItemIcon>
              </StyledListItem>
              <StyledListItem
                ContainerComponent="li"
                onClick={handleTrackOwners}
              >
                <ListItemText
                  primary="Owners"
                />
                <ListItemIcon>
                  <MyLocationIcon color={isTrackOwners ? 'secondary' : 'primary'} />
                </ListItemIcon>
              </StyledListItem>
            </List>
          </Collapse>
        <StyledListItem2 button onClick={handleRemoveFilter}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </StyledListItem2>
      </StyledMenu>
    </React.Fragment>
  );
}