import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, ButtonGroup } from '@material-ui/core';

import PropertyRevenueDetailDialog from 'components/MRTTable/TablesOverride/PropertyRelatedAgreementTable/RighDialogs';

import { tableGlobalController } from 'stateManagement/tableController';

import { getIdFromPath } from 'utils/helper';

function PropertyRevenueDetailToolBar() {
	const history = useHistory();
	const propertyId = getIdFromPath(history.location.pathname);
	return (
		<div>
			<ButtonGroup
				variant="contained"
				style={{ height: '30px', marginBottom: '8px' }}
				color="primary"
				aria-label="split button"
			>
				<Button
					id="addRelatedAgreementBtn"
					color="primary"
					size="small"
					onClick={() => {
						tableGlobalController.updateState({
							propertyRevenueDetailDialog: {
								type: 'addRelatedAgreement',
								customLayerId: propertyId,
							},
						});
					}}
				>
					+ ADD RELATED AGMT
				</Button>
			</ButtonGroup>
			<PropertyRevenueDetailDialog />
		</div>
	);
}

export default memo(PropertyRevenueDetailToolBar);
