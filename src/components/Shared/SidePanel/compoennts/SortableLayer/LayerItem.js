import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Box, Grid, ListItemIcon, ListItemText } from "@material-ui/core";

import { Flipped } from "react-flip-toolkit";
import { useSelector } from "react-redux";
import { getLayerColor, ifLayerHaveData } from "../common";
import { useDrag, useDrop, useIsClosestDragging } from "react-sortly";
import { DragIndicator } from "@material-ui/icons";
import LayerControls from "./LayerControls";
import { truncate } from "components/Shared/functions";
import { FormControlLabel } from "@material-ui/core";
import { Switch } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';


// icons 
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    fontFamily: "Poppins",
    backgroundColor: props.data.type === "group" ? "#2c3148": "#040e24",
    // marginLeft: theme.spacing(props.depth * 2),
    color: props.muted ? theme.palette.primary.dark : "inherit",
    zIndex: props.muted ? 1 : 0,
    fontWeight: props.data.type === "group" ? 600 : 500,
    height: props.data.collapsed && props.data.type === "layer" || !props.data.showable ? 0 : "auto",
    fontSize: props.data.type === "group" ? 20 : 18,
    position: "relative",
    fontWeight: props.data.type === "group" ? 600 : 500,
    height: props.data.collapsed && props.data.type === "layer" || !props.data.showable ? 0 : "35px",
    overflow: "hidden",
    disabledLayerTitle: {
      "& span": { color: "rgb(127, 149, 199) !important" },
    },
    "&:hover": {
      background: "#506187",
    },
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
      minWidth: '40px' // for some reason controls the icon spacing
    },
    "& .MuiTypography-root": {
      color: theme.palette.common.white,
    },

    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // overflowX: "hidden",
    // cursor: "move",
    // padding: props.data.collapsed && props.data.type === "layer" || !props.data.showable ? 0 : theme.spacing(0.5, 0),
    // margin: props.data.collapsed && props.data.type === "layer" ? 0 : theme.spacing(0.5),
    // border: props.muted ? '1px dashed #1976d2' : '1px solid transparent',

  }),
  subContainer: (props) => ({
    marginLeft: theme.spacing(props.depth * 2),
  }),

}));



const LayerItem = React.memo((props) => {
  const colors = useSelector(({ MainMap }) => MainMap);

  const { id, depth, data, onToggleCollapse, onToggleGroup, updateLayer, onDragEnd, onDragBegin, stateApp } = props;
  const itemRef = React.useRef({ id: -1, depth: -1, data: {} });
  const { type, collapsed, name } = data;

  const [{ isDragging }, drag, preview] = useDrag({
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    begin(f) {
      itemRef.current = data;
      onDragBegin(data);
    },
    end(f) {
      onDragEnd(itemRef.current, data);
    },
  });
  const [, drop] = useDrop();

  const handleClick = () => {
    if (type === "file") {
      return;
    }
    onToggleCollapse(id);
  };

  const classes = useStyles({
    ...props,
    depth,
    muted: useIsClosestDragging() || isDragging,
  });

  return (
    <Flipped flipId={id}>
      <div ref={(ref) => drop(preview(ref))} 
      >

          <Grid container     
                className={classes.root} 
                direction="row" 
          >

            <Grid item 
                  xs={8}
                  style={{
                  display: 'flex', 
                  flexDirection: 'row', 
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  }}
                  >


              <Grid container     
                direction="row"
                wrap='nowrap'
                className={classes.subContainer} 
                style={{
                  display: 'flex', 
                  flexDirection: 'row', 
                  justifyContent: 'flex-start',
                  // marginLeft: '20px',
                  alignItems: 'center',
                  }} 
              >

                <Box borderColor={getLayerColor(data, "layer", colors)} borderLeft={4}>
                  <ListItemIcon ref={drag} >
                    <DragIndicator style={{ cursor: "move"}} />
                  </ListItemIcon>
                </Box>

                {type === "group" && !collapsed && (
                  <ListItemIcon onClick={handleClick}>
                    <ExpandLessIcon />
                  </ListItemIcon>
                )}
                {type === "group" && collapsed && (
                  <ListItemIcon onClick={handleClick} >
                    <ExpandMoreIcon/>
                  </ListItemIcon>
                )}

              <Typography id={id} color = "secondary"
                          // className={!ifLayerHaveData(data, stateApp) ? 
                          //   classes.disabledLayerTitle : ""}
                          noWrap>{name}</Typography>

            </Grid>
            </Grid>

            <Grid item 
                  xs={4}
                  styles={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexGrow: 1
                  }}
                  >

                  {type === "layer" && <LayerControls type={"layer"} layer={data} labelId={id} updateLayer={updateLayer} />}

                  {type === "group" && (

                    <Grid container 
                      spacing={1}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                      >

                    <Grid item>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={data.visiable}
                          onChange={() => onToggleGroup(id)}
                          size = 'small'
                        />
                      }
                    />
                    </Grid>

                    </Grid>
                    
                  )}

            </Grid>
          </Grid>
        {/* </Box> */}
       </div>
    </Flipped>
  );
});

export default LayerItem;
