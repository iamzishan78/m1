import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core';
import { mapControlsController } from 'hookstate/mapControlsController';
import { globalStateController } from 'hookstate/globalStateController';
import { getFileExtension, uploadFileData } from 'components/Shared/functions';
import { ADDFILE } from 'graphQL/useMutationAddFile';
import { useApolloClient } from '@apollo/client';
import { SimpleOrShapeFileImport } from '../addUserHelper';

const FileUploadDialog = () => {
	const client = useApolloClient();

	const {
		mapControlsStateValues: { fileUploaded },
	} = mapControlsController.useState(['fileUploaded'], 'mapControlsStateValues');

	const [error, setError] = useState(false);
	const [isOpen, setIsOpen] = useState(true);
	const [groupName, setGroupName] = useState(fileUploaded.fileNameParsed);

	const handleApplyChanges = async () => {
		if (!groupName || !fileUploaded) {
			return setError(true);
		}

		globalStateController.updateState({ universalLoader: true });

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

		globalStateController.updateState({ universalLoader: false });
	};

	const handleCancel = () => {
		setIsOpen(false);
		mapControlsController.updateState({
			layerAddControl: null,
			fileUploaded: null,
		});
	};

	return (
		<Dialog maxWidth="xs" fullWidth open={isOpen} onClose={handleCancel}>
			<DialogTitle>Create a new Source</DialogTitle>
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
			</DialogContent>

			<DialogActions>
				<Button autoFocus onClick={handleCancel} color="primary">
					Cancel
				</Button>
				<Button id="createSourceButton" disabled={!groupName} autoFocus onClick={handleApplyChanges} color="primary">
					Create Source
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default FileUploadDialog;
