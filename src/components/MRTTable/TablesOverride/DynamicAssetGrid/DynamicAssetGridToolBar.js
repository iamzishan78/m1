import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { removeSpaces } from 'components/MRTTable/utils/helper';

import { tableController } from 'controllers/tableController';

import { ADD_RECORD_IN_RUN_TIME_MODEL } from 'graphQL/useMutationRunTimeModel';

function DynamicAssetGridToolBar({ tableKey }) {
	const history = useHistory();
	const [tableName, setTableName] = useState('');

	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['fetchDynamicSchema']);
	const tableStateValues = tableState.stateValues;

	useEffect(() => {
		setTableName(tableStateValues.fetchDynamicSchema.tableName);
	}, [tableStateValues.fetchDynamicSchema.tableName]);

	const [addAndUpdateInRunTimeModel] = useMutation(ADD_RECORD_IN_RUN_TIME_MODEL, {
		onCompleted: data => {
			const addedRecord = data?.addRecordInRunTimeModel?.asset || {};
			if (addedRecord && addedRecord?._id) {
				const model = removeSpaces(tableName);
				history.push(`/land/customAsset/${model}/details/${addedRecord?._id}`);
			}
		},
		fetchPolicy: 'no-cache',
		awaitRefetchQueries: true,
	});

	const handleClick = () => {
		addAndUpdateInRunTimeModel({
			variables: {
				tableName,
				record: {},
			},
		});
	};
	return (
		<>
			<Button variant="contained" color="primary" onClick={handleClick}>
				{`+ ADD ${tableName}`}
			</Button>
		</>
	);
}

DynamicAssetGridToolBar.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default memo(DynamicAssetGridToolBar);
