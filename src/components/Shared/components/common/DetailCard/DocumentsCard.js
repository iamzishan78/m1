import React, { useState, useContext } from 'react';

import { AppContext } from 'AppContext';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Dialog, DialogTitle, CircularProgress, DialogActions, DialogContent, Button } from '@material-ui/core';

import { detailCardController } from 'hookstate/detailCardController';
import { globalStateController } from 'hookstate/globalStateController';

import { Modals } from 'styles/Modal';
import ViewDocuments from 'components/ViewDocuments/ViewDocuments';
import { DELETEDESCRIPTORFILE } from 'graphQL/useMutationDeleteDescriptorFile';

export default function DocumentsCard() {
	const { id } = useParams();
	const modalClass = Modals();
	const [stateApp] = useContext(AppContext);
	const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
	const [fileIdToDelete, setFileIdToDelete] = useState(null);

	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const {
		stateValues: { currentAssetRecord },
	} = detailCardController.useState(['currentAssetRecord']);

	const [deleteFile] = useMutation(DELETEDESCRIPTORFILE);

	const handleDeleteCancel = () => {
		setFileIdToDelete(null);
		setOpenDeleteConfirmDialog(false);
	};

	const handleDeleteAccept = () => {
		// Delete Document Logic goes here
		if (fileIdToDelete) {
			deleteFile({
				variables: {
					id: fileIdToDelete,
				},
				refetchQueries: ['getRecentContactFiles', 'getContactFiles'],
				awaitRefetchQueries: true,
			});
			setFileIdToDelete(null);
			setOpenDeleteConfirmDialog(false);
		}
	};

	return currentAssetRecord ? (
		<div variant="outlined" style={{ height: '100%', marginTop: '30px' }}>
			{/* Height as 100% and marginTop as 30px*/}
			<ViewDocuments
				contactId={id}
				relatedObjectType={currentAsset?.tableName}
				user_id={stateApp.user.email}
				openDeleteConfirmDialog={openDeleteConfirmDialog}
				handleClose={handleDeleteCancel}
				handleAccept={handleDeleteAccept}
				setOpenDeleteConfirmDialog={setOpenDeleteConfirmDialog}
				setFileIdToDelete={setFileIdToDelete}
			/>
			<Dialog
				// style={{zIndex: 99998}}
				open={openDeleteConfirmDialog}
				onClose={() => setOpenDeleteConfirmDialog(false)}
				fullWidth
				maxWidth="lg"
			>
				<DialogTitle className={modalClass.title} id="customized-dialog-title">
					Delete Document
					<HighlightOffIcon
						fontSize="large"
						className={modalClass.titleClose}
						onClick={() => setOpenDeleteConfirmDialog(false)}
					/>
				</DialogTitle>
				<DialogContent>
					<h3 className={modalClass.inputLabel}>Are you sure you want to delete this document?</h3>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setOpenDeleteConfirmDialog(false);
						}}
						color="primary"
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							handleDeleteAccept();
						}}
						color="secondary"
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	) : (
		<div
			style={{
				padding: '20px',
				position: 'absolute',
				height: '95%',
				width: '100%',
				zIndex: '50',
			}}
		>
			<CircularProgress size={80} disableShrink color="secondary" />
		</div>
	);
}
