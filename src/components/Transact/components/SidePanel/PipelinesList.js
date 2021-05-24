import React, { useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import { List } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Flipper } from "react-flip-toolkit";
import Sortly, { findDescendants, findParent } from "react-sortly";
import PipelineGroup from "./PipelineProject";
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

function PipelinesList({
  filteredPipelines,
  selectedPipe,
  selectedPipelines,
  setMultiSelection,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPipe) {
      setMultiSelection([selectedPipe._id]);
    }
  }, [selectedPipe, setMultiSelection]);

  const isCtrlKeyPressed = () => {
    if (window.event.ctrlKey || window.event.metaKey) return true;
    return false;
  };

  const isShiftKeyPressed = () => {
    if (window.event.shiftKey) return true;
    return false;
  };

  const checkMultiSelectPipelines = (newPipeline) => {
    let newPipelines = [];
    const itemIndex = selectedPipelines.findIndex((p) => p === newPipeline._id);
    if (isCtrlKeyPressed()) {
      if (itemIndex === -1) {
        newPipelines = [...selectedPipelines, newPipeline._id];
      } else {
        selectedPipelines.splice(itemIndex, 1);
        newPipelines = [...selectedPipelines];
      }
      setMultiSelection(newPipelines);
    } else if (isShiftKeyPressed() && itemIndex === -1) {
      let newPipelineIndex = filteredPipelines.findIndex(
        (p) => p._id === newPipeline._id
      );
      let oldPipelineIndex = filteredPipelines.findIndex(
        (p) => p._id === selectedPipelines[selectedPipelines.length - 1]
      );
      if (newPipelineIndex < oldPipelineIndex) {
        newPipelineIndex = newPipelineIndex + oldPipelineIndex;
        oldPipelineIndex = newPipelineIndex - oldPipelineIndex;
        newPipelineIndex = newPipelineIndex - oldPipelineIndex;
      }
      newPipelines = [
        ...selectedPipelines,
        ...filteredPipelines
          .slice(oldPipelineIndex, newPipelineIndex + 1)
          .map((p) => p._id),
      ];
      newPipelines = [...new Set(newPipelines)];
      setMultiSelection(newPipelines);
    } else {
      dispatch(
        setFlowState({
          selectedPipe: newPipeline,
          pipeToShow: null,
        })
      );
    }
  };

  const onFlowlineSelect = (newPipeline) => {
    if (selectedPipe._id !== newPipeline._id) {
      checkMultiSelectPipelines(newPipeline);
    } else {
      setMultiSelection([selectedPipe?._id]);
    }
  };

  const PipelineCardWrapper = ({ pipelines }) => (
    <Flipper flipKey={pipelines.map(({ id }) => id).join(".")}>
      <Sortly items={pipelines} maxDepth={1} onChange={handleChange}>
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
  );

  const handleChange = () => { };
  return (
    <Fragment>
      <List className={classes.flowlinesList}>
        <PipelineCardWrapper
          pipelines={filteredPipelines.filter(
            (p) => p.type === "Pipeline" && !p.projectId
          )}
        />
        {filteredPipelines
          .filter((pipe) => pipe.type === "Project")
          .map((pipe, index) => {
            const projectPipelines = filteredPipelines.filter(
              (p) => p.type === "Pipeline" && p.projectId === pipe.projectId
            );
            return (
              <Fragment key={index}>
                <PipelineGroup
                  heading={`${pipe.projectName} (${projectPipelines.length})`}
                >
                  <PipelineCardWrapper pipelines={projectPipelines} />
                </PipelineGroup>
              </Fragment>
            );
          })}
      </List>
    </Fragment>
  );
}

export default PipelinesList;
