import React, { useState, useEffect, useContext } from 'react';

import AddLayerIcon from '@material-ui/icons/Queue';

import { useMutation } from '@apollo/client';

import { UPDATELAYERSETTINGS } from 'graphQL/useMutationUpdateLayerSettings';

import { globalStateController } from 'hookstate/globalStateController';
import { layerController } from 'hookstate/layerStateController';
import { mapControlsController } from 'hookstate/mapControlsController';

import { copy } from 'utils/helper';

import { AppContext } from 'AppContext';

import Panel from './compoennts/Panel';

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

export default function SidePanel() {
	const [dragFunction, setDragFunction] = useState();
	const [toggleFunction, setToggleFunction] = useState();
	const [panelItems, setPanelItems] = useState();
	const [panelButton, setPanelButton] = useState();
	const [panelTitle, setPanelTitle] = useState();
	const [headerFilters, setHeaderFilters] = useState();

	const { mapControlsStateValues } = mapControlsController.useState(['selectedControl'], 'mapControlsStateValues');
	const panelType = mapControlsStateValues.selectedControl;

	const [stateApp, setStateApp] = useContext(AppContext);
	const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

	const openManager = type => {
		mapControlsController.updateState({
			manageTransferData: false,
			[`${type === 'manageLayer' ? 'manageLayer' : 'manageSourceLayer'}`]: true,
			[`${type === 'manageLayer' ? 'manageSourceLayer' : 'manageLayer'}`]: null,
			selectedLayerControl: null,
			selectedLayer: null,
			layerGridCard: false,
		});
		mapControlsController.updateState({
			mapGridCardActivated: false,
		});
	};

	const panelButtons = {
		layer: {
			text: 'New Layer',
			fn: (type = 'manageLayer') => openManager(type),
			icon: <AddLayerIcon />,
		},
	};

	//   for BaseMap Panel
	useEffect(() => {
		if (panelType === 'base') {
			setPanelItems(stateApp.baseMapLayers);
			setPanelTitle('Base Map');
			setPanelButton(null);
			setHeaderFilters(null);

			setDragFunction(() => result => {
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
					const currentLayers = globalStateController.getValue('layers');
					const layer = copy(currentLayers.find(layer => layer.identifier === 'Land Grid'));
					if (layer) {
						const visible = layer.layerSettings.visiable || layer.layerSettings.showable;
						const mappedLayers = currentLayers.map(layer => {
							return layer.identifier === 'Land Grid'
								? {
										...layer,
										layerSettings: {
											...layer.layerSettings,
											visiable: !visible,
											showable: !visible,
										},
									}
								: layer;
						});

						globalStateController.updateState({ layers: mappedLayers });
						stateApp.layers = [...mappedLayers];

						// Update checked base layers for indices 0(Map Labels) and 2(Roads)
						let newChecked = [...stateApp.checkedBaseLayers];
						[0, 2].map(baseIndex => {
							const baseLayer = stateApp.baseMapLayers[baseIndex];

							// Check if the base layer exists
							if (baseLayer) {
								const currentIndex = newChecked.indexOf(baseIndex);

								// If Land Grid is being turned on and the base layer is not in newChecked, add it
								if (!visible && currentIndex === -1) {
									newChecked.push(baseIndex);
								}
								// If Land Grid is being turned off and the base layer is in newChecked, remove it
								else if (visible && currentIndex !== -1) {
									newChecked.splice(currentIndex, 1);
								}
							}
						});

						setStateApp(stateApp => ({
							...stateApp,
							checkedBaseLayers: newChecked, // set new checked base layers
						}));
						layerController.handleDeckLayer({
							...layer,
							layerSettings: {
								...layer.layerSettings,
								visiable: !visible,
								showable: !visible,
							},
							identifier: 'AbstractGeo',
						});
						layerController.handleDeckLayer({
							...layer,
							layerSettings: {
								...layer.layerSettings,
								visiable: !visible,
								showable: !visible,
							},
							identifier: 'Pls',
						});

						// saving to mongo
						updateLayerSettings({
							variables: {
								settings: {
									_id: layer._id,
									layerSettings: {
										...layer.layerSettings,
										visiable: !visible,
										showable: !visible,
									},
								},
							},
						});
					}
				} else {
					const currentIndex = stateApp.checkedBaseLayers.indexOf(index);
					let newChecked = [...stateApp.checkedBaseLayers];
					if (currentIndex === -1) {
						newChecked.push(index);
					} else {
						newChecked.splice(currentIndex, 1);
					}
					setStateApp(stateApp => ({
						...stateApp,
						checkedBaseLayers: newChecked,
					}));
				}
			});
		}
	}, [panelType, stateApp.baseMapLayers, stateApp.checkedBaseLayers]);

	//   for Layer Panel
	useEffect(() => {
		if (panelType === 'layer' || panelType === null) {
			if (panelTitle !== 'Layers') {
				setPanelTitle('Layers');
			}
			if (panelButton !== panelButtons[panelType]) {
				setPanelButton(panelButtons[panelType]);
			}
			if (headerFilters !== null) {
				setHeaderFilters(null);
			}
		}
	}, [panelType]);

	//   for HeatMap Panel
	useEffect(() => {
		if (panelType === 'heatMaps') {
			setDragFunction(() => result => {
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
				setStateApp(stateApp => ({ ...stateApp, checkedHeats: newChecked }));
			});
			setPanelItems(stateApp.heatLayers);
			setPanelTitle('Heatmaps');
			setPanelButton(null);
			setHeaderFilters(null);
		}
	}, [panelType, stateApp.heatLayers, stateApp.checkedHeats]);

	//   for Marketplace Panel
	useEffect(() => {
		if (panelType === 'marketplace') {
			setDragFunction(() => {});
			setToggleFunction(() => {});
			// setPanelItems(stateApp.layers);
			setPanelTitle('Marketplace');
			setPanelButton(null);
			setHeaderFilters(null);
		}
	}, [panelType]);

	useEffect(() => {
		if (panelType === 'filter') {
			setPanelTitle('Filters');
			setPanelButton(null);
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
		/>
	) : null;
}
