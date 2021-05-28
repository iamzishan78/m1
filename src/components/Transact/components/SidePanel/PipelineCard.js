import React, { Fragment } from "react";
import { get } from "lodash";
import Sortly, { ContextProvider, useDrag, useDrop } from "react-sortly";
import { Flipped } from "react-flip-toolkit";
import { ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    overflowY: "hidden",
    alignItems: "center",
    // cursor: "move",
    padding: props.pipeline.collapsed && props.pipeline.type === "layer" ? 0 : theme.spacing(0.5, 0),
    zIndex: props.muted ? 1 : 0,
    overflow: "hidden",
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
    float: "right",
  },
}));

const PipelineCard = (props) => {
  const classes = useStyles(props);
  const { index, pipeline, selectedPipelines, onFlowlineSelect } = props;
  const [, drag] = useDrag();
  const [, drop] = useDrop();

  return (
    // <Flipped flipId={index}>
    <div>
      <ListItem
        button
        key={index}
        className={classes.listItem}
        style={{
          backgroundColor: `${selectedPipelines.includes(pipeline._id) ? "#506187" : ""}`,
        }}
        onClick={() => onFlowlineSelect(pipeline)}
      >
        <ListItemText primary={get(pipeline, "name", pipeline)} />
      </ListItem>
    </div>
    // </Flipped>
  );
};

export default PipelineCard;
