import React, { memo } from 'react';

import { Button, ButtonGroup } from '@material-ui/core';

import { detailCardController } from 'hookstate/detailCardController';
import { tableGlobalController } from 'hookstate/tableController';

import RelatedAgreementTableDialogs from './RightDialogs';

function RelatedDocumentToolbar({ table, tableKey }) {
	const agreementDetailState = detailCardController.useState(['customLayer']);
	const agreementDetailsValues = agreementDetailState.stateValues;

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
							tableGlobalController.updateState({
								dialog: {
									type: 'createAndAddRelatedAgreement',
									tableKey,
									customLayerId: agreementDetailsValues?.customLayer?._id,
								},
							});
						}}
					>
						+ ADD RELATED AGMT
					</Button>
				</ButtonGroup>
			</>
			<RelatedAgreementTableDialogs />
		</>
	);
}

export default memo(RelatedDocumentToolbar);
