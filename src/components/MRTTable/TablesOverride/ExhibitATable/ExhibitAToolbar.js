import React, { memo, useEffect, useState } from 'react';

import { Box, Switch } from '@mui/material';

import { tableController } from 'hookstate/tableController';

function ExhibitAToolbar({ tableKey }) {
	const [inactiveAgreementToggle, setInactiveAgreementToggle] = useState(false);

	useEffect(() => {
		if (!inactiveAgreementToggle) {
			tableController(tableKey).setFilter({
				field: 'shape.shapeJson.properties.agreementStatus',
				value: ['Active', 'ACTIVE', 'active'],
			});
		} else {
			tableController(tableKey).clearFilter('shape.shapeJson.properties.agreementStatus');
		}
	}, [inactiveAgreementToggle, tableKey]);

	return (
		<>
			<Box>
				<>Include inactive agreements</>
				<Switch
					checked={inactiveAgreementToggle}
					onChange={() => setInactiveAgreementToggle(!inactiveAgreementToggle)}
					name="checkedB"
					color="primary"
				/>
			</Box>
		</>
	);
}

export default memo(ExhibitAToolbar);
