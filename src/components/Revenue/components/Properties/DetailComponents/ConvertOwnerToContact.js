import React, { useState, useEffect } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { Modals } from 'styles/Modal';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { MultipleOwnerToContactDrawerContainer } from 'store/containers';

const ConvertOwnerToContact = ({
	getOwnerEntityDetailAction,
	ownerEntityDetail,
	propertyDetails,
	onSuccess,
	onClose,
}) => {
	const modalClass = Modals();
	const [showDialog, setShowOwnerDialog] = useState(true);
	const [showConvertDialog, setShowConvertDialog] = useState(false);

	useEffect(() => {
		getOwnerEntityDetailAction(propertyDetails.owner);
	}, [propertyDetails]);

	return (
		<>
			<Dialog style={{ zIndex: 1301 }} open={showDialog}>
				<DialogTitle className={modalClass.title} id="customized-dialog-title">
					Owner is not a contact
					<HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={onClose} />
				</DialogTitle>
				<DialogContent>
					<h3 className={modalClass.inputLabel}>Would you like to convert the property owner to a contact now?</h3>
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
						onClick={() => {
							setShowOwnerDialog(false);
							setShowConvertDialog(true);
						}}
						color="secondary"
					>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
			{showConvertDialog && (
				<MultipleOwnerToContactDrawerContainer
					onClose={() => {
						onClose();
						setShowConvertDialog(false);
					}}
					rows={[{ ...ownerEntityDetail }]}
					setM1nSelectedRowsIndexes={() => {}}
					onSuccess={onSuccess}
					setRows={() => {}}
				/>
			)}
		</>
	);
};

export default ConvertOwnerToContact;
