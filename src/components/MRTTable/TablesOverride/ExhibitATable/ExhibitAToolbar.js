import React, { memo, useEffect, useState } from 'react';

import { Box, Switch } from '@mui/material';

import PropTypes from 'prop-types';

import { tableController } from 'stateManagement/tableController';

function ExhibitAToolbar({ tableKey }) {
	const [inactiveAgreementToggle, setInactiveAgreementToggle] = useState(false);
	const Controller = tableController(tableKey);

	const tableState = Controller.useState(['gridView']);
	const tableStateValues = tableState.stateValues;
	const selectedGridView = tableStateValues?.gridView?.selectedGridView;

	useEffect(() => {
		if (!inactiveAgreementToggle) {
			Controller.setFilter({
				field: 'shape.shapeJson.properties.agreementStatus',
				value: ['Active', 'ACTIVE', 'active'],
			});
		} else {
			Controller.clearFilter('shape.shapeJson.properties.agreementStatus');
		}
	}, [inactiveAgreementToggle, tableKey, selectedGridView]);

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
ExhibitAToolbar.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default memo(ExhibitAToolbar);
