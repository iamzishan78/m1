import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { ADD_RECORD_IN_RUN_TIME_MODEL } from 'graphQL/useMutationRunTimeModel';

import { tableController } from 'hookstate/tableController';

function DynamicAssetGridToolBar({ tableKey }) {
	const history = useHistory();

	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['fetchDynamicSchema']);
	const tableStateValues = tableState.stateValues;

	const { name, tableName } = tableStateValues.fetchDynamicSchema || {};

	const [addAndUpdateInRunTimeModel] = useMutation(ADD_RECORD_IN_RUN_TIME_MODEL, {
		onCompleted: data => {
			const addedRecord = data?.addRecordInRunTimeModel?.asset || {};
			if (addedRecord && addedRecord?._id) {
				history.push(`/land/customAsset/${tableName}/details/${addedRecord?._id}`);
			}
		},
		fetchPolicy: 'no-cache',
		awaitRefetchQueries: true,
	});

	const handleClick = () => {
		addAndUpdateInRunTimeModel({
			variables: {
				name,
				record: {},
			},
		});
	};
	return (
		<>
			<Button variant="contained" color="primary" onClick={handleClick}>
				{`+ ADD ${name}`}
			</Button>
		</>
	);
}

DynamicAssetGridToolBar.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default memo(DynamicAssetGridToolBar);
