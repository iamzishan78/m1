import React, { useEffect, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { List } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/client";
import { Flipper } from "react-flip-toolkit";
import { deepEqual } from "components/Shared/functions";
import update from "immutability-helper";
import Sortly, { findDescendants, findParent } from "react-sortly";
import PipelineProject from "./PipelineProject";
import PipelineCard from "./PipelineCard";
import { setFlowState } from "actions";
import { UPDATE_PIPELINES_POSITIONS } from "graphQL/useMutationUpdatePipelinesPositions";

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

function PipelinesList({ filteredPipelines, selectedPipe, selectedPipelines, setMultiSelection, userId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const itemsRef = React.useRef([]);
  const currentItem = React.useRef();
  // MUTATIONS
  const [updatePipelinesPositions] = useMutation(UPDATE_PIPELINES_POSITIONS);

  useEffect(() => {
    if (!deepEqual(items, filteredPipelines)) {
      let updateFn = {};
      filteredPipelines.forEach((item, index) => {
        const i = items.findIndex((pipe) => pipe.id === item.id);
        if (i !== -1) {
          const parent = findParent(items, i);
          if (parent) {
            updateFn[index] = { collapsed: { $set: parent.collapsed } };
          } else {
            updateFn[index] = { collapsed: { $set: items[i].collapsed } };
          }
        } else {
          if (item.projectId && item.type === "Pipeline") {
            const parent = items.find((i) => i.type === "Project" && i.projectId === item.projectId);
            if (parent) {
              updateFn[index] = { collapsed: { $set: parent.collapsed } };
            } else {
              updateFn[index] = { collapsed: { $set: item.collapsed } };
            }
          } else {
            updateFn[index] = { collapsed: { $set: item.collapsed } };
          }
        }
      });
      setItems(update(filteredPipelines, updateFn));
    }
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
    currentItem.current = newItems[index];
    setItems(newItems);
    console.log("in handle change");
  };

  const handleDragBegin = (item) => {
    itemsRef.current = filteredPipelines;
    currentItem.current = item;
  };

  const revert = () => {
    setItems(itemsRef.current);
  };

  const handleDragEnd = (oldItem, newItem) => {
    let itemsToUpdate = [];
    const itemIndex = items.findIndex((item) => item.id === newItem.id);
    let parent = findParent(items, itemIndex) || items[itemIndex - 1];
    let parentIndex = items.findIndex((item) => item.id === parent?.id);
    let isPassed = false;
    items.forEach((item, index) => {
      if (item.id === newItem.id) isPassed = true;
      if (!isPassed) {
        if (newItem.depth === 0 && (item.type === "Project" || (item.type === "Pipeline" && !item.projectId))) {
          parent = item;
          parentIndex = index;
        }
      }
    });

    function getSuccessorItems(type) {
      let newItems = [];
      switch (type) {
        case "ALL":
          const initialIndex = itemIndex;
          let newPosition = parent?.position || itemIndex - 1;
          for (let i = initialIndex; i < items.length; i = i + 1) {
            if (items[i].depth === 0) {
              newPosition += 1;
              newItems.push({ ...items[i], position: newPosition });
            }
          }
          return newItems;
        case "PROJECT_CHILDS":
          const descendants = findDescendants(items, parentIndex);
          newItems = descendants.map((d, index) => ({
            ...d,
            position: index,
            projectId: parent.projectId,
            projectName: parent.projectName,
          }));
          return newItems;
        default:
      }
    }
    // we have parent and we have current item
    if (newItem.depth === 1) {
      if (newItem.type === "Pipeline" && (!parent || parent.type === "Pipeline")) newItem.depth = 0;
      else if (newItem.type === "Project" && parent.type === "Pipeline") {
        revert();
        return;
      } else if (newItem.type === "Project" && parent.type === "Project") {
        let perentDescendants = findDescendants(items, parentIndex);
        const selfDescendants = findDescendants(items, itemIndex).map((item) => item._id);
        perentDescendants = perentDescendants.filter((d) => !selfDescendants.includes(d._id));
        if (perentDescendants.findIndex((d) => d.projectId === newItem.projectId) !== perentDescendants.length - 1) {
          revert();
          return;
        }
        newItem.depth = 0;
      } else {
        itemsToUpdate = getSuccessorItems("PROJECT_CHILDS");
        const itemIndex = itemsToUpdate.findIndex((i) => i.id === newItem.id);
        if (oldItem.depth === 0) {
          itemsToUpdate[itemIndex].switchType = "addDescriptor";
        } else if (oldItem.depth === newItem.depth && newItem.projectId !== parent.projectId) {
          itemsToUpdate[itemIndex].projectId = parent.projectId;
          itemsToUpdate[itemIndex].projectName = parent.projectName;
          itemsToUpdate[itemIndex].switchType = "updateDescriptor";
        }
      }
    }
    if (newItem.depth === 0) {
      itemsToUpdate = getSuccessorItems("ALL");
      if (oldItem.depth === 1) {
        itemsToUpdate[0].switchType = "deleteDescriptor";
      }
    }
    // Implement the api for position update
    updatePipelinesPositions({
      variables: {
        data: itemsToUpdate,
        userId,
      },
      refetchQueries: ["getPipelines"],
    });
  };

  const handleToggleCollapse = (id) => {
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
