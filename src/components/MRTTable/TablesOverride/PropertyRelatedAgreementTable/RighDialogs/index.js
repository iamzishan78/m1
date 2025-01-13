import React, { memo } from 'react';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';

import { tableGlobalController } from 'hookstate/tableController';

import AddNewRelatedAgreementDialog from './AddNewRelatedAgreementDialog';

function PropertyRevenueDetailDialog() {
	const { stateValues } = tableGlobalController.useState(['propertyRevenueDetailDialog']);
	const { type, ...rest } = stateValues.propertyRevenueDetailDialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			propertyRevenueDetailDialog: {},
		});
	};

	return (
		<>
			{type === 'addRelatedAgreement' && (
				<RightDialog open handleClickDialogClose={handleCloseDialog} width="650px">
					<AddNewRelatedAgreementDialog
						customLayerId={rest?.customLayerId}
						handleClose={handleCloseDialog}
						parentType="Property"
						relatedAgreement={rest?.relatedAgreement}
					/>
				</RightDialog>
			)}
		</>
	);
}

export default memo(PropertyRevenueDetailDialog);
