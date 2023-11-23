import React, { useState, useEffect, useContext } from "react";
import { useMutation } from "@apollo/client";
import AddLayerIcon from "@material-ui/icons/Queue";
import { MapControlsContext } from "../../MapControls/MapControlsContext";
import { AppContext } from "AppContext";
import Panel from "./compoennts/Panel";
import { UPDATELAYERSETTINGS } from "graphQL/useMutationUpdateLayerSettings";
import { useDispatch } from "react-redux";
import { setMapGridCardState } from "actions";
import { hookStateApp } from "hookstate";
import { copy } from "utils/helper";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const reorderLayers = (list, startPosition, endPosition) => {
  const reorderedLayers = Array.from(list);
  let startIndex = reorderedLayers.findIndex((layer) => layer.position == startPosition);
  let endIndex = reorderedLayers.findIndex((layer) => layer.position == endPosition);

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

export default function SidePanel({ showSidePanel }) {
  const [dragFunction, setDragFunction] = useState();
  const [toggleFunction, setToggleFunction] = useState();
  const [panelItems, setPanelItems] = useState();
  const [panelButton, setPanelButton] = useState();
  const [panelTitle, setPanelTitle] = useState();
  const [headerFilters, setHeaderFilters] = useState();
  const dispatch = useDispatch();

  const [stateMapControls, setStateMapControls] = useContext(MapControlsContext);

  const { selectedControl: panelType } = stateMapControls;

  const [stateApp, setStateApp] = useContext(AppContext);
  const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

  const openManager = (type) => {
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      manageTransferData: false,
      [`${type === 'manageLayer' ? 'manageLayer' : 'manageSourceLayer'}`]: true,
      [`${type === 'manageLayer' ? 'manageSourceLayer' : 'manageLayer'}`]: null,
      selectedLayer: null,
    }));
    setStateApp((stateApp) => ({
      ...stateApp,
      layerGridCard: null,
      selectedLayer: null,
    }))
    dispatch(setMapGridCardState({ mapGridCardActivated: false }));
  };

  const panelButtons = {
    layer: {
      text: "New Layer",
      fn: (type = 'manageLayer') => openManager(type),
      icon: <AddLayerIcon />,
    },
  };

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

        const items = reorder(stateApp.baseMapLayers, result.source.index, result.destination.index);

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
        if (stateApp.baseMapLayers[index]?.name === 'Land Grid') {
          const currentLayers = [...stateApp.layers];
          const layer = copy(currentLayers.find((layer) => layer.identifier === 'Land Grid'));
          if (layer) {
            layer.layerSettings.visiable = !layer.layerSettings.visiable
            hookStateApp.layers.set([...currentLayers])
            stateApp.layers = [...currentLayers]
            // saving to mongo
            updateLayerSettings({
              variables: {
                settings: {
                  _id: layer._id,
                  layerSettings: layer.layerSettings,
                },
              },
            });
          }
        }

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

  //   for Layer Panel
  useEffect(() => {
    if ((panelType === "layer" || panelType === null)) {
      if (panelTitle !== "Layers")
        setPanelTitle("Layers");
      if (panelButton !== panelButtons[panelType])
        setPanelButton(panelButtons[panelType]);
      if (headerFilters !== null)
        setHeaderFilters(null);

    }
  }, [panelType]);

  //   for HeatMap Panel
  useEffect(() => {
    if (panelType === "heatMaps") {
      setDragFunction(() => (result) => {
        // dropped outside the list
        if (!result.destination) {
          return;
        }

        const items = reorder(stateApp.heatLayers, result.source.index, result.destination.index);

        let checkedHeats = stateApp.checkedHeats.slice(0);
        const sourceIndex = checkedHeats.indexOf(result.source.index);

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

        for (let i = 0; i < checkedHeats.length; i++) {
          if (checkedHeats[i] <= to && checkedHeats[i] >= from) {
            checkedHeats[i] += direction;
          }
        }

        if (sourceIndex !== -1) {
          checkedHeats[sourceIndex] = result.destination.index;
        }

        setStateApp({
          ...stateApp,
          heatLayers: items,
          checkedHeats: checkedHeats,
        });
      });
      setToggleFunction(() => ({ index }) => {
        const currentIndex = stateApp.checkedHeats.indexOf(index);
        const newChecked = [...stateApp.checkedHeats];

        if (currentIndex === -1) {
          newChecked.push(index);
        } else {
          newChecked.splice(currentIndex, 1);
        }
        setStateApp((stateApp) => ({ ...stateApp, checkedHeats: newChecked }));
      });
      setPanelItems(stateApp.heatLayers);
      setPanelTitle("Heatmaps");
      setPanelButton(null);
      setHeaderFilters(null);
    }
  }, [panelType, stateApp.heatLayers, stateApp.checkedHeats]);

  //   for Marketplace Panel
  useEffect(() => {
    if (panelType === "marketplace") {
      setDragFunction(() => { });
      setToggleFunction(() => { });
      // setPanelItems(stateApp.layers);
      setPanelTitle("Marketplace");
      setPanelButton(null);
      setHeaderFilters(null);
    }
  }, [panelType]);

  useEffect(() => {
    if (panelType === "filter") {
      setPanelTitle("Filters");
      setPanelButton(null)
    }
  }, [panelType]);

  return panelItems || panelTitle ? (
    <Panel
      type={panelType}
      headerButton={panelButton}
      headerFilters={headerFilters}
      title={panelTitle}
      panelItems={panelItems}
      onDragEnd={dragFunction}
      handleToggle={toggleFunction}
      showSidePanel={showSidePanel}
    />
  ) : null;
}
