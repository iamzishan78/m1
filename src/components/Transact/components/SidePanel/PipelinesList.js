import React, { useEffect, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { List } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Flipper } from "react-flip-toolkit";
import Sortly, { findDescendants, findParent, useDrag, useDrop, useIsClosestDragging } from "react-sortly";
import PipelineProject from "./PipelineProject";
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
      "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#506187",
      borderRadius: 5,
    },
  },
}));

function PipelinesList({ filteredPipelines, setPipelines, selectedPipe, selectedPipelines, setMultiSelection }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [items, setItems] = useState([])
  const itemsRef = React.useRef([]);
  const currentItem = React.useRef();

  useEffect(() => {
    if (items.length === 0) {
      setItems(filteredPipelines.filter((p) => p.type === "Pipeline" && !p.projectId))
    }
  }, [filteredPipelines])

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
      let newPipelineIndex = filteredPipelines.findIndex((p) => p._id === newPipeline._id);
      let oldPipelineIndex = filteredPipelines.findIndex((p) => p._id === selectedPipelines[selectedPipelines.length - 1]);
      if (newPipelineIndex < oldPipelineIndex) {
        newPipelineIndex = newPipelineIndex + oldPipelineIndex;
        oldPipelineIndex = newPipelineIndex - oldPipelineIndex;
        newPipelineIndex = newPipelineIndex - oldPipelineIndex;
      }
      newPipelines = [...selectedPipelines, ...filteredPipelines.slice(oldPipelineIndex, newPipelineIndex + 1).map((p) => p._id)];
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

  const handleChange = (newItems) => {
    const index = newItems.findIndex((item) => item.id === currentItem.current.id);
    if (newItems[index].depth === 1) {
      const parent = findParent(newItems, index);
      if (parent.type !== "Project") {
        newItems[index].depth = 0;
      }
    }
    currentItem.current = newItems[index];
    setItems(newItems);
    console.log("in handle change");
  };

  const handleDragBegin = (item) => {
    itemsRef.current = filteredPipelines;
    currentItem.current = item;
    console.log("in drag begin");
  };

  const revert = () => {
    // setItems(itemsRef.current);
  };

  const handleDragEnd = (oldItem, newItem) => {
    console.log("in drag end");
  };


  // const [{ isDragging }, drag, preview] = useDrag({
  //   collect: (monitor) => {
  //     return {
  //       isDragging: monitor.isDragging(),
  //     };
  //   },
  //   begin(f) {
  //     // itemRef.current = pipeline;
  //     // onDragBegin(pipeline);
  //     console.log("drag begin");
  //   },
  //   end(f) {
  //     // onDragEnd(itemRef.current, pipeline);
  //     console.log("drag end");
  //   },
  // });
  // const [, drop] = useDrop();

  return (
    <Fragment>
      <List className={classes.flowlinesList}>

        <Flipper flipKey={items.map(({ _id }) => _id).join(".")}>
          <Sortly items={items} maxDepth={1} onChange={handleChange}>
            {(props) => (
              <PipelineCard
                {...props}
                pipeline={props.data}
                selectedPipe={selectedPipe}
                selectedPipelines={selectedPipelines}
                onFlowlineSelect={onFlowlineSelect}
                handleDragBegin={handleDragBegin}
                handleDragEnd={handleDragEnd}
              />
            )}
          </Sortly>
        </Flipper>

        {/* <PipelineCardWrapper pipelines={items} /> */}
        {/* {filteredPipelines
          .filter((pipe) => pipe.type === "Project")
          .map((pipe, index) => {
            const projectPipelines = filteredPipelines.filter((p) => p.type === "Pipeline" && p.projectId === pipe.projectId);
            const project = {
              projectName: pipe.projectName,
              projectId: pipe.projectId,
            };
            return (
              <PipelineProject project={project} containingPipelines={projectPipelines}>
                <PipelineCardWrapper pipelines={projectPipelines} />
              </PipelineProject>
            );
          })} */}
      </List>
    </Fragment>
  );
}

export default PipelinesList;
