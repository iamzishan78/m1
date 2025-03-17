import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Box, Checkbox, FormControlLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';

import { useApolloClient, useMutation } from '@apollo/client';

import { getFileExtension, uploadFileData } from 'components/Shared/functions';

import { ADDFILE } from 'graphQL/useMutationAddFile';
import { CREATE_DATASET_LAYERS } from 'graphQL/useMutationDataset';
import { GET_DATASET_UPLOAD_STATE } from 'graphQL/useQueryDataset';

import { globalStateController } from 'stateManagement/globalStateController';
import { mapControlsController } from 'stateManagement/mapControlsController';

import { showErrorMessage } from 'actions';

import { getDefaultSettings, SimpleOrShapeFileImport } from './fileUploadHelper';

const FileUploadDialog = () => {
	const client = useApolloClient();
	const dispatch = useDispatch();

	const {
		mapControlsStateValues: { fileUploaded },
	} = mapControlsController.useState(['fileUploaded'], 'mapControlsStateValues');

	const [error, setError] = useState(false);
	const [isOpen, setIsOpen] = useState(true);
	const [groupName, setGroupName] = useState(fileUploaded.fileNameParsed);
	const [dataset, setDataset] = useState(null);
	const [isCreateLayers, setIsCreateLayers] = useState(true);
	const [layerNames, setLayerNames] = useState([]);

	const [createDatasetLayers] = useMutation(CREATE_DATASET_LAYERS);

	const handleCreateDataset = async () => {
		if (!groupName || !fileUploaded) {
			return setError(true);
		}

		globalStateController.updateState({
			universalLoader: {
				text: 'Uploading File',
				textStyles: {
					color: 'green',
				},
			},
		});

		const user = globalStateController.getValue('user');
		const fileName = groupName.trim().toLowerCase().replace(' ', '_') + `.${getFileExtension(fileUploaded.fileName)}`;

		const originalFile = await client.mutate({
			mutation: ADDFILE,
			variables: {
				fileName,
				custom_data: {
					originalFileName: fileUploaded.fileName,
					groupName,
				},
				userId: user.mongoId,
			},
		});

		const fileId = originalFile.data.addFile.file.id;

		if (fileId) {
			await uploadFileData(originalFile.data.addFile.file, fileUploaded);

			await SimpleOrShapeFileImport({ user, client, fileId });
		}
		const interval = setInterval(async () => {
			try {
				const datasetRes = await client.query({
					query: GET_DATASET_UPLOAD_STATE,
					variables: {
						fileId,
					},
				});

				const data = datasetRes?.data?.getDatasetUploadState?.data;

				if (data) {
					globalStateController.updateState({
						universalLoader: {
							text: data.message,
							textStyles: {
								color: 'green',
							},
						},
					});

					if (data.dataset) {
						clearInterval(interval);

						setDataset(data?.dataset);

						globalStateController.updateState({ universalLoader: false });
					}

					if (data.uploadJob?.status === 'Failed') {
						globalStateController.updateState({ universalLoader: false });

						dispatch(showErrorMessage('Dataset upload failed'));

						handleCancel();
					}
				}
			} catch {
				clearInterval(interval);

				globalStateController.updateState({ universalLoader: false });
			}
		}, 5000);
	};

	const handleCreateLayers = async () => {
		if (!groupName || !layerNames.length) {
			return setError(true);
		}

		createDatasetLayers({
			variables: {
				dataset,
				groupName,
				layerNames,
				isCreateLayers,
				defaultSettings: dataset.categories.map(({ layerGeometry, name, bbox }) =>
					getDefaultSettings(layerGeometry, name, bbox)
				),
			},
			refetchQueries: ['getDatasets', ...(isCreateLayers ? ['getLayerGroups', 'getAllLayerSettingsByUser'] : [])],
			awaitRefetchQueries: true,
		});

		mapControlsController.updateState({
			layerAddControl: null,
			fileUploaded: null,
		});
	};

	const handleApplyChanges = () => {
		if (!dataset) {
			return handleCreateDataset();
		}

		handleCreateLayers();
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
			<DialogTitle>{dataset ? 'Create new Source Layers' : 'Create a new Source'}</DialogTitle>
			<DialogContent dividers>
				<Box fontWeight="bold">Source File Name</Box>
				<Typography variant="subtitle1" gutterBottom>
					{fileUploaded.fileName}
				</Typography>

				<TextField
					defaultValue={groupName}
					focused
					required
					margin="dense"
					id="groupName"
					label="Source Name"
					fullWidth
					error={error}
					onChange={e => {
						setError(false);
						setGroupName(e.target.value);
					}}
				/>

				{dataset && (
					<>
						{dataset.categories.map(({ name }, i) => (
							<TextField
								focused
								required
								margin="dense"
								id="layerName"
								value={layerNames[i]}
								label={`Source Category ${i + 1} ( ${name} )`}
								fullWidth
								error={error}
								onChange={e => handleLayerNameChanges(e.target.value, i)}
							/>
						))}

						<FormControlLabel
							control={
								<Checkbox
									icon={<CheckBoxOutlineBlank fontSize="small" />}
									checkedIcon={<CheckBox fontSize="small" />}
									checked={isCreateLayers}
									onChange={event => setIsCreateLayers(event.target.checked)}
									color="default"
								/>
							}
							label="Auto-Add Source Data to Map Layers"
						/>
					</>
				)}
			</DialogContent>

			<DialogActions>
				<Button autoFocus onClick={handleCancel} color="primary">
					Cancel
				</Button>
				<Button id="createSourceButton" disabled={!groupName} autoFocus onClick={handleApplyChanges} color="primary">
					{dataset ? 'Update' : 'Create'} Source
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default FileUploadDialog;
