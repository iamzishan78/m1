import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import _ from 'lodash';
import { Modals } from '../../../../../styles/Modal';

export default function DeleteConfirmationDialogContent({ header, children, onClose, deleteFunc, deletedData }) {
	const modalClass = Modals();
	return (
		<Dialog style={{ zIndex: 9999999999 }} open={true}>
			<DialogTitle className={modalClass.title} id="customized-dialog-title">
				{header}
				<HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={onClose} />
			</DialogTitle>
			<DialogContent>
				<h3 className={modalClass.inputLabel}>{children}</h3>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						onClose();
					}}
					color="primary"
				>
					Cancel
				</Button>
				<Button
					id="deleteButton"
					onClick={() => {
						deleteFunc(deletedData);
						onClose();
					}}
					color="secondary"
					data-testid="delete-confirm"
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}
