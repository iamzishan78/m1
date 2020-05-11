import React, { useContext, forwardRef } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
//import Button from '@material-ui/core/Button';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
//import List from '@material-ui/core/List';
//import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from "@material-ui/core/ListItemIcon";
//import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
//import IconButton from '@material-ui/core/IconButton';
//import EditIcon from '@material-ui/icons/Edit';
import { MapControlsContext } from "../MapControlsContext";
import { MapContext } from "../../Map/MapContext";
import { Divider } from "@material-ui/core";
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import LayersIcon from '@material-ui/icons/Layers';



const useStyles = makeStyles(theme => ({
  subHeaderItem: {
    backgroundColor: "#011133 !important"
  },
  nested: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
}));

export default function CheckboxList(props) {
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateMap, setStateMap] = useContext(MapContext);
  //const theme = useTheme()
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [openUD, setOpenUD] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClickUD = () => {
    setOpenUD(!openUD);
  };


  const handleToggle = idx => () => {
    const currentIndex = stateMap.checkedLayers.indexOf(idx);
    const newChecked = [...stateMap.checkedLayers];
    if (currentIndex === -1) {
      newChecked.push(idx);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setStateMap(stateMap => ({ ...stateMap, checkedLayers: newChecked }));
  };


  const handleToggleUserDefined = idx => () => {
    const currentIndex = stateMap.checkedUserDefinedLayers.indexOf(idx);
    const newChecked = [...stateMap.checkedUserDefinedLayers];
    if (currentIndex === -1) {
      newChecked.push(idx);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setStateMap(stateMap => ({ ...stateMap, checkedUserDefinedLayers: newChecked }));
  };



  const StyledMenu = withStyles({
    paper: {
      border: "1px solid #011133",
      left: "unset !important",
      right: "80px !important"
    }
  })(props => (
    <Menu
      elevation={0}
      variant="menu"
      transitionDuration={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left"
      }}
      MenuListProps={{
        disablePadding: true
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      {...props}
    />
  ));

  const StyledMenuItem = withStyles(theme => ({
    root: {
      fontFamily: "Poppins",
      "&:hover": {
        background: "#4B618F"
      },
      backgroundColor: "#263451",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
        // },
      }
    }
  }))(MenuItem);

  const StyledListItem = withStyles(theme => ({
    root: {
      fontFamily: "Poppins",
      "&:hover": {
        background: "#4B618F"
      },
      backgroundColor: "#263451",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
        // },
      }
    }
  }))(ListItem);

  const StyledListItem2 = withStyles(theme => ({
    root: {
      fontFamily: "Poppins",
      "&:hover": {
        background: "#a3b2cf"
      },
      backgroundColor: "#4B618F",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
        // },
      }
    }
  }))(ListItem);

  const handleClose = () => {
    setStateMapControls(stateMapControls => ({
      ...stateMapControls,
      anchorEl: null
    }));
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <StyledMenu
        id="checklist-menu"
        anchorEl={stateMapControls.anchorEl}
        keepMounted
        open={Boolean(stateMapControls.anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem
          disableRipple
          key="subheader"
          role={undefined}
          dense
          className={classes.subHeaderItem}
        >
          <ListItemText primary="Layer Visibility" />
        </StyledMenuItem>

        <StyledListItem2 button onClick={handleClick}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="M1neral Layers" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem2>

        {stateMap.styleLayers.map((layer, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            // <StyledMenuItem disableRipple key={index} role={undefined} dense>
            <Collapse in={open} timeout="auto" unmountOnExit>

            <StyledListItem button className={classes.nested}>
              <ListItemIcon>
                <Checkbox
                  icon={<VisibilityOffIcon htmlColor="#fff" />}
                  checkedIcon={<VisibilityIcon htmlColor="#fff" />}
                  edge="start"
                  checked={
                    stateMap.checkedLayers
                      ? stateMap.checkedLayers.indexOf(index) !== -1
                      : false
                  }
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                  onChange={handleToggle(index)}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={layer.name} />
              </StyledListItem>  
              </Collapse>
            // </StyledMenuItem> 
          );
        })}

        <StyledListItem2 button onClick={handleClickUD}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="User Defined" />
          {openUD ? <ExpandLess /> : <ExpandMore />}
        </StyledListItem2>

        {stateMap.userDefinedLayers.map((layer, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            // <StyledMenuItem disableRipple key={index} role={undefined} dense>
            <Collapse in={openUD} timeout="auto" unmountOnExit>

            <StyledListItem button className={classes.nested}>
              <ListItemIcon>
                <Checkbox
                  icon={<VisibilityOffIcon htmlColor="#fff" />}
                  checkedIcon={<VisibilityIcon htmlColor="#fff" />}
                  edge="start"
                  checked={
                    stateMap.checkedUserDefinedLayers
                      ? stateMap.checkedUserDefinedLayers.indexOf(index) !== -1
                      : false
                  }
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                  onChange={handleToggleUserDefined(index)}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={layer.name} />
              </StyledListItem>  
              </Collapse>
            // </StyledMenuItem> 
          );
        })}


      </StyledMenu>
    </ClickAwayListener>
  );
}
