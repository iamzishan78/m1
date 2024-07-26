import React, { memo, useCallback, useEffect, useMemo } from "react";
import { Flipper } from "react-flip-toolkit";
import { Box, Paper } from "@material-ui/core";
import update from "immutability-helper";

import Sortly, { findDescendants, findParent } from "react-sortly";
import LayerItem from "./LayerItem";
import { UPDATELAYERSETTINGS } from "graphQL/useMutationUpdateLayerSettings";
import { UPDATEMANYLAYERSETTINGS } from "graphQL/useMutationUpdateManyLayerSettings";
import { UPDATE_USER_MAP_SETTINGS } from "graphQL/useMutationUserMapSettings";
import { useMutation } from "@apollo/client";
import { deepEqual } from "components/Shared/functions";
import { useStyles } from '../style';
import { globalStateController } from "hookstate/globalStateController";
import { layerController } from "hookstate/layerStateController";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { FEATURES } from "components/Shared/FeatureFlag/common";


const FileTree = ({ layerMap, panelItems }) => {
  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);
  const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);
  const [updateUserMapSettings] = useMutation(UPDATE_USER_MAP_SETTINGS, { refetchQueries: ["getLayerGroups"], awaitRefetchQueries: true });

  const [items, setItems] = React.useState(layerMap);
  const itemsRef = React.useRef([]);
  const currentItem = React.useRef();
  const classes = useStyles();

  const updateStateLayers = (currentLayers) => {
    globalStateController.updateState({ layers: currentLayers, previousLayers: currentLayers })
  }
  const checkforUpdate = (updateFn, previous, current, key) => {
    if (previous[key] !== current[key]) {
      updateFn = {
        ...updateFn,
        [key]: { $set: current[key] },
      }
    }
  }

  const updateItems = (previousLayers, currentLayers) => {
    if (!deepEqual(previousLayers, currentLayers)) {
      if (previousLayers.length === currentLayers.length) {
        const updateFn = {};
        previousLayers.forEach((item, index) => {
          const current = currentLayers[index]
          if (current.id !== item.id) {
            updateFn[index] = { $set: current }
          }
          else {
            if (current.type === 'group') {
              updateFn[index] = {
                showable: { $set: current.showable },
                visiable: { $set: current.visiable },
              }
            }
            checkforUpdate(updateFn[index], item, current, 'name')
            checkforUpdate(updateFn[index], item, current, 'layerName')
            checkforUpdate(updateFn[index], item, current, 'fileName')
            checkforUpdate(updateFn[index], item, current, 'fileUrl')
            if (item.layerSettings) {
              updateFn[index] = {
                ...updateFn[index],
                layerSettings: { $set: current.layerSettings },
                showable: { $set: current.layerSettings.showable },
                visiable: { $set: current.layerSettings.visiable },
                layerPaintProps: { $set: current.layerPaintProps },
                groupName: { $set: current.groupName },
                layerName: { $set: current.layerName },
                name: { $set: current.name }
              }
            }
          }
        })
        setItems(update(previousLayers, updateFn))
      } else
        setItems(currentLayers);
    }
  }

  useEffect(() => {
    updateItems(items, layerMap)
  }, [layerMap]);

  const handleChange = useCallback((newItems) => {
    const index = newItems.findIndex((item) => item.id === currentItem.current.id);
    if (newItems[index].depth === 1) {
      const parent = findParent(newItems, index);
      if (parent.type !== "group" || parent.collapsed) {
        newItems[index].depth = 0;
      }
    }
    setItems(newItems);
  }, []);

  const handleToggleCollapse = useCallback((id) => {
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
  }, [items, setItems]);

  const handleToggleGroup = useCallback((id) => {
    const index = items.findIndex((item) => item.id === id);
    const item = items[index];
    const { visiable } = item;
    const descendants = findDescendants(items, index).filter(l => l.layerSettings);
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

    layersToUpdate.forEach(layer => {
      layerController.handleDeckLayer(layer)
    });

    updateManyUserLayerSettings({
      variables: { manySettings: layersToUpdate.map((layer) => ({ _id: layer._id, layerSettings: layer.layerSettings })) },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleDragBegin = useCallback((item) => {
    itemsRef.current = items;
    currentItem.current = item;
  }, [items]);

  const revert = () => {
    setItems(itemsRef.current);
  };

  const handleDragEnd = useCallback((oldItem, newItem) => {
    if (oldItem.depth === 0 && newItem.depth === 1 && newItem.type === "group") {
      return revert();
    }

    let layersWithoutGroup = items.filter((l) => l.type !== "group" && !l.emptyLayer);
    let visibleLayers = layersWithoutGroup.filter((l) => l?.layerSettings?.showable && l?.layerSettings?.visiable);
    const visibleIndex = visibleLayers.findIndex((item) => item.id === newItem.id);
    layerController.changeLayerPosition(visibleLayers[visibleIndex], visibleLayers[visibleIndex - 1], visibleLayers[visibleIndex + 1])

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
    const sortedLayers = globalStateController.getValue('layers').sort((a, b) => (a.position > b.position ? 1 : b.position > a.position ? -1 : 0));
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
            user: globalStateController.getValue('user').mongoId,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const updateLayer = useCallback((layer) => {
    const currentLayers = [...items];
    // saving to stateApp
    const index = panelItems.findIndex((item) => item._id === layer._id);
    currentLayers[index] = layer;
    updateItems(items, currentLayers)

    updateStateLayers(currentLayers.filter((l) => l.type !== "group" && !l.emptyLayer))
    layerController.handleDeckLayer(layer)

    // // saving to mongo
    updateLayerSettings({
      variables: {
        settings: {
          _id: layer._id,
          layerSettings: layer.layerSettings,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, panelItems]);

  const filpKeys = useMemo(() => items.map(({ id }) => id).join("."), [items])
  return (
    <Box
    // width={{ md: 1000 }}
    >
      <Paper>
        <Box
          className={classes.fileTree}
          data-testid='layers'
        >
          <Flipper flipKey={filpKeys}>
            <Sortly items={items} maxDepth={1} onChange={handleChange}>
              {(props) => {
                if (['Recent Submitted Permits', 'Tracked Wells', 'User Tags'].includes(props?.data?.layerName)) {
                  let layerName = '';
                  switch (props?.data?.layerName) {
                    case 'Recent Submitted Permits':
                      layerName = FEATURES.RECENTPERMITLAYER;
                      break;

                    case 'Tracked Wells':
                      layerName = FEATURES.TRACKEDWELLSLAYER;
                      break;

                    case 'User Tags':
                      layerName = FEATURES.USERTAGSLAYER;
                      break;

                    default:
                      break;
                  }

                  return (
                    <FeatureFlag feature={layerName} >
                      <LayerItem
                        {...props}
                        onToggleCollapse={handleToggleCollapse}
                        onToggleGroup={handleToggleGroup}
                        onDragEnd={handleDragEnd}
                        onDragBegin={handleDragBegin}
                        updateLayer={updateLayer}
                      />
                    </FeatureFlag>
                  )
                } else {
                  return (<LayerItem
                    {...props}
                    onToggleCollapse={handleToggleCollapse}
                    onToggleGroup={handleToggleGroup}
                    onDragEnd={handleDragEnd}
                    onDragBegin={handleDragBegin}
                    updateLayer={updateLayer}
                  />)
                }
              }}
            </Sortly>
          </Flipper >
        </Box >
      </Paper >
    </Box >
  );
};

export default memo(FileTree);
