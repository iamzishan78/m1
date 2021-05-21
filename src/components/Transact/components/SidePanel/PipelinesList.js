import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Drawer,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton,
  InputBase,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Flipper } from "react-flip-toolkit";
import Sortly, { findDescendants, findParent } from "react-sortly";
import PipelineCard from "./PipelineCard";
import { setFlowState } from "actions";

const useStyles = makeStyles((theme) => ({
  flowlinesList: {
    margin: "5px 5px 10px 5px",
    overflowY: "auto",
    maxHeight: "75%",
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#506187",
      borderRadius: 5,
    },
  },
}));

function PipelinesList({ filteredPipelines, selectedPipe, selectedPipelines, setMultiSelection }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPipe) {
      setMultiSelection([selectedPipe._id]);
    }
  }, [selectedPipe]);

  const isCtrlKeyPressed = () => {
    if (window.event.ctrlKey || window.event.metaKey) return true;
    return false;
  };

  const checkMultiSelectPipelines = (newPipeline) => {
    if (newPipeline._id !== selectedPipe?._id) {
      const itemIndex = selectedPipelines.findIndex(
        (p) => p === newPipeline._id
      );
      let newPipelines = [];
      if (itemIndex === -1) {
        newPipelines = [...selectedPipelines, newPipeline._id];
      } else {
        selectedPipelines.splice(itemIndex, 1);
        newPipelines = [...selectedPipelines];
      }
      setMultiSelection(newPipelines);
    } else {
      setMultiSelection([selectedPipe?._id]);
      return false;
    }
  };

  const onFlowlineSelect = (newPipeline) => {
    if (isCtrlKeyPressed()) {
      checkMultiSelectPipelines(newPipeline)
    } else if (selectedPipe._id !== newPipeline._id) {
      dispatch(
        setFlowState({
          selectedPipe: newPipeline,
          pipeToShow: null,
        })
      );
    }
  };

  const handleChange = () => { };
  return (
    <List className={classes.flowlinesList}>
      <Flipper flipKey={filteredPipelines.map(({ id }) => id).join(".")}>
        <Sortly items={filteredPipelines} maxDepth={1} onChange={handleChange}>
          {(props) => (
            <PipelineCard
              index={props.id}
              pipeline={props.data}
              selectedPipe={selectedPipe}
              selectedPipelines={selectedPipelines}
              onFlowlineSelect={onFlowlineSelect}
            />
          )}
        </Sortly>
      </Flipper>
    </List>
  );
}

export default PipelinesList;
