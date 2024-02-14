import React, { useContext, useEffect } from "react";
import { Flipper } from "react-flip-toolkit";
import { Box, Paper } from "@material-ui/core";
import update from "immutability-helper";

import Sortly, { findDescendants, findParent } from "react-sortly";
import LayerItem from "./LayerItem";
import { AppContext } from "AppContext";
import { UPDATELAYERSETTINGS } from "graphQL/useMutationUpdateLayerSettings";
import { UPDATEMANYLAYERSETTINGS } from "graphQL/useMutationUpdateManyLayerSettings";
import { UPDATE_USER_MAP_SETTINGS } from "graphQL/useMutationUserMapSettings";
import { useMutation } from "@apollo/client";
import { deepEqual } from "components/Shared/functions";
import { useStyles } from '../style';
import { hookStateApp } from "hookstate";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { FEATURES } from "components/Shared/FeatureFlag/common";


const FileTree = ({ layerMap, panelItems }) => {
  const [stateApp] = useContext(AppContext);

  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);
  const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);
  const [updateUserMapSettings] = useMutation(UPDATE_USER_MAP_SETTINGS, { refetchQueries: ["getLayerGroups"], awaitRefetchQueries: true });

  const [items, setItems] = React.useState(layerMap);
  const itemsRef = React.useRef([]);
  const currentItem = React.useRef();
  const classes = useStyles();

  const updateStateLayers = (currentLayers) => {
    stateApp.layers = currentLayers;
    hookStateApp.layers.set(currentLayers)
  }

  const checkforUpdate = (updateFn, item, index, key) => {
    if (item[key] !== layerMap[index][key]) {
      updateFn[index] = {
        ...updateFn[index],
        [key]: { $set: layerMap[index][key] },
      }
    }
  }

  useEffect(() => {
    if (!deepEqual(items, layerMap)) {
      if (items.length === layerMap.length) {
        const updateFn = {};
        items.forEach((item, index) => {
          if (layerMap[index].id !== item.id) {
            updateFn[index] = { $set: layerMap[index] }
          }
          else {
            if (layerMap[index].type === 'group') {
              updateFn[index] = {
                showable: { $set: layerMap[index].showable },
                visiable: { $set: layerMap[index].visiable },
              }
            }
            checkforUpdate(updateFn, item, index, 'name')
            checkforUpdate(updateFn, item, index, 'fileName')
            checkforUpdate(updateFn, item, index, 'fileUrl')
            if (item.layerSettings) {
              updateFn[index] = {
                ...updateFn[index],
                layerSettings: { $set: layerMap[index].layerSettings },
                showable: { $set: layerMap[index].layerSettings.showable },
                visiable: { $set: layerMap[index].layerSettings.visiable },
                layerPaintProps: { $set: layerMap[index].layerPaintProps },
                groupName: { $set: layerMap[index].groupName },
                layerName: { $set: layerMap[index].layerName }
              }
            }
          }
        })
        setItems(update(items, updateFn))
      } else
        setItems(layerMap);
    }
  }, [layerMap]);

  const handleChange = (newItems) => {
    const index = newItems.findIndex((item) => item.id === currentItem.current.id);
    if (newItems[index].depth === 1) {
      const parent = findParent(newItems, index);
      if (parent.type !== "group" || parent.collapsed) {
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
  const handleToggleGroup = (id) => {
    const index = items.findIndex((item) => item.id === id);
    const item = items[index];
    const { visiable } = item;
    const descendants = findDescendants(items, index);
    const updateFn = {
      [index]: { visiable: { $set: !visiable } },
    };
    const layersToUpdate = []
    const currentLayers = [...items];

    descendants.forEach((descendant) => {
      const descendantIndex = items.indexOf(descendant);
      updateFn[descendantIndex] = { layerSettings: { visiable: { $set: !visiable } } };
      const layer = {
        ...descendant,
        layerSettings: {
          ...descendant.layerSettings,
          visiable: !visiable,
        },
      };
      currentLayers[descendantIndex] = layer
      layersToUpdate.push(layer)
    });

    setItems(update(items, updateFn));

    updateStateLayers(currentLayers.filter((l) => l.type !== "group" && !l.emptyLayer))

    updateManyUserLayerSettings({
      variables: { manySettings: layersToUpdate.map((layer) => ({ _id: layer._id, layerSettings: layer.layerSettings })) },
    });
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

    let layersWithoutGroup = items.filter((l) => l.type !== "group" && !l.emptyLayer);
    const layersToUpdate = [];
    const itemIndex = items.findIndex((item) => item.id === newItem.id);
    const descendants = findDescendants(items, itemIndex).filter((item) => !item.emptyLayer);

    if (newItem.depth === 1) {
      // if layer into group
      const parent = findParent(items, itemIndex);
      if (parent.type === "group" && ((oldItem.groupName === 'Agreements' && parent.name === 'Agreements') || (oldItem.groupName !== 'Agreements' && parent.name !== 'Agreements'))) {
        items[itemIndex].groupName = parent.name;
        items[itemIndex].groupId = parent.id;
      } else {
        return revert();
      }
    } else if (oldItem.depth === 1 && newItem.depth === 0) {
      if (oldItem.groupName === 'Agreements') {
        return revert();
      } else {
        items[itemIndex].groupName = null;
        items[itemIndex].groupId = null;
      }
    }

    const sortedLayers = stateApp.layers.sort((a, b) => (a.position > b.position ? 1 : b.position > a.position ? -1 : 0));
    layersWithoutGroup.forEach((layer, i) => {
      if (layer._id === newItem._id || sortedLayers[i]._id !== layer._id) {
        layersToUpdate.push({
          _id: layer._id,
          position: i,
          groupName: layer.groupName,
          groupId: layer.groupId,
        });
      }
      layer.position = i;
    });

    if (newItem.type === 'group' && descendants.length === 0) {
      updateUserMapSettings({
        variables: {
          settings: {
            user: stateApp.user.mongoId,
            type: 'LayerGroup',
            settings: { [newItem.id]: { above: items[itemIndex - 1]?.id, below: items[itemIndex + 1]?.id } },
          },
        },
      });
    } else {
      updateStateLayers([...layersWithoutGroup])
    }


    updateManyUserLayerSettings({
      variables: { manySettings: layersToUpdate },
    });
  };

  const updateLayer = (layer) => {
    const currentLayers = [...items];
    //// saving to stateApp
    const index = panelItems.findIndex((item) => item._id === layer._id);
    currentLayers[index] = layer;
    setItems(currentLayers);
    updateStateLayers(currentLayers.filter((l) => l.type !== "group" && !l.emptyLayer))

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
    <Box
    // width={{ md: 1000 }}
    >
      <Paper>
        <Box
          className={classes.fileTree}
        >
          <Flipper flipKey={items.map(({ id }) => id).join(".")}>
            <Sortly items={items} maxDepth={1} onChange={handleChange}>
              {(props) =>
                    props?.data?.layerName === "Recent Submitted Permits" ? (
                      <FeatureFlag feature={FEATURES.RECENTPERMITLAYER} > 
                          <LayerItem
                          {...props}
                          onToggleCollapse={handleToggleCollapse}
                          onToggleGroup={handleToggleGroup}
                          onDragEnd={handleDragEnd}
                          onDragBegin={handleDragBegin}
                          updateLayer={updateLayer}
                          map={stateApp?.map}
                        />
                      </FeatureFlag>
                  ) :
                   (<LayerItem
                    {...props}
                    onToggleCollapse={handleToggleCollapse}
                    onToggleGroup={handleToggleGroup}
                    onDragEnd={handleDragEnd}
                    onDragBegin={handleDragBegin}
                    updateLayer={updateLayer}
                    map={stateApp?.map}
                  />)
                }
            </Sortly>
          </Flipper>
        </Box>
      </Paper>
    </Box>
  );
};

export default FileTree;
