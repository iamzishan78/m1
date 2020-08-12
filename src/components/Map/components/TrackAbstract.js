import React, { useState, useContext, useEffect } from "react";

import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Collapse from "@material-ui/core/Collapse";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";

import { AppContext } from "../../../AppContext";
import { NavigationContext } from "../../Navigation/NavigationContext";

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
    borderRadius: 0,
    padding: "5px",
    marginTop: "15px",
    marginLeft: "15px",
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
    left: "44px !important",
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
  const classes = useStyles;
  const [openedControl, setOpenControl] = useState(true);
  const [abstractList, setAbstractList] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { showAbstractPopup } = props;

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

  useEffect(() => {
    if (stateApp.map) {
      const map = stateApp.map;
      const source = map.getSource('abstract_geo_source');
      if (source) {
        const featuresList = source._data.features;
        let checkedAbstractList = [];
        for (let i = 0; i < featuresList.length; i ++) {
          const id = featuresList[i].properties.abstract_n;
          const featureState = map.getFeatureState({
            source: 'abstract_geo_source',
            id: id
          });
          if (featureState && featureState.click) {
            checkedAbstractList.push({
              abstract_n: id,
              abstract_l: featuresList[i].properties.abstract_l,
              checkedStatus: true,
            });
          } else {
            checkedAbstractList.push({
              abstract_n: id,
              abstract_l: featuresList[i].properties.abstract_l,
              checkedStatus: false,
            });
          }
          setAbstractList(checkedAbstractList);
        }
      }
    }

  }, [stateApp.map, showAbstractPopup]);

  const toggleAbstract = (abstract_n) => {
    const tmpAbstractList = abstractList.slice(0);
    const abstractIndex = tmpAbstractList.findIndex((abstract) => abstract.abstract_n == abstract_n)
    const abstract = tmpAbstractList[abstractIndex];
    const checkedStatus = abstract.checkedStatus;

    if (stateApp.map) {
      const map = stateApp.map;
      if (checkedStatus) {
        map.setFeatureState(
          { source: 'abstract_geo_source', id: abstract_n },
          { click: false }
        );
      } else {
        map.setFeatureState(
          { source: 'abstract_geo_source', id: abstract_n },
          { click: true }
        );
      }
    }

    tmpAbstractList[abstractIndex].checkedStatus = !checkedStatus;
    setAbstractList(tmpAbstractList);
  }

  const id = openedControl ? "filter-control-popover" : undefined;

  if (showAbstractPopup) {
    return (
      <div>
        <StyledIconButton
          onClick={toggleOpenContorl}
          aria-label="toggle"
          aria-describedby={id}
        >
          {openedControl ? (
            <ArrowBackIosIcon fontSize="small" />
          ) : (
            <ArrowForwardIosIcon fontSize="small" />
          )}
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
            <ListItemText primary="Track" />
          </StyledMenuItem>
          
          {
            abstractList && abstractList.length > 0 && (
              abstractList.map((abstract) => (
                <StyledListItem2 button onClick={(e) => {toggleAbstract(abstract.abstract_n)}} key={abstract.abstract_n}>
                  <ListItemText primary={abstract.abstract_l} />
                  <ListItemIcon>
                    {
                      abstract.checkedStatus ? (
                        <VisibilityIcon fontSize="small" />
                      ) : (
                        <VisibilityOffIcon fontSize="small" />
                      )
                    }
                  </ListItemIcon>
                </StyledListItem2>
              ))
            )
          }
        </StyledMenu>
      </div>
    );
  } else {
    return null;
  }
};