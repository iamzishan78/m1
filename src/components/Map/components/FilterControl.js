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
import { TOGGLETRACK } from "../../../graphQL/useMutationToggleCreateRemoveTrack";
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
      // },
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
  const [toggleCreateRemoveTrack, { data, loading }] = useMutation(TOGGLETRACK);

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

    if (points && points.length > 0) {
      points.forEach((point) => {
        const targetSourceId = point.properties.id;
        toggleCreateRemoveTrack({
          variables: {
            track: {
              user: user,
              objectType: targetLabel,
              trackOn: targetSourceId,
            },
          },
        })
      });
    }
  }

  const trackOwners = (ownerList) => {
    const user = stateApp.user.mongoId;
    const targetLabel = "owner";
    console.log(ownerList);
    ownerList.forEach((owner) => {
      const targetSourceId = owner.id;
      toggleCreateRemoveTrack({
        variables: {
          track: {
            user: user,
            objectType: targetLabel,
            trackOn: targetSourceId,
          },
        },
      });
    });
  }

  useEffect(() => {
    if (dataWellsOwners && dataWellsOwners.wellOwners && dataWellsOwners.wellOwners.length > 0) {
        // trackOwners(dataWellsOwners.wellOwners);
        console.log(dataWellsOwners.wellOwners);
    }
  }, [dataWellsOwners])

  const handleTrackOwners = () => {
    const { map } = stateApp;
    const points = map.queryRenderedFeatures({
      layers: ["wellpoints", "welllines"]
    });
    // const targetLabel = 'owner';
    // const user = stateApp.user.mongoId;

    if (points && points.length > 0) {
      const wellApiArray = [];
      points.forEach((point) => {
        // const targetSourceId = point.id;
        const wellApi = point.properties.api;
        wellApiArray.push(wellApi);
        console.log("Selected Well", wellApi);

        
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
                  <MyLocationIcon />
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
                  <MyLocationIcon />
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