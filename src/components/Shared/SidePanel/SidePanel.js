import React, { useState, useEffect, useContext, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { MapControlsContext } from "../../MapControls/MapControlsContext";
import { AppContext } from "../../../AppContext";
import Panel from "./compoennts/Panel";
import { UPDATELAYERSETTINGS } from "../../../graphQL/useMutationUpdateLayerSettings";
import { UPDATEMANYLAYERSETTINGS } from "../../../graphQL/useMutationUpdateManyLayerSettings";

const reorderBasemap = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const reorderLayers = (list, startPosition, endPosition) => {
  const reorderedLayers = Array.from(list);
  let startIndex = reorderedLayers.findIndex(
    (layer) => layer.position == startPosition
  );
  let endIndex = reorderedLayers.findIndex(
    (layer) => layer.position == endPosition
  );

  //// switch positions between layers
  let endI = endIndex;
  while (endI > startIndex) {
    let temp = reorderedLayers[endI].position;
    reorderedLayers[endI] = {
      ...reorderedLayers[endI],
      position: reorderedLayers[endI - 1].position,
    };
    reorderedLayers[endI - 1] = {
      ...reorderedLayers[endI - 1],
      position: temp,
    };
    endI--;
  }
  while (endI < startIndex) {
    let temp = reorderedLayers[endI].position;
    reorderedLayers[endI] = {
      ...reorderedLayers[endI],
      position: reorderedLayers[endI + 1].position,
    };
    reorderedLayers[endI + 1] = {
      ...reorderedLayers[endI + 1],
      position: temp,
    };
    endI++;
  }

  //// reorder the stateApp.layers
  const [removed] = reorderedLayers.splice(startIndex, 1);
  reorderedLayers.splice(endIndex, 0, removed);

  //// separate the layers to update
  let layersToUpdate = reorderedLayers
    .filter(
      (currentValue, index) =>
        (startIndex < endIndex && startIndex <= index && index <= endIndex) ||
        (startIndex > endIndex && startIndex >= index && index >= endIndex)
    )
    .map((layer) => ({ _id: layer._id, position: layer.position }));

  return { reorderedLayers, layersToUpdate };
};

export default function SidePanel() {
  const [dragFunction, setDragFunction] = useState();
  const [toggleFunction, setToggleFunction] = useState();
  const [panelItems, setPanelItems] = useState();
  const [panelButton, setPanelButton] = useState();
  const [panelTitle, setPanelTitle] = useState();
  const [headerFilters, setHeaderFilters] = useState();

  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );

  const { selectedControl: panelType } = stateMapControls;

  const [stateApp, setStateApp] = useContext(AppContext);
  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);
  const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);

  //   for BaseMap Panel
  useEffect(() => {
    if (panelType === "base") {
      setPanelItems(stateApp.baseMapLayers);
      setPanelTitle("Base Map");
      setPanelButton(null);
      setHeaderFilters(null);

      setDragFunction(() => (result) => {
        // dropped outside the list
        if (!result.destination) {
          return;
        }

        const items = reorderBasemap(
          stateApp.baseMapLayers,
          result.source.index,
          result.destination.index
        );

        let checkedBaseLayers = stateApp.checkedBaseLayers.slice(0);
        const sourceIndex = checkedBaseLayers.indexOf(result.source.index);

        let direction = 0;
        let from,
          to = 0;
        if (result.destination.index > result.source.index) {
          direction = -1;
          from = result.source.index;
          to = result.destination.index;
        } else {
          direction = 1;
          to = result.source.index;
          from = result.destination.index;
        }

        for (let i = 0; i < checkedBaseLayers.length; i++) {
          if (checkedBaseLayers[i] <= to && checkedBaseLayers[i] >= from) {
            checkedBaseLayers[i] += direction;
          }
        }

        if (sourceIndex !== -1) {
          checkedBaseLayers[sourceIndex] = result.destination.index;
        }

        setStateApp({
          ...stateApp,
          baseMapLayers: items,
          checkedBaseLayers: checkedBaseLayers,
        });
      });

      setToggleFunction(() => ({ index }) => {
        const currentIndex = stateApp.checkedBaseLayers.indexOf(index);
        let newChecked = [...stateApp.checkedBaseLayers];
        if (currentIndex === -1) {
          newChecked.push(index);
        } else {
          newChecked.splice(currentIndex, 1);
        }
        setStateApp((stateApp) => ({
          ...stateApp,
          checkedBaseLayers: newChecked,
        }));
      });
    }
  }, [panelType, stateApp.baseMapLayers, stateApp.checkedBaseLayers]);

  //   for BaseMap Panel
  useEffect(() => {
    if (panelType === "layer") {
      setPanelItems(stateApp.layers);
      setPanelTitle("Layer Visibility");
      setPanelButton(null);
      setHeaderFilters(null);

      setDragFunction(() => (result) => {
        if (!result.destination) {
          return;
        }

        if (result.source.index !== result.destination.index) {
          const { reorderedLayers, layersToUpdate } = reorderLayers(
            stateApp.layers,
            result.source.index,
            result.destination.index
          );

          setStateApp({
            ...stateApp,
            layers: [...reorderedLayers],
          });

          updateManyUserLayerSettings({
            variables: {
              manySettings: layersToUpdate,
            },
          });
        }
      });

      setToggleFunction(() => ({ layer, index }) => {
        const currentLayers = [...stateApp.layers];
        const updatedLayer = {
          ...layer,
          layerSettings: {
            ...layer.layerSettings,
            visiable: !layer.layerSettings.visiable,
          },
        };

        //// saving to stateApp
        currentLayers[index] = updatedLayer;
        setStateApp((stateApp) => ({
          ...stateApp,
          layers: [...currentLayers],
        }));

        //// saving to mongo
        updateLayerSettings({
          variables: {
            settings: {
              _id: updatedLayer._id,
              layerSettings: updatedLayer.layerSettings,
            },
          },
        });
      });
    }
  }, [panelType, stateApp.layers]);

  //   for Marketplace Panel
  useEffect(() => {
    if (panelType === "marketplace") {
      setDragFunction(() => {});
      setToggleFunction(() => {});
      // setPanelItems(stateApp.layers);
      setPanelTitle(null);
      setPanelButton(null);
      setHeaderFilters(null);
    }
  }, [panelType]);

  return (
    <Panel
      type={panelType}
      headerButton={panelButton}
      headerFilters={headerFilters}
      title={panelTitle}
      items={panelItems}
      onDragEnd={dragFunction}
      handleToggle={toggleFunction}
    />
  );
}
