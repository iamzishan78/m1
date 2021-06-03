import React, { useEffect, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { List } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/client";
import { Flipper } from "react-flip-toolkit";
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
        newItems[index].projectName = parent.name;
        newItems[index].projectId = parent._id;
      } else if (parent.type === 'Project' && parent.id !== newItems[index].parentId) {
        newItems[index].projectName = parent.name;
        newItems[index].projectId = parent._id;
      }
    } else {
      if (newItems[index].projectId && newItems[index].type === 'Pipeline') {
        newItems[index].projectName = null;
        newItems[index].projectId = null;
      }
    }
    currentItem.current = newItems[index];
    setItems(newItems);
    console.log("in handle change");
  };

  const handleDragBegin = (item) => {
    itemsRef.current = filteredPipelines;
    currentItem.current = item;
  };

  const revert = () => {
    // setItems(itemsRef.current);
  };

  const handleDragEnd = (oldItem, newItem) => {
    console.log("in drag end");
    let itemsToUpdate = [];
    // Pipelines / Projects of same depth
    const itemIndex = items.findIndex(item => item.id === newItem.id);
    const parent = findParent(items, itemIndex) || items[itemIndex - 1];
    const parentIndex = items.findIndex(item => item.id === parent?.id);
    const successor = items[itemIndex + 1];
    if (parent?.position && successor?.position && Math.abs(parent.position - successor.position) !== 1) {
      itemsToUpdate.push({ ...newItem, position: parent?.position + 1 });
    } else {
      if (parent?.type === 'Project') {
        if (!oldItem.projectId) {
          items[itemIndex].projectId = parent.id;
          items[itemIndex].projectName = parent.projectName;
          items[itemIndex].switchType = 'addDescriptor';
        } else if (oldItem.projectId !== null && oldItem.projectId !== newItem.projectId) {
          items[itemIndex].projectId = parent.id;
          items[itemIndex].projectName = parent.projectName;
          items[itemIndex].switchType = 'updateDescriptor';
        }
        const descendants = findDescendants(items, parentIndex);
        itemsToUpdate = descendants.map((d, index) => ({ ...d, position: index }));
      } else {
        if (oldItem.projectId && !newItem.projectId) {
          items[itemIndex].switchType = 'deleteDescriptor';
        }
        let lastPosition;
        for (let i = itemIndex; i < items.length; i += 1) {
          if ((!items[i].projectId || items[i].type === 'Project')) {
            lastPosition = lastPosition ? lastPosition + 1 : parent?.position + 1 || i;
            itemsToUpdate.push({ ...items[i], position: lastPosition });
          }
        }
      }
    }

    // Implement the api for position update
    updatePipelinesPositions({
      variables: {
        data: itemsToUpdate,
        userId
      },
      refetchQueries: ['getPipelines']
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
