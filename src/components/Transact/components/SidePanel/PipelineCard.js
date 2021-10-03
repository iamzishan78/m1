import React from "react";
import { get } from "lodash";
import { useDrag, useDrop, useIsClosestDragging } from "react-sortly";
import { Flipped } from "react-flip-toolkit";
import { ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    alignItems: "center",
    position: "relative",
    padding: props.pipeline.collapsed ? 0 : theme.spacing(0.5, 0),
    zIndex: props.muted ? 1 : 0,
    color: props.muted ? theme.palette.primary.dark : "inherit",
    marginLeft: theme.spacing(props.depth * 2),
    height: props.data.collapsed ? "auto" : 0,
    "&:hover": {
      background: props.muted ? "#4B618F" : "transparent",
    },
  }),
  listItem: ({ pipeline, selectedPipelines }) => ({
    color: "#fff",
    margin: "5px 10px 0px 6px",
    borderRadius: "5px",
    fontWeight: 500,
    cursor: "move",
    backgroundColor: selectedPipelines.includes(pipeline._id) ? "#506187" : "#0c2150",
    width: pipeline.type === "Pipeline" && pipeline.projectId ? "94% !important" : "95% !important",
    "&:hover": {
      backgroundColor: "#506187",
    },
    "& .MuiTypography-root.MuiListItemText-primary": {
      fontSize: theme.typography.pxToRem(14),
    },
  }),
  listItemIcon: {
    color: "#fff",
    float: "right",
  },
}));

const PipelineCard = (props) => {
  const { pipeline, onFlowlineSelect, data, handleDragBegin, handleDragEnd } = props;
  const itemRef = React.useRef({ id: -1, depth: -1, data: {} });

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
        <ListItem ref={drag} className={classes.listItem} onClick={() => onFlowlineSelect(pipeline)}>
          <ListItemText primary={get(pipeline, "name", pipeline)} />
        </ListItem>
      </div>
    </Flipped>
  );
};

export default PipelineCard;
