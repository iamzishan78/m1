import React, { useState, memo } from 'react';

import { Dialog as MuiDialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import DeleteConfirmationDialog from 'components/MRTTable/Common/Dialog/ConfirmationDialog/DeleteConfirmationDialog';

import { slidoutState } from 'stateManagement/initialStates';
import { slidoutStateController } from 'stateManagement/slidoutStateController';

import Dialog from './Dialog';
import DialogHeader from './DialogHeader';

import 'components/Transact/components/DealDialog/dialog.css';

const useStyles = makeStyles(() => ({
	dealDetailRoot: {
		'& .MuiDialog-paper': {
			overflowY: 'hidden',
		},
	},
	dialog: {
		zIndex: '9999999999 !important',
	},
}));

function Slideout({ isTransactPage, show }) {
	const classes = useStyles();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const { parentType, view } = slidoutStateController.useState(['parentType', 'view']);

	const handleCloseDialog = () => {
		setDeleteDialogOpen(false);
	};

	const handleClose = async () => {
		if (view?.name !== 'Home') {
			if (window.location.pathname.startsWith('/calendar/activities')) {
				window.history.pushState('', '', '/calendar/activities');
			}
			slidoutStateController.updateState({
				selectedActivity: null,
				selectedActivityId: '',
			});
			slidoutStateController.hideSlideout();
		} else {
			slidoutStateController.updateState({ formMode: 'update' });
		}
	};

	const openConfirmationDialog = () => {
		setDeleteDialogOpen(true);
	};

	if (!show) {
		return null;
	}

	return (
		<>
			{deleteDialogOpen && (
				<MuiDialog
					className={classes.dialog}
					open={deleteDialogOpen ? true : false}
					onClose={handleCloseDialog}
					fullWidth={false}
					maxWidth="sm"
				>
					<DeleteConfirmationDialog
						header={`Delete ${parentType}`}
						onClose={handleCloseDialog}
						deleteFunc={() => {
							slidoutStateController.updateState({ formMode: 'delete' });
						}}
					>
						Do you want to delete the selected item?
					</DeleteConfirmationDialog>
				</MuiDialog>
			)}
			<div className={classes.dealDetailRoot}>
				<RightDialog
					open={true}
					handleClickDialogClose={handleClose}
					width="32vw"
					isTransactPage={isTransactPage}
					hiddenOverflow
					noBorder
					hideBackdrop={true}
				>
					<DialogHeader handleClickDialogClose={handleClose} openConfirmationDialog={openConfirmationDialog} />
					<Dialog />
				</RightDialog>
			</div>
		</>
	);
}

export default memo(Slideout);
