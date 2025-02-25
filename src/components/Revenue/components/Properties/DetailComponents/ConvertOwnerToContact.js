import React, { useState, useEffect } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { MultipleOwnerToContactDrawerContainer } from 'store/containers';

import { Modals } from 'styles/Modal';

import { detailCardController } from 'stateManagement/detailCardController';
import { tableGlobalController } from 'stateManagement/tableController';

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
	const { stateValues } = detailCardController.useState(['summaryData']);
	const propertyData = stateValues.summaryData;

	useEffect(() => {
		getOwnerEntityDetailAction(propertyDetails?.owner);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
							tableGlobalController.updateState({
								propertyInterestDetaillDialog: {
									type: 'addInterestDetail',
									propertyDetails: propertyData,
								},
							});
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
