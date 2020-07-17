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
import { AppContext } from "../../../AppContext";
import { Divider } from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DragIndicator from "@material-ui/icons/DragIndicator";
import RootRef from "@material-ui/core/RootRef";






const useStyles = makeStyles(theme => ({
  subHeaderItem: {
    backgroundColor: "#011133 !important",
    width: '350px'
  },
  list: {
    padding: 0
  },
}));





const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


export default function CheckboxListHeatmaps(props) {
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);
  //const theme = useTheme()
  const classes = useStyles();
  const handleToggle = idx => () => {
    console.log(idx);
    console.log("toggle stateApp.checkedHeats before", stateApp.checkedHeats);
    const currentIndex = stateApp.checkedHeats.indexOf(idx);
    const newChecked = [...stateApp.checkedHeats];

    if (currentIndex === -1) {
      newChecked.push(idx);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    console.log("newchecked", newChecked);

    setStateApp(stateApp => ({ ...stateApp, checkedHeats: newChecked }));

    console.log("toggle stateApp.checkedHeats after", stateApp.checkedHeats);
  };



  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
  
    const items = reorder(
      stateApp.heatLayers,
      result.source.index,
      result.destination.index
    );
  
    let checkedHeats = stateApp.checkedHeats.slice(0);
    const sourceIndex = checkedHeats.indexOf(result.source.index)
    
    let direction = 0;
    let from, to = 0;
    if (result.destination.index > result.source.index) {
      direction = -1;
      from = result.source.index;
      to = result.destination.index;
    } else {
      direction = 1;
      to = result.source.index;
      from = result.destination.index;
    }
  
    for (let i = 0; i < checkedHeats.length; i ++) {
      if (checkedHeats[i] <= to && checkedHeats[i] >= from) {
        checkedHeats[i] += direction;
      } 
    }
  
    if (sourceIndex !== -1) {
      checkedHeats[sourceIndex] = result.destination.index;
    }
  
    setStateApp({
      ...stateApp, 
      heatLayers: items,
      checkedHeats: checkedHeats
    });
  }
  

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
          <ListItemText primary="Heatmaps" />
        </StyledMenuItem>


        {/* 
        {stateApp.heatLayers.map((layer, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            <StyledMenuItem disableRipple key={index} role={undefined} dense>
              <ListItemIcon>
                <Checkbox
                  icon={<VisibilityOffIcon htmlColor="#fff" />}
                  checkedIcon={<VisibilityIcon htmlColor="#fff" />}
                  edge="start"
                  checked={
                    stateApp.checkedHeats
                      ? stateApp.checkedHeats.indexOf(index) !== -1
                      : false
                  }
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                  onChange={handleToggle(index)}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={layer.name} />
            </StyledMenuItem>
          );
        })} */}


        {/* <Collapse in={open} timeout="auto" unmountOnExit> */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <RootRef rootRef={provided.innerRef}>
                  <List className={classes.list}>
                    {stateApp.heatLayers.map((layer, index) => {
                      const labelId = `checkbox-list-label-${index}`;
                      return (
                        <Draggable key={labelId} draggableId={labelId} index={index}>
                          {(provided, snapshot) => (
                            <StyledListItem 
                              ContainerComponent="li"
                              ref={ provided.innerRef }
                              {...provided.draggableProps}
                            >
                              <ListItemIcon {...provided.dragHandleProps}>
                                <DragIndicator />
                              </ListItemIcon>

                              <ListItemText id={labelId} primary={layer.name} />
                            
                              <Checkbox
                                  icon={<VisibilityOffIcon htmlColor="#fff" />}
                                  checkedIcon={<VisibilityIcon htmlColor="#fff" />}
                                  edge="start"
                                  checked={
                                    stateApp.checkedHeats
                                      ? stateApp.checkedHeats.indexOf(index) !== -1
                                      : false
                                  }
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ "aria-labelledby": labelId }}
                                  onChange={handleToggle(index)}
                                />

                            </StyledListItem>
                          )}
                        </Draggable>
                      );
                    })}
                  </List>
                </RootRef>
              )}
            </Droppable>
          </DragDropContext>
        {/* </Collapse> */}






      </StyledMenu>
    </ClickAwayListener>
  );
}
