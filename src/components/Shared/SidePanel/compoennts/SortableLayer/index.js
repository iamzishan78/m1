import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { ContextProvider } from 'react-sortly';

import { Box, CircularProgress } from '@material-ui/core';

import { useLazyQuery } from '@apollo/client';

import { GET_LAYER_GROUPS } from 'graphQL/useQueryLayerGroup';

import { globalStateController } from 'stateManagement/globalStateController';

import FileTree from './FileTree';

const getEmptyGroupAndLayer = (group, type) => {
	if (type === 'layer') {
		return {
			emptyLayer: true,
			collapsed: true,
			groupName: group.name,
			groupId: group.groupId,
			visiable: true,
			showable: true,
			name: '',
			depth: 1,
			type: 'layer',
			id: group.groupId + 'layer',
		};
	}

	if (type === 'group') {
		return {
			depth: 0,
			type: 'group',
			collapsed: true,
			showable: true,
			visiable: true,
			name: group.name,
			id: group.groupId,
		};
	}
};

const dnd = isMobile ? TouchBackend : HTML5Backend;
const SortableLayer = ({ mongoId, search }) => {
	const [layerMap, setLayerMap] = useState([]);
	const { layers, panelItems, stateValues } = globalStateController.useState([
		'layers',
		'previousLayers',
		'panelItems',
	]);
	const [getLayerGroups, { data: layerGroupData }] = useLazyQuery(GET_LAYER_GROUPS);

	useEffect(() => {
		getLayerGroups({ variables: { userId: mongoId } });
	}, [getLayerGroups]);

	useEffect(() => {
		if (layerGroupData?.getLayerGroups) {
			const hookStateAppLayers = stateValues.layers;
			const layerGroups = layerGroupData?.getLayerGroups;
			const groupHandled = [];
			const layerAndGroups = [];
			hookStateAppLayers &&
				hookStateAppLayers.forEach(item => {
					if (item.layerSettings) {
						if (item.groupId && !groupHandled.includes(item.groupId)) {
							groupHandled.push(item.groupId);
							const groups = hookStateAppLayers.filter(i => i.groupId === item.groupId);
							const visiable = !!groups.find(i => i.layerSettings.visiable);
							const showable = !!groups.find(i => i.layerSettings.showable);
							layerAndGroups.push({
								depth: 0,
								type: 'group',
								collapsed: true,
								showable,
								visiable,
								name: item.groupName,
								id: item.groupId,
							});
							groups.forEach(item => {
								layerAndGroups.push({
									...item,
									collapsed: true,
									name: item.layerName,
									showable: item.layerSettings.showable,
									visiable: item.layerSettings.visiable,
									depth: 1,
									type: 'layer',
									id: item._id,
								});
							});
						}
						if (!item.groupId) {
							const showable = item.layerSettings.showable && !['Agreement', 'Land Grid'].includes(item.identifier);
							layerAndGroups.push({
								...item,
								visiable: item.layerSettings.visiable,
								showable,
								layerSettings: { ...item.layerSettings, showable },
								name: item.layerName,
								depth: 0,
								type: 'layer',
								id: item._id,
							});
						}
					}
				});

			if (layerAndGroups.length > 0) {
				const emptyGroups = layerGroups.filter(layerGroup => !groupHandled.includes(layerGroup.groupId));
				emptyGroups.forEach(emptyGroup => {
					if (!emptyGroup.above) {
						layerAndGroups.unshift(getEmptyGroupAndLayer(emptyGroup, 'layer'));
						layerAndGroups.unshift(getEmptyGroupAndLayer(emptyGroup, 'group'));
						return;
					}
					if (!emptyGroup.below) {
						layerAndGroups.push(getEmptyGroupAndLayer(emptyGroup, 'group'));
						layerAndGroups.push(getEmptyGroupAndLayer(emptyGroup, 'layer'));
						return;
					}

					const index = layerAndGroups.findIndex(layerAndGroup => layerAndGroup.id === emptyGroup.above);
					if (index && layerAndGroups[index]?.type === 'layer') {
						layerAndGroups.splice(index + 1, 0, getEmptyGroupAndLayer(emptyGroup, 'group'));
						layerAndGroups.splice(index + 2, 0, getEmptyGroupAndLayer(emptyGroup, 'layer'));
						return;
					}
					if (index && layerAndGroups[index]?.type === 'group') {
						layerAndGroups.splice(index + 2, 0, getEmptyGroupAndLayer(emptyGroup, 'group'));
						layerAndGroups.splice(index + 3, 0, getEmptyGroupAndLayer(emptyGroup, 'layer'));
						return;
					}
				});

				globalStateController.updateState({ emptyGroups: emptyGroups.map(g => g.groupId) });
			}

			globalStateController.updateState({ panelItems: layerAndGroups });
		}
	}, [layers, layerGroupData?.getLayerGroups]);

	useEffect(() => {
		if (search) {
			setLayerMap(
				stateValues.panelItems.filter(i => (i.layerName ?? i.name).toLowerCase().includes(search.toLowerCase()))
			);
		} else {
			setLayerMap(stateValues.panelItems);
		}
	}, [panelItems, search]);

	return (
		<>
			{layerMap && layerMap[0]?.type ? (
				<DndProvider backend={dnd}>
					<ContextProvider>
						{layerMap.length > 0 && <FileTree layerMap={layerMap} panelItems={stateValues.panelItems} />}
					</ContextProvider>
				</DndProvider>
			) : (
				<Box height="calc(100vh - 50px - 122px)" bgcolor="#0e111a" display="flex" justifyContent="center">
					<CircularProgress style={{ top: '50%', position: 'absolute' }} size={40} color="secondary" />
				</Box>
			)}
		</>
	);
};

export default React.memo(SortableLayer);
