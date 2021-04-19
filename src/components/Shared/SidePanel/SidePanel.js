import React, { useState, useEffect, useContext, useCallback } from "react";
import { useMutation } from "@apollo/client";
import AddIcon from "@material-ui/icons/Add";
import { MapControlsContext } from "../../MapControls/MapControlsContext";
import { AppContext } from "../../../AppContext";
import Panel from "./compoennts/Panel";
import { UPDATELAYERSETTINGS } from "../../../graphQL/useMutationUpdateLayerSettings";
import { UPDATEMANYLAYERSETTINGS } from "../../../graphQL/useMutationUpdateManyLayerSettings";

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const reorderLayers = (list, startPosition, endPosition) => {
	debugger;
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

	const openAddLayer = () => {
		setStateMapControls((stateMapControls) => ({
			...stateMapControls,
			addLayer: true,
		}));
	};

	const panelButtons = {
		layer: {
			text: "Add Layer",
			fn: openAddLayer,
			icon: <AddIcon />,
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

				const items = reorder(
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

	//   for Layer Panel
	useEffect(() => {
		if (panelType === "layer" || panelType === null) {
			const groupHandled = []
			const layerAndGroups = []
			stateApp.layers && stateApp.layers.forEach((item) => {
				if (item.groupId && !groupHandled.includes(item.groupId)) {
					groupHandled.push(item.groupId)
					const groups = stateApp.layers.filter((i) => i.groupId === item.groupId)
					layerAndGroups.push({
						depth: 0,
						type: 'group',
						collapsed: true,
						name: item.groupName
						, id: item.groupId
					})
					groups.forEach((item) => { layerAndGroups.push({ ...item, collapsed: true, name: item.layerName, depth: 1, type: 'layer', id: item._id }) })
				}
				if (!item.groupId) {
					layerAndGroups.push({ ...item, name: item.layerName, depth: 0, type: 'layer', id: item._id })
				}
			})

			setPanelItems(layerAndGroups);
			setPanelTitle("Layer Visibility");
			setPanelButton(panelButtons[panelType]);
			setHeaderFilters(null);

			setDragFunction(() => (result) => {
				if (!result.destination) { return; }
				const isSourceGroup = result.source.droppableId !== 'droppableM1'
				const isDestinationGroup = result.destination.droppableId !== 'droppableM1'

				if (isDestinationGroup) {
					let group = layerAndGroups.find((layer) => layer.groupId == result.destination.droppableId)
					result.destination.index += group.groups[0].position
				}
				if (isSourceGroup) {
					let group = layerAndGroups.find((layer) => layer.groupId == result.source.droppableId)
					result.source.index += group.groups[0].position
					// result.destination.index -= 1
				}
				if (!isSourceGroup && !isDestinationGroup && layerAndGroups[result.source.index - 1]?.groupId) {
					// let source = result.source.index;
					let destination = result.destination.index;
					let newOrder = { reorderedLayers: stateApp.layers };
					let layersToUpdate = []
					layerAndGroups[result.source.index - 1].groups.forEach((layer, index) => {
						newOrder = reorderLayers(
							newOrder.reorderedLayers,
							layer.position,
							destination++
						);
						if (layerAndGroups[result.source.index - 1].groups.length - 1 === index) {
							layersToUpdate = [...layersToUpdate, ...newOrder.layersToUpdate]
						} else {
							layersToUpdate.push(newOrder.layersToUpdate[0])
						}
					})
					setStateApp({
						...stateApp,
						layers: [...newOrder.reorderedLayers],
					});
					updateManyUserLayerSettings({
						variables: {
							manySettings: layersToUpdate,
						},
					});
				}

				else if (result.source.index !== result.destination.index) {
					stateApp.layers.find((l, index) => {
						if (l.position === result.source.index) {
							if (isSourceGroup && !isDestinationGroup) stateApp.layers[index] = { ...stateApp.layers[index], groupId: null, groupName: null }
							if (!isSourceGroup && isDestinationGroup) {
								const groupLayer = stateApp.layers.find((l) => l.groupId === result.destination.droppableId)
								stateApp.layers[index] = { ...stateApp.layers[index], groupId: groupLayer.groupId, groupName: groupLayer.groupName }
							}
							return true
						}
						return false
					})

					const { reorderedLayers, layersToUpdate } = reorderLayers(
						stateApp.layers,
						result.source.index,
						result.destination.index
					);

					setStateApp({ ...stateApp, layers: [...reorderedLayers] });

					updateManyUserLayerSettings({
						variables: {
							manySettings: layersToUpdate,
						},
					});
				} else if (result.destination.droppableId !== result.source.droppableId) {
					const layerIndex = stateApp.layers.findIndex((layer) => layer.position === result.source.index);
					if (result.destination.droppableId !== 'droppableM1') {
						const groupLayer = stateApp.layers.find((l) => l.groupId === result.destination.droppableId)

						stateApp.layers[layerIndex] = { ...stateApp.layers[layerIndex], groupId: groupLayer.groupId, groupName: groupLayer.groupName }
					} else {
						stateApp.layers[layerIndex] = { ...stateApp.layers[layerIndex], groupId: null, groupName: null }
					}
					setStateApp({ ...stateApp, layers: [...stateApp.layers] });
					updateLayerSettings({
						variables: {
							settings: {
								_id: stateApp.layers[layerIndex]._id,
								layerSettings: stateApp.layers[layerIndex].layerSettings,
							},
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

				// saving to mongo
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

	//   for HeatMap Panel
	useEffect(() => {
		if (panelType === "heatMaps") {
			setDragFunction(() => (result) => {
				// dropped outside the list
				if (!result.destination) {
					return;
				}

				const items = reorder(
					stateApp.heatLayers,
					result.source.index,
					result.destination.index
				);

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

	console.log("stateApp", stateApp);

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

	return panelItems ? (
		<Panel
			type={panelType}
			headerButton={panelButton}
			headerFilters={headerFilters}
			title={panelTitle}
			items={panelItems}
			onDragEnd={dragFunction}
			handleToggle={toggleFunction}
		/>
	) : null;
}
