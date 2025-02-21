/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useMutation } from '@apollo/client';

import { layerController } from 'controllers/layerStateController';

import { UPDATE_MANY_LAYER } from 'graphQL/useMutationUpdateManyLayer';

import { setMainMapState, showErrorMessage, showSuccessMessage } from 'actions';

import { UPDATELAYER } from '../../../graphQL/useMutationUpdateLayer';

export default function DeleteConfirmationDialog(props) {
	const dispatch = useDispatch();
	const [updateLayer, { data: layerDeleted }] = useMutation(UPDATELAYER);
	const [updateManyLayer, { data: layersDeleted }] = useMutation(UPDATE_MANY_LAYER);

	useEffect(() => {
		if (layerDeleted && layerDeleted.updateLayer) {
			if (layerDeleted.updateLayer.success) {
				dispatch(showSuccessMessage('The layer was successfully removed'));
				dispatch(setMainMapState({ removeLayerFromMap: [props.layer] }));
				window.setStateApp(state => ({
					...state,
					universalCircularLoaderAct: false,
				}));
				props.handleDialogClose(false);
				const layer = layerController.getLayerFromMongoId(layerDeleted.updateLayer.layer._id);
				layerController.removeLayer(layer);
			} else {
				window.setStateApp(state => ({
					...state,
					universalCircularLoaderAct: false,
				}));
				dispatch(showErrorMessage('Error occurred'));
			}
		}
	}, [layerDeleted]);

	useEffect(() => {
		if (layersDeleted && layersDeleted.updateManyLayer) {
			if (layersDeleted.updateManyLayer.success) {
				dispatch(showSuccessMessage('The Group was successfully removed'));
				dispatch(setMainMapState({ removeLayerFromMap: props.layer.layers }));
				window.setStateApp(state => ({
					...state,
					universalCircularLoaderAct: false,
				}));
				props.handleDialogClose(false);
				layersDeleted.updateManyLayer.res?.forEach?.(l => {
					const layer = layerController.getLayerFromMongoId(l._id);
					layerController.removeLayer(layer);
				});
			} else {
				window.setStateApp(state => ({
					...state,
					universalCircularLoaderAct: false,
				}));
				dispatch(showErrorMessage('Error occurred'));
			}
		}
	}, [layersDeleted]);

	const handleAccept = async () => {
		window.setStateApp(state => ({ ...state, universalCircularLoaderAct: true }));
		// Determine the appropriate mutation to call
		let layersToRemove = [];
		if (props.layer.type === 'group') {
			updateManyLayer({
				variables: {
					layers: props.layer.layers.map(layer => ({ _id: layer.layerId, IsDeleted: true })),
					layerGroupId: props.layer.id,
				},
			});
			layersToRemove = props.layer.layers.map(layer => layer.layerId);
		} else {
			await updateLayer({
				variables: {
					layer: {
						_id: props.layer.layerId,
						IsDeleted: true,
					},
				},
			});
			layersToRemove = [props.layer.layerId];
		}

		const { projectedLayers, layers } = layerController.getValues(['projectedLayers', 'layers']);
		layerController.updateState({
			projectedLayers: projectedLayers.filter(layer => !layersToRemove.includes(layer.layerId)),
			layers: layers.filter(layer => !layersToRemove.includes(layer.layerId)),
		});

		window.setStateApp(state => ({ ...state, universalCircularLoaderAct: false }));
	};

	return (
		<div>
			<Dialog
				fullWidth
				maxWidth="xs"
				open={props.openDialog}
				onClose={() => {
					props.handleDialogClose(false);
				}}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle style={{ textAlign: 'center', padding: '24px 24px 0 24px' }}>
					Do you want to delete the selected layer?
				</DialogTitle>

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
						onClick={() => {
							handleAccept();
						}}
						color="primary"
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
