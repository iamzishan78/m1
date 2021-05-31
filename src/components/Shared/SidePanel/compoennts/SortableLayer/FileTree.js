import React, { useContext, useEffect } from "react";
import { Flipper } from "react-flip-toolkit";
import { Box, Paper } from "@material-ui/core";
import update from "immutability-helper";

import Sortly, { findDescendants, findParent } from "react-sortly";
import LayerItem from "./LayerItem";
import { AppContext } from "AppContext";
import { UPDATELAYERSETTINGS } from "graphQL/useMutationUpdateLayerSettings";
import { UPDATEMANYLAYERSETTINGS } from "graphQL/useMutationUpdateManyLayerSettings";
import { useMutation } from "@apollo/client";
import { deepEqual } from "components/Shared/functions";
import { useStyles } from '../style';

const FileTree = ({ layerMap }) => {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);
  const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);
  const [items, setItems] = React.useState(layerMap);
  const itemsRef = React.useRef([]);
  const currentItem = React.useRef();
  const classes = useStyles();

  useEffect(() => {
    if (!deepEqual(items, layerMap)) {
      setItems(layerMap);
    }
  }, [layerMap]);

  const handleChange = (newItems) => {
    const index = newItems.findIndex((item) => item.id === currentItem.current.id);
    if (newItems[index].depth === 1) {
      const parent = findParent(newItems, index);
      if (parent.type !== "group") {
        newItems[index].depth = 0;
      }
    }
    setItems(newItems);
  };

  const handleToggleCollapse = (id) => {
    const index = items.findIndex((item) => item.id === id);
    const item = items[index];
    const { collapsed } = item;
    const descendants = findDescendants(items, index);
    const updateFn = {
      [index]: { collapsed: { $set: !collapsed } },
    };

    descendants.forEach((descendant) => {
      const descendantIndex = items.indexOf(descendant);
      updateFn[descendantIndex] = { collapsed: { $set: !collapsed } };
    });

    setItems(update(items, updateFn));
  };

  const handleDragBegin = (item) => {
    itemsRef.current = items;
    currentItem.current = item;
  };

  const revert = () => {
    setItems(itemsRef.current);
  };

  const handleDragEnd = (oldItem, newItem) => {
    if (oldItem.depth === 0 && newItem.depth === 1 && newItem.type === "group") {
      return revert();
    }

    let layersWithoutGroup = items.filter((l) => l.type !== "group");
    const layersToUpdate = [];
    let groupIndex;

    if (oldItem.depth === 0 && newItem.depth === 1) {
      // if layer into group
      groupIndex = items.findIndex((item) => item.id === newItem.id);
      const parent = findParent(items, groupIndex);
      if (parent.type === "group") {
        items[groupIndex].groupName = parent.name;
        items[groupIndex].groupId = parent.id;
      } else {
        return revert();
      }
    } else if (oldItem.depth === 1 && newItem.depth === 0) {
      groupIndex = items.findIndex((item) => item.id === newItem.id);
      items[groupIndex].groupName = null;
      items[groupIndex].groupId = null;
    }
    if (groupIndex) {
      groupIndex = layersWithoutGroup.findIndex((item) => item.id === newItem.id);
    }

    const sortedLayers = stateApp.layers.sort((a, b) => (a.position > b.position ? 1 : b.position > a.position ? -1 : 0));
    layersWithoutGroup.forEach((layer, i) => {
      if (i === groupIndex) {
        layersToUpdate.push({
          _id: layer._id,
          position: i,
          groupName: layer.groupName,
          groupId: layer.groupId,
        });
      } else if (sortedLayers[i]._id !== layer._id) {
        layersToUpdate.push({
          _id: layer._id,
          position: i,
          groupName: layer.groupName,
          groupId: layer.groupId,
        });
      }
      layer.position = i;
    });

    setStateApp({ ...stateApp, layers: [...layersWithoutGroup] });
    updateManyUserLayerSettings({
      variables: { manySettings: layersToUpdate },
    });
  };

  const updateLayer = (layer) => {
    const currentLayers = [...items];
    //// saving to stateApp
    const index = items.findIndex((item) => item._id === layer._id);
    currentLayers[index] = layer;
    setItems(currentLayers);
    setStateApp((stateApp) => ({
      ...stateApp,
      layers: currentLayers.filter((l) => l.type !== "group"),
    }));

    // saving to mongo
    updateLayerSettings({
      variables: {
        settings: {
          _id: layer._id,
          layerSettings: layer.layerSettings,
        },
      },
    });
  };

  return (
    <Box width={{ md: 500 }}>
      <Paper>
        <Box
          className={classes.fileTree}
        >
          <Flipper flipKey={items.map(({ id }) => id).join(".")}>
            <Sortly items={items} maxDepth={1} onChange={handleChange}>
              {(props) => (
                <LayerItem
                  {...props}
                  onToggleCollapse={handleToggleCollapse}
                  onDragEnd={handleDragEnd}
                  onDragBegin={handleDragBegin}
                  updateLayer={updateLayer}
                  stateApp
                />
              )}
            </Sortly>
          </Flipper>
        </Box>
      </Paper>
    </Box>
  );
};

export default FileTree;
