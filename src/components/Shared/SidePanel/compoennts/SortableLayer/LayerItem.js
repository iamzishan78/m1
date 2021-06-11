import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Box, Grid, ListItemIcon, ListItemText } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Flipped } from "react-flip-toolkit";
import { useSelector } from "react-redux";
import { getLayerColor, ifLayerHaveData } from "../common";
import { useDrag, useDrop, useIsClosestDragging } from "react-sortly";
import { DragIndicator } from "@material-ui/icons";
import LayerControls from "./LayerControls";
import { truncate } from "components/Shared/functions";
import { FormControlLabel } from "@material-ui/core";
import { Switch } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    fontFamily: "Poppins",
    "&:hover": {
      background: props.muted ? "#4B618F" : "#263451",
    },
    backgroundColor: "#263451",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
    overflowX: "hidden",
    alignItems: "center",
    fontSize: props.data.type === "group" ? 20 : 18,
    position: "relative",
    // cursor: "move",
    padding: props.data.collapsed && props.data.type === "layer" || !props.data.showable ? 0 : theme.spacing(0.5, 0),
    // margin: props.data.collapsed && props.data.type === "layer" ? 0 : theme.spacing(0.5),
    marginLeft: theme.spacing(props.depth * 2),
    color: props.muted ? theme.palette.primary.dark : "inherit",
    zIndex: props.muted ? 1 : 0,
    fontWeight: props.data.type === "group" ? 600 : 500,
    height: props.data.collapsed && props.data.type === "layer" || !props.data.showable ? 0 : "auto",
    // border: props.muted ? '1px dashed #1976d2' : '1px solid transparent',
    overflow: "hidden",
  }),
  disabledLayerTitle: {
    "& span": { color: "rgb(127, 149, 199) !important" },
  },
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
      <div ref={(ref) => drop(preview(ref))} className={classes.root}>
        <Box borderColor={getLayerColor(data, "layer", colors)} borderLeft={4}>
          <Grid container className={classes.root} direction="row" justify="space-between" alignItems="center">
            <Grid item>
              <Box display="flex" flex={1} px={1}>
                <ListItemIcon ref={drag}>
                  {" "}
                  <DragIndicator style={{ cursor: "move" }} />
                </ListItemIcon>
                <ListItemText id={id} primary={truncate(name, depth ? 20 : 25)} className={!ifLayerHaveData(data, stateApp) ? classes.disabledLayerTitle : ""} />
              </Box>
            </Grid>

            <Grid item>
              <Box display="inline-flex">
                {type === "layer" && <LayerControls type={"layer"} layer={data} labelId={id} updateLayer={updateLayer} />}
                {type === "group" && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={data.visiable}
                        onChange={() => onToggleGroup(id)}
                      />
                    }
                  />
                )}

                {type === "group" && !collapsed && (
                  <ListItemIcon onClick={handleClick} style={{ alignItems: 'center' }}>
                    <ExpandLessIcon />
                  </ListItemIcon>
                )}
                {type === "group" && collapsed && (
                  <ListItemIcon onClick={handleClick} style={{ alignItems: 'center' }} >
                    <ExpandMoreIcon />
                  </ListItemIcon>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Flipped>
  );
});

export default LayerItem;
