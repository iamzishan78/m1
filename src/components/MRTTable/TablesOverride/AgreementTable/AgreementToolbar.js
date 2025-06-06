import React, { memo } from 'react';

import { Button, ButtonGroup } from '@material-ui/core';

import PropTypes from 'prop-types';

import MetaFieldList from 'components/MRTTable/Common/MetaData/MetaFieldList';

import { globalStateController } from 'stateManagement/globalStateController';
import { tableController } from 'stateManagement/tableController';

import MetaField from 'utils/MetaField';

function AgreementToolBar({ tableKey }) {
	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['metaFieldList', 'fetchMetaData', 'TableSchema']);
	const tableStateValues = tableState.stateValues;

	const { globalStateValues } = globalStateController.useState(['showFieldModal'], 'globalStateValues');

	return (
		<>
			<ButtonGroup variant="contained" color="primary" aria-label="split button">
				<Button
					id="addDocument"
					color="primary"
					size="small"
					aria-label="select merge strategy"
					aria-haspopup="menu"
					onClick={() => {
						Controller.updateState({
							metaFieldList: true,
						});
					}}
				>
					Meta Fields
				</Button>
			</ButtonGroup>

			{!!tableStateValues?.metaFieldList && <MetaFieldList tableKey={tableKey} />}
			{tableState.fetchMetaData && !!globalStateValues.showFieldModal && (
				<MetaField
					tableKey={tableKey}
					columns={tableStateValues?.TableSchema}
					category={tableStateValues?.fetchMetaData?.category}
				/>
			)}
		</>
	);
}

AgreementToolBar.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default memo(AgreementToolBar);
