import React, { memo } from 'react';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';

import { tableGlobalController } from 'stateManagement/tableController';

import { ConvertOwnerToContactContainer } from 'store/containers/entity';

import InterestDetailForm from './InterestDetailForm';

function PropertyInterestDetaillDialog() {
	const { stateValues } = tableGlobalController.useState(['propertyInterestDetaillDialog']);
	const { type, ...rest } = stateValues.propertyInterestDetaillDialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			propertyInterestDetaillDialog: {},
		});
	};

	const handleClickDialogClose = () => {
		tableGlobalController.updateState({
			propertyInterestDetaillDialog: {
				type: 'addInterestDetail',
			},
		});
	};

	return (
		<>
			{type === 'addInterestDetail' && (
				<RightDialog open handleClickDialogClose={handleCloseDialog} width="500px">
					<InterestDetailForm onClose={handleCloseDialog} selectedInterest={rest?.selectedInterest} />
				</RightDialog>
			)}

			{type === 'convertOwnerToContact' && (
				<ConvertOwnerToContactContainer propertyDetails={rest?.propertyDetails} onClose={handleClickDialogClose} />
			)}
		</>
	);
}

export default memo(PropertyInterestDetaillDialog);
