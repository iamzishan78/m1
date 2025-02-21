import React, { memo } from 'react';

import { Button, ButtonGroup } from '@material-ui/core';

import PropertyInterestDetaillDialog from 'components/MRTTable/TablesOverride/PropertyInterestDetailTable/RightDialogs';

import { detailCardController } from 'controllers/detailCardController';
import { tableGlobalController } from 'controllers/tableController';

function PropertyInterestDetailTable({ table, tableKey }) {
	const { stateValues } = detailCardController.useState(['summaryData']);
	const propertyData = stateValues.summaryData;
	return (
		<>
			<>
				<ButtonGroup
					variant="contained"
					style={{ height: '30px', marginBottom: '8px' }}
					color="primary"
					aria-label="split button"
				>
					<Button
						id="addDocument"
						color="primary"
						size="small"
						aria-label="select merge strategy"
						aria-haspopup="menu"
						onClick={() => {
							const contactId = propertyData?.owner?.contactId;
							let type = 'convertOwnerToContact';
							if (contactId) {
								type = 'addInterestDetail';
							}
							tableGlobalController.updateState({
								propertyInterestDetaillDialog: {
									type,
									propertyDetails: propertyData,
								},
							});
						}}
					>
						+ ADD INTEREST
					</Button>
				</ButtonGroup>
			</>
			<PropertyInterestDetaillDialog />
		</>
	);
}

export default memo(PropertyInterestDetailTable);
