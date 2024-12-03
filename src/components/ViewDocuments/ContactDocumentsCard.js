import React, { useState, useContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useLazyQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Button from '@material-ui/core/Button';

import { AppContext } from 'AppContext';
import ViewDocuments from './ViewDocuments';
import { CONTACT } from 'graphQL/useQueryContact';
import { DELETEDESCRIPTORFILE } from 'graphQL/useMutationDeleteDescriptorFile';
import { Modals } from 'styles/Modal';

export default function ContactDocumentsCard(props) {
	let history = useHistory();
	const modalClass = Modals();
	const [stateApp] = useContext(AppContext);
	const [contactData, setContactData] = useState(null);
	const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
	const [fileIdToDelete, setFileIdToDelete] = useState(null);

	const contactId =
		props?.contactId || history.location.pathname.split('/')[history.location.pathname.split('/').length - 2];

	const [getContact, { data }] = useLazyQuery(CONTACT);
	const [deleteFile] = useMutation(DELETEDESCRIPTORFILE);
	useEffect(() => {
		if (contactId) {
			getContact({
				variables: {
					contactId: contactId,
				},
			});
		}
	}, [contactId, getContact]);

	useEffect(() => {
		if (data && data.contact) {
			setContactData(data.contact);
		}
	}, [data]);

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

	return contactData ? (
		<div variant="outlined" style={{ height: '100%', marginTop: '30px' }}>
			{' '}
			{/* Height as 100% and marginTop as 30px*/}
			<ViewDocuments
				contactId={contactId}
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
