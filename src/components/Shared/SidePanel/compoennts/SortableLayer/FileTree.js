/* eslint-disable react/prop-types */
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { Flipper } from 'react-flip-toolkit';
import Sortly, { findDescendants, findParent } from 'react-sortly';

import { Box, Paper } from '@material-ui/core';

import { useMutation } from '@apollo/client';
import update from 'immutability-helper';

import { globalStateController } from 'controllers/globalStateController';
import { layerController } from 'controllers/layerStateController';

import { UPDATELAYERSETTINGS } from 'graphQL/useMutationUpdateLayerSettings';
import { UPDATEUSERLAYERMETA } from 'graphQL/useMutationupdateLayersMeta';
import { UPDATEMANYLAYERSETTINGS } from 'graphQL/useMutationUpdateManyLayerSettings';
import { UPDATE_USER_MAP_SETTINGS } from 'graphQL/useMutationUserMapSettings';

import { useStyles } from '../style';
import LayerItem from './LayerItem';

const lockedGroups = ['Agreements'];
const FileTree = ({ layerMap, panelItems }) => {
	const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);
	const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);
	const [updateUserLayersMeta] = useMutation(UPDATEUSERLAYERMETA);

	const { globalState } = globalStateController.useState(['user'], 'globalState');
	const [updateUserMapSettings] = useMutation(UPDATE_USER_MAP_SETTINGS, {
		refetchQueries: ['getLayerGroups'],
		awaitRefetchQueries: true,
	});

	const [items, setItems] = React.useState(layerMap);
	const itemsRef = React.useRef([]);
	const currentItem = React.useRef();
	const classes = useStyles();

	const updateStateLayers = currentLayers => {
		layerController.updateState({ layers: currentLayers, previousLayers: currentLayers });
	};
	const checkforUpdate = (updateFn, previous, current, key) => {
		if (previous[key] !== current[key]) {
			updateFn = {
				...updateFn,
				[key]: { $set: current[key] },
			};
		}
	};

	const updateItems = (previousLayers, currentLayers) => {
		if (previousLayers.length === currentLayers.length) {
			const updateFn = {};
			previousLayers.forEach((item, index) => {
				const current = currentLayers[index];
				if (current.id !== item.id) {
					updateFn[index] = { $set: current };
				} else {
					if (current.type === 'group') {
						updateFn[index] = {
							showable: { $set: current.showable },
							visiable: { $set: current.visiable },
							name: { $set: current.name },
						};
					}
					checkforUpdate(updateFn[index], item, current, 'name');
					checkforUpdate(updateFn[index], item, current, 'groupName');
					checkforUpdate(updateFn[index], item, current, 'layerName');
					checkforUpdate(updateFn[index], item, current, 'fileName');
					checkforUpdate(updateFn[index], item, current, 'fileUrl');
					if (item.layerSettings) {
						updateFn[index] = {
							...updateFn[index],
							layerSettings: { $set: current.layerSettings },
							showable: { $set: current.layerSettings.showable },
							visiable: { $set: current.layerSettings.visiable },
							layerPaintProps: { $set: current.layerPaintProps },
							groupName: { $set: current.groupName },
							layerName: { $set: current.layerName },
							name: { $set: current.name },
							position: { $set: current.position },
							_id: { $set: current._id },
						};
					}
				}
			});
			setItems(update(previousLayers, updateFn));
		} else {
			setItems(currentLayers);
		}
	};

	useEffect(() => {
		updateItems(items, layerMap);
	}, [layerMap]);

	const handleChange = useCallback(newItems => {
		const index = newItems.findIndex(item => item.layerId === currentItem.current.layerId);
		if (newItems[index].depth === 1) {
			const parent = findParent(newItems, index);
			if (parent.type !== 'group' || parent.collapsed) {
				newItems[index].depth = 0;
			}
		}
		setItems(newItems);
	}, []);

	const handleToggleCollapse = useCallback(
		id => {
			const index = items.findIndex(item => item.id === id);
			const item = items[index];
			const { collapsed } = item;
			const descendants = findDescendants(items, index);
			const updateFn = {
				[index]: { collapsed: { $set: !collapsed } },
			};

			descendants.forEach(descendant => {
				const descendantIndex = items.indexOf(descendant);
				updateFn[descendantIndex] = { collapsed: { $set: !collapsed } };
			});

			setItems(update(items, updateFn));
		},
		[items, setItems]
	);

	const handleToggleGroup = useCallback(
		id => {
			const index = items.findIndex(item => item.id === id);
			const item = items[index];
			const { visiable } = item;
			const descendants = findDescendants(items, index).filter(l => l.layerSettings);
			const updateFn = {
				[index]: { visiable: { $set: !visiable } },
			};
			const layersToUpdate = [];
			const currentLayers = [...items];

			descendants.forEach(descendant => {
				const descendantIndex = items.indexOf(descendant);
				updateFn[descendantIndex] = { layerSettings: { visiable: { $set: !visiable } } };
				const layer = {
					...descendant,
					layerSettings: {
						...descendant.layerSettings,
						visiable: !visiable,
					},
				};
				currentLayers[descendantIndex] = layer;
				layersToUpdate.push(layer);
			});

			setItems(update(items, updateFn));

			updateStateLayers(currentLayers.filter(l => l.type !== 'group' && !l.emptyLayer));

			layersToUpdate.forEach(layer => {
				layerController.handleDeckLayer(layer);
			});

			updateManyUserLayerSettings({
				variables: {
					manySettings: layersToUpdate.map(layer => ({ _id: layer._id, layerSettings: layer.layerSettings })),
				},
			});
		},
		[items]
	);

	const handleDragBegin = useCallback(
		item => {
			itemsRef.current = items;
			currentItem.current = item;
		},
		[items]
	);

	const revert = () => {
		setItems(itemsRef.current);
	};

	async function updateLayersAndState({ layerIds, direction, targetId, groupName, groupId }) {
		// Update layers meta
		await updateUserLayersMeta({
			variables: {
				userId: globalState.user.mongoId,
				layersMeta: {
					layerId: layerIds,
					direction,
					targetId,
					groupName,
					groupId,
				},
			},
		});

		// Fetch and update projected layers
		layerController.getProjectedLayers();
	}

	const handleDragEnd = useCallback(
		async (oldItem, newItem) => {
			if (oldItem.depth === 0 && newItem.depth === 1 && newItem.type === 'group') {
				return revert();
			}

			let layersWithoutGroup = items.filter(l => l.type !== 'group' && !l.emptyLayer);
			let visibleLayers = layersWithoutGroup.filter(l => l?.layerSettings?.showable && l?.layerSettings?.visiable);
			const visibleIndex = visibleLayers.findIndex(item => item.id === newItem.id);
			layerController.changeLayerPosition(
				visibleLayers[visibleIndex],
				visibleLayers[visibleIndex - 1],
				visibleLayers[visibleIndex + 1]
			);

			const itemIndex = items.findIndex(item => item.id === newItem.id);
			const descendants = findDescendants(items, itemIndex).filter(item => !item.emptyLayer);

			if (newItem.depth === 1) {
				// if layer into group
				const parent = findParent(items, itemIndex);
				if (
					parent.type === 'group' &&
					((lockedGroups.includes(oldItem.groupName) && lockedGroups.includes(parent.name)) ||
						(!lockedGroups.includes(oldItem.groupName) && !lockedGroups.includes(parent.name)))
				) {
					items[itemIndex].groupName = parent.name;
					items[itemIndex].groupId = parent.id;
				} else {
					return revert();
				}
			} else if (oldItem.depth === 1 && newItem.depth === 0) {
				if (lockedGroups.includes(oldItem.groupName)) {
					return revert();
				} else {
					items[itemIndex].groupName = null;
					items[itemIndex].groupId = null;
				}
			}
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
				updateStateLayers([...layersWithoutGroup]);
			}

			if (newItem.type === 'group') {
				// Find all descendants of the group
				const itemIndex = items.findIndex(item => item.id === newItem.id);
				const descendants = findDescendants(items, itemIndex).filter(item => !item.emptyLayer);

				if (descendants.length === 0) {
					return revert(); // Groups without descendants cannot be moved
				}

				const firstDescendant = descendants[0];
				const lastDescendant = descendants[descendants.length - 1];

				// Find the layer above the first descendant and below the last descendant
				const firstDescendantIndex = layersWithoutGroup.findIndex(layer => layer.id === firstDescendant.id);
				const lastDescendantIndex = layersWithoutGroup.findIndex(layer => layer.id === lastDescendant.id);

				const layerAbove = firstDescendantIndex > 0 ? layersWithoutGroup[firstDescendantIndex - 1] : null;
				const layerBelow =
					lastDescendantIndex < layersWithoutGroup.length - 1 ? layersWithoutGroup[lastDescendantIndex + 1] : null;

				let direction = null;
				let targetId = null;

				// Determine movement direction and target layer
				if (layerBelow && lastDescendant.position > layerBelow.position) {
					direction = 'above';
					targetId = layerBelow.id;
				} else if (layerAbove && firstDescendant.position < layerAbove.position) {
					direction = 'below';
					targetId = layerAbove.id;
				} else {
					return revert(); // No valid move
				}

				// Pass all descendant IDs for meta update
				const descendantIds = descendants.map(descendant => descendant.id);

				updateLayersAndState({
					layerIds: descendantIds, // Or [newItem.id] for non-groups
					direction,
					targetId,
					groupName: newItem.groupName,
					groupId: newItem.groupId,
				});

				return null;
			}
			if (newItem.type !== 'group') {
				const newIndex = layersWithoutGroup.findIndex(layer => layer.id === newItem.id);
				if (newIndex === -1) {
					return revert();
				}
				// Determine movement direction and target layer
				let direction = null;
				let targetId = null;
				if (newIndex > 0) {
					const layerAbove = layersWithoutGroup[newIndex - 1];
					if (newItem.position < layerAbove.position) {
						// Moved down
						direction = 'below';
						targetId = layerAbove.id;
					}
				}
				if (newIndex < layersWithoutGroup.length - 1) {
					const layerBelow = layersWithoutGroup[newIndex + 1];
					if (newItem.position > layerBelow.position) {
						// Moved up
						direction = 'above';
						targetId = layerBelow.id;
					}
				}

				updateLayersAndState({
					layerIds: [newItem.id],
					direction,
					targetId,
					groupName: newItem.groupName,
					groupId: newItem.groupId,
				});
				return null;
			}

			return null;
		},
		[items]
	);

	const updateLayer = useCallback(
		layer => {
			const currentLayers = [...items];
			// saving to stateApp
			const index = panelItems.findIndex(item => item.layerId === layer.layerId);
			currentLayers[index] = layer;
			updateItems(items, currentLayers);

			updateStateLayers(currentLayers.filter(l => l.type !== 'group' && !l.emptyLayer));
			layerController.handleDeckLayer(layer);

			// // saving to mongo
			updateLayerSettings({
				variables: {
					settings: {
						_id: layer._id,
						user: globalState.user.mongoId,
						layer: layer.layerId,
						layerSettings: layer.layerSettings,
						layerPaintProps: layer.layerPaintProps,
					},
				},
			});
		},
		[items, panelItems]
	);

	const filpKeys = useMemo(() => items.map(({ id }) => id).join('.'), [items]);
	return (
		<Box
		// width={{ md: 1000 }}
		>
			<Paper>
				<Box className={classes.fileTree} data-testid="layers">
					<Flipper flipKey={filpKeys}>
						<Sortly items={items} maxDepth={1} onChange={handleChange}>
							{props => (
								<LayerItem
									{...props}
									onToggleCollapse={handleToggleCollapse}
									onToggleGroup={handleToggleGroup}
									onDragEnd={handleDragEnd}
									onDragBegin={handleDragBegin}
									updateLayer={updateLayer}
								/>
							)}
						</Sortly>
					</Flipper>
				</Box>
			</Paper>
		</Box>
	);
};

export default memo(FileTree);
