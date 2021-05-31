import React, { useEffect, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { List } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Flipper } from "react-flip-toolkit";
import update from "immutability-helper";
import Sortly, { findDescendants, findParent } from "react-sortly";
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

function PipelinesList({ filteredPipelines, selectedPipe, selectedPipelines, setMultiSelection }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const itemsRef = React.useRef([]);
  const currentItem = React.useRef();

  useEffect(() => {
    setItems(filteredPipelines);
  }, [filteredPipelines]);

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
    // Implement the api for position update
  };

  const handleToggleCollapse = (id) => {
    // const index = items.findIndex((item) => item.id === id);
    // const item = items[index];
    // const { collapsed } = item;
    // const descendants = findDescendants(items, index);
    // const updateFn = {
    //   [index]: { collapsed: { $set: !collapsed } },
    // };

    // descendants.forEach((descendant) => {
    //   const descendantIndex = items.indexOf(descendant);
    //   updateFn[descendantIndex] = { collapsed: { $set: !collapsed } };
    // });

    // setItems(update(items, updateFn));

    // ---------New Implementation
    const newItems = items.map((item) => {
      if (item.projectId === id || item.id === id) {
        return { ...item, collapsed: !item.collapsed };
      }
      return item;
    });
    setItems(newItems);
  };

  return (
    <Fragment>
      <List className={classes.flowlinesList}>
        <Flipper flipKey={items.map(({ id }) => id).join(".")}>
          <Sortly items={items} maxDepth={1} onChange={handleChange}>
            {(props) => {
              if (props.data.type === "Pipeline" && props.data.collapsed) {
                return (
                  <PipelineCard
                    {...props}
                    pipeline={props.data}
                    selectedPipe={selectedPipe}
                    selectedPipelines={selectedPipelines}
                    onFlowlineSelect={onFlowlineSelect}
                    handleDragBegin={handleDragBegin}
                    handleDragEnd={handleDragEnd}
                  />
                );
              } else if (props.data.type === "Project") {
                const projectPipelines = items.filter((p) => p.type === "Pipeline" && p.projectId === props.data.projectId);
                return (
                  <PipelineProject
                    {...props}
                    project={props.data}
                    containingPipelines={projectPipelines}
                    handleToggleCollapse={handleToggleCollapse}
                    handleDragBegin={handleDragBegin}
                    handleDragEnd={handleDragEnd}
                  />
                );
              } else return <></>;
            }}
          </Sortly>
        </Flipper>
      </List>
    </Fragment>
  );
}

export default PipelinesList;
