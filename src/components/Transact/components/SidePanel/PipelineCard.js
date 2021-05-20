import React, { Fragment } from "react";
import { get } from "lodash";
import { Flipped } from "react-flip-toolkit";
import { useDrag, useDrop, useIsClosestDragging } from "react-sortly";
import { ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    overflowX: "hidden",
    alignItems: "center",
    // cursor: "move",
    padding:
      props.pipeline.collapsed && props.pipeline.type === "layer"
        ? 0
        : theme.spacing(0.5, 0),
    marginLeft: theme.spacing(props.depth * 2),
    zIndex: props.muted ? 1 : 0
  }),
  listItem: {
    color: "#fff",
    backgroundColor: "#0c2150",
    margin: "5px 10px 0px 6px",
    borderRadius: "5px",
    width: "95% !important",
    "&:hover": {
      backgroundColor: "#506187",
    },
  },
  listItemIcon: {
    color: "#fff",
    float: "right",
  },
}));

const PipelineCard = (props) => {
  const {
    index,
    depth,
    pipeline,
    selectedPipelines,
    checkMultiSelectPipelines,
    onFlowlineSelect,
  } = props;

  const [{ isDragging }, drag, preview] = useDrag({
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    begin(f) {
      // itemRef.current = pipeline;
      // onDragBegin(pipeline);
      console.log('drag begin');
    },
    end(f) {
      // onDragEnd(itemRef.current, pipeline);
      console.log('drag end');
    },
  });
  const [, drop] = useDrop();

  const classes = useStyles({
    ...props,
    depth,
    muted: useIsClosestDragging() || isDragging,
  });

  return (
    <Flipped flipId={index}>
      <div ref={(ref) => drop(preview(ref))} className={classes.root}>
        <ListItem
          button
          key={index}
          className={classes.listItem}
          style={{
            backgroundColor: `${selectedPipelines.includes(pipeline._id) ? "#506187" : ""
              }`,
          }}
          onClick={() => checkMultiSelectPipelines(pipeline)}
        >
          <ListItemText ref={drag} primary={get(pipeline, "name", pipeline)} />
          <MoreHorizIcon onClick={() => onFlowlineSelect(pipeline)} />
        </ListItem>
      </div>
    </Flipped>
  );
};

export default PipelineCard;
