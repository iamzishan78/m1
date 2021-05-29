import React, { Fragment } from "react";
import { get } from "lodash";
import Sortly, { ContextProvider, useDrag, useDrop, useIsClosestDragging } from "react-sortly";
import { Flipped } from "react-flip-toolkit";
import { ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    //    overflowY: "hidden",
    alignItems: "center",
    // cursor: "move",
    position: "relative",
    padding: props.pipeline.collapsed && props.pipeline.type === "Pipeline" ? 0 : theme.spacing(0.5, 0),
    zIndex: props.muted ? 1 : 0,
    // overflow: "hidden",
    color: props.muted ? theme.palette.primary.dark : "inherit",
    "&:hover": {
      background: props.muted ? "#4B618F" : "#263451",
    },
  }),
  listItem: {
    color: "#fff",
    backgroundColor: "#0c2150",
    margin: "5px 10px 0px 6px",
    borderRadius: "5px",
    width: "95% !important",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#506187",
    },
    "& .MuiTypography-root.MuiListItemText-primary": {
      fontSize: theme.typography.pxToRem(14),
    },
  },
  listItemIcon: {
    color: "#fff",
    "float": "right",
  },
}));

const PipelineCard = (props) => {
  const { pipeline, selectedPipelines, onFlowlineSelect, data, handleDragBegin, handleDragEnd } = props;
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
      handleDragBegin(data);
      console.log("begin drag");
    },
    end(f) {
      handleDragEnd(itemRef.current, data);
      console.log("end drag");
    },
  });

  const [, drop] = useDrop();

  const classes = useStyles({ ...props, muted: useIsClosestDragging() || isDragging });

  return (
    <Flipped flipId={data._id}>
      <div className={classes.root} ref={(ref) => drop(preview(ref))}>
        <ListItem
          ref={drag}
          className={classes.listItem}
          style={{
            backgroundColor: `${selectedPipelines.includes(pipeline._id) ? "#506187" : ""}`,
          }}
          onClick={() => onFlowlineSelect(pipeline)}
        >
          <ListItemText primary={get(pipeline, "name", pipeline)} />
        </ListItem>
      </div>
    </Flipped>
  );
};

export default PipelineCard;
