import React, { memo } from 'react';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';

import { ConvertOwnerToContactContainer } from 'store/containers/entity';

import { tableGlobalController } from 'stateManagement/tableController';

import InterestDetailForm from './InterestDetailForm';

function PropertyInterestDetaillDialog() {
	const { stateValues } = tableGlobalController.useState(['propertyInterestDetaillDialog']);
	const { type, ...rest } = stateValues.propertyInterestDetaillDialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			propertyInterestDetaillDialog: {},
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
				<ConvertOwnerToContactContainer propertyDetails={rest?.propertyDetails} onClose={handleCloseDialog} />
			)}
		</>
	);
}

export default memo(PropertyInterestDetaillDialog);
