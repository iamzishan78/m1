import React, { memo } from 'react';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';

import { tableGlobalController } from 'hookstate/tableController';

import AddNewRelatedAgreementDialog from './AddNewRelatedAgreementDialog';

function RelatedAgreementTableDialogs() {
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			dialog: {},
		});
	};

	return (
		<>
			{type === 'createAndAddRelatedAgreement' && (
				<RightDialog open handleClickDialogClose={handleCloseDialog} width="600px">
					<AddNewRelatedAgreementDialog
						customLayerId={rest?.customLayerId}
						setDrawer={handleCloseDialog}
						parentType="Agreement"
						relatedAgreement={rest?.relatedAgreement}
					/>
				</RightDialog>
			)}
		</>
	);
}

export default memo(RelatedAgreementTableDialogs);
