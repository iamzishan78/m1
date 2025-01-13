import React, { useState, memo } from 'react';

import { Dialog as MuiDialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useHookstate } from '@hookstate/core';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import DeleteConfirmationDialog from 'components/MRTTable/Common/Dialog/ConfirmationDialog/DeleteConfirmationDialog';

import { slidoutState } from 'hookstate/initialStates';
import { slidoutStateController } from 'hookstate/slidoutStateController';

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

	const formMode = useHookstate(slidoutState.formMode);
	const parentType = useHookstate(slidoutState.parentType);
	const view = useHookstate(slidoutState.view).get({ noproxy: true });

	const handleCloseDialog = () => {
		setDeleteDialogOpen(false);
	};

	const handleClose = async () => {
		if (view?.name !== 'Home') {
			if (window.location.pathname.startsWith('/calendar/activities')) {
				window.history.pushState('', '', '/calendar/activities');
			}

			slidoutState.selectedActivity.set(null);
			slidoutState.selectedActivityId.set('');
			slidoutStateController.hideSlideout();
		} else {
			slidoutState.formMode.set('update');
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
						header={`Delete ${parentType.get()}`}
						onClose={handleCloseDialog}
						deleteFunc={() => {
							formMode.set('delete');
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
