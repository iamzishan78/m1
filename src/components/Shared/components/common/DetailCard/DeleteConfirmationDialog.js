import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { REMOVE_RECORDS_FROM_RUNTIME_MODEL } from 'graphQL/useMutationRemoveRecordsFromRunTimeModel';

import { showErrorMessage, showSuccessMessage } from 'actions';
import { AppContext } from 'AppContext';

function ConfirmationDialog({ openDialog, handleDialogClose, tableName, ids, module }) {
	const dispatch = useDispatch();
	let history = useHistory();
	const [, setStateApp] = useContext(AppContext);
	const [removeRecordsFromRunTimeModel] = useMutation(REMOVE_RECORDS_FROM_RUNTIME_MODEL);

	const handleAccept = () => {
		handleDialogClose();

		setStateApp(state => ({ ...state, universalCircularLoaderAct: true }));
		let res = removeRecordsFromRunTimeModel({
			variables: {
				tableName,
				ids,
			},
		});

		res.then(result => {
			const { data } = result;

			if (data && data.removeRecordsFromRunTimeModel) {
				if (data.removeRecordsFromRunTimeModel.success) {
					dispatch(showSuccessMessage(`The ${module} was successfully removed`));
					history.push(`/land/customAsset/${tableName}`);
				} else {
					dispatch(showErrorMessage('Error occurred'));
				}
				setStateApp(state => ({
					...state,
					universalCircularLoaderAct: false,
				}));
			}
		});
	};

	return (
		<div>
			<Dialog
				fullWidth
				maxWidth="xs"
				open={openDialog}
				onClose={() => {
					handleDialogClose();
				}}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle style={{ textAlign: 'center', padding: '24px 24px 0 24px' }}>
					Are you sure you want to delete selected {module}?
				</DialogTitle>
				<DialogActions>
					<Button
						onClick={() => {
							handleDialogClose();
						}}
						color="primary"
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							handleAccept();
						}}
						color="secondary"
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

ConfirmationDialog.propTypes = {
	openDialog: PropTypes.bool.isRequired,
	handleDialogClose: PropTypes.func.isRequired,
	tableName: PropTypes.string.isRequired,
	ids: PropTypes.arrayOf(PropTypes.string).isRequired,
	module: PropTypes.string.isRequired,
};

export default ConfirmationDialog;
