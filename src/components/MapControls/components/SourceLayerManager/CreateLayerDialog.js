import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { useMutation } from '@apollo/client';

import { layerController } from 'controllers/layerStateController';
import { mapControlsController } from 'controllers/mapControlsController';

import { CREATE_DATASET_LAYERS } from 'graphQL/useMutationDataset';

import { showErrorMessage } from 'actions';

import { getDefaultSettings } from './fileUploadHelper';

const CreateLayerDialog = () => {
	const dispatch = useDispatch();

	const [error, setError] = useState(false);
	const [isOpen, setIsOpen] = useState(true);
	const [groupName, setGroupName] = useState('');
	const [dataset, setDataset] = useState(null);
	const [layerNames, setLayerNames] = useState([]);

	const [createDatasetLayers] = useMutation(CREATE_DATASET_LAYERS);

	const {
		mapControlsStateValues: { selectedDataset },
	} = mapControlsController.useState(['selectedDataset'], 'mapControlsStateValues');

	useEffect(() => {
		if (selectedDataset) {
			setDataset(selectedDataset);
			setGroupName(selectedDataset.name);
		}
	}, [selectedDataset]);

	const handleCreateLayers = async () => {
		if (!groupName || !layerNames.length) {
			setError(true);
			return;
		}

		createDatasetLayers({
			variables: {
				dataset,
				groupName,
				layerNames,
				isCreateLayers: true,
				defaultSettings: dataset.categories.map(({ layerGeometry, name, bbox }) =>
					getDefaultSettings(layerGeometry, name, bbox)
				),
				shouldUpdateDataset: false,
			},
			refetchQueries: ['getLayerGroups', 'getAllLayerSettingsByUser'],
			awaitRefetchQueries: true,
		});

		mapControlsController.updateState({
			layerAddControl: null,
		});

		layerController.updateState({ layerSettingsLoading: true });
	};

	const handleCancel = () => {
		setIsOpen(false);
		mapControlsController.updateState({
			layerAddControl: null,
			fileUploaded: null,
		});
	};

	useEffect(() => {
		if (!dataset?.categories) {
			return;
		}

		setLayerNames(dataset.categories.map(c => c.name));
	}, [dataset]);

	const handleLayerNameChanges = (value, index) => {
		if (value && layerNames.includes(value)) {
			dispatch(showErrorMessage('Layer with this name already exist'));
		} else {
			layerNames[index] = value;
			setLayerNames([...layerNames]);
		}
	};

	return (
		<Dialog maxWidth="xs" fullWidth open={isOpen} onClose={handleCancel}>
			{dataset?.categories?.length ? (
				<>
					<DialogTitle>{`Create Layer${dataset?.categories?.length > 1 ? 's' : ''}`}</DialogTitle>
					<DialogContent dividers>
						<Box fontWeight="bold">Source File Name</Box>
						<Typography variant="subtitle1" gutterBottom>
							{dataset?.fileName || ''}
						</Typography>

						{dataset?.categories?.length > 1 && (
							<TextField
								defaultValue={groupName}
								focused
								required
								margin="dense"
								id="groupName"
								label="Layer Name"
								fullWidth
								error={error}
								onChange={e => {
									setError(false);
									setGroupName(e.target.value);
								}}
							/>
						)}

						<>
							{dataset?.categories?.map(({ name }, i) => (
								<TextField
									key={name}
									focused
									required
									margin="dense"
									id="layerName"
									value={layerNames[i]}
									label={`Category ${i + 1} ( ${name} )`}
									fullWidth
									error={error}
									onChange={e => handleLayerNameChanges(e.target.value, i)}
								/>
							))}
						</>
					</DialogContent>
				</>
			) : (
				<>
					<DialogTitle>{'No Category Found'}</DialogTitle>
				</>
			)}

			<DialogActions>
				<Button autoFocus onClick={handleCancel} color="primary">
					Cancel
				</Button>
				{dataset?.categories?.length > 0 && (
					<Button id="createSourceButton" autoFocus onClick={handleCreateLayers} color="primary">
						{`Add Layer${dataset?.categories?.length > 1 ? 's' : ''}`}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default CreateLayerDialog;
