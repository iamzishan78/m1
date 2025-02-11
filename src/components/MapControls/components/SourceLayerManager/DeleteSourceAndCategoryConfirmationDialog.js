/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { DialogContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { useMutation } from '@apollo/client';

import { UPDATE_DATASET } from 'graphQL/useMutationDataset';
import { REMOVE_LAYER_GROUP } from 'graphQL/useMutationLayerGroup';
import { UPDATE_MANY_LAYER } from 'graphQL/useMutationUpdateManyLayer';

import { layerController } from 'hookstate/layerStateController';

import { Modals } from 'styles/Modal';

import { setMainMapState, showErrorMessage, showSuccessMessage } from 'actions';
import { AppContext } from 'AppContext';

export default function DeleteSourceAndCategoryConfirmationDialog(props) {
	const dispatch = useDispatch();
	const [stateApp, setStateApp] = useContext(AppContext);
	const [updateDataset] = useMutation(UPDATE_DATASET, { refetchQueries: ['getDatasets'], awaitRefetchQueries: true });

	const [updateManyLayer, { data: layersDeleted }] = useMutation(UPDATE_MANY_LAYER);

	const [removeLayerGroup] = useMutation(REMOVE_LAYER_GROUP, {
		refetchQueries: ['getLayerGroups', 'getAllLayerSettingsByUser'],
		awaitRefetchQueries: true,
	});

	const isSource = !props.actionItem?.category;
	const title = isSource ? 'Datasource' : 'Category';
	const layers = layerController
		.getValue('projectedLayers')
		.filter(layer =>
			isSource
				? layer.file === props.actionItem.dataset?.file
				: layer.file === props.actionItem.dataset?.file &&
					layer.layerShapeName === props.actionItem.category.layerShapeName
		);

	useEffect(() => {
		if (layersDeleted && layersDeleted.updateManyLayer) {
			if (layersDeleted.updateManyLayer.success) {
				dispatch(showSuccessMessage('The Group was successfully removed'));
				dispatch(setMainMapState({ removeLayerFromMap: layers }));
				setStateApp(state => ({
					...state,
					universalCircularLoaderAct: false,
				}));
				props.handleDialogClose(false);
				layersDeleted.updateManyLayer.res?.forEach?.(l => {
					const layer = layerController.getLayerFromMongoId(l._id);
					layerController.removeLayer(layer);
				});
			} else {
				setStateApp(state => ({
					...state,
					universalCircularLoaderAct: false,
				}));
				dispatch(showErrorMessage('Error occurred'));
			}
		}
	}, [layersDeleted]);

	const handleAccept = () => {
		setStateApp(state => ({ ...state, universalCircularLoaderAct: true }));

		if (isSource) {
			props.actionItem.dataset.IsDeleted = true;
		} else {
			const category = props.actionItem.dataset.categories.find(
				category => category.name === props.actionItem.category.name
			);
			category.IsDeleted = true;
		}
		updateDataset({ variables: { dataset: props.actionItem.dataset } });
		if (layers.length > 0) {
			if (layers[0].groupId && (isSource || props?.actionItem?.dataset?.categories?.length < 2)) {
				removeLayerGroup({
					variables: {
						userId: stateApp.user.mongoId,
						layerGroupId: layers[0].groupId,
					},
				});
			}
			updateManyLayer({
				variables: {
					layers: layers.map(layer => ({ _id: layer.layerId, IsDeleted: true })),
				},
			});

			layerController.updateState({
				projectedLayers: layerController
					.getValue('projectedLayers')
					.filter(layer => !layers.some(l => l.layerId === layer.layerId)),
				layers: layerController.getValue('layers').filter(layer => !layers.some(l => l.layerId === layer.layerId)),
			});
		} else {
			setStateApp(state => ({
				...state,
				universalCircularLoaderAct: false,
			}));
			props.handleDialogClose(false);
		}
	};

	const modalClass = Modals();

	return (
		<Dialog
			style={{ zIndex: 9999999999 }}
			open={props.openDialog}
			onClose={() => {
				props.handleDialogClose(false);
			}}
		>
			<DialogTitle className={modalClass.title} id="customized-dialog-title">
				Delete {title}(s)
				<HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={props.onClose} />
			</DialogTitle>
			<DialogContent>
				<h3 className={modalClass.inputLabel}>
					Do you want to permanently delete the selected {title}? This action will also delete all layers tied to
					selected {title}?
				</h3>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						props.handleDialogClose(false);
					}}
					color="primary"
				>
					Cancel
				</Button>
				<Button
					id="deleteConfirmation"
					onClick={() => {
						handleAccept();
					}}
					color="secondary"
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}
