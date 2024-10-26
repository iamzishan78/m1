import React, { memo } from 'react';

import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import { tableController } from 'hookstate/tableController';
import { removeSpaces } from 'components/MRTTable/utils/helper';
import { ADD_RECORD_IN_RUN_TIME_MODEL } from 'graphQL/useMutationRunTimeModel';

function DynamicAssetGridToolBar({ tableKey }) {
	const history = useHistory();
	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['fetchDynamicSchema']);
	const tableStateValues = tableState.stateValues;

	const [addAndUpdateInRunTimeModel] = useMutation(ADD_RECORD_IN_RUN_TIME_MODEL, {
		onCompleted: data => {
			const addedRecord = data?.addRecordInRunTimeModel?.asset || {};
			if (addedRecord && addedRecord?._id) {
				const model = removeSpaces(tableStateValues.fetchDynamicSchema.tableName);
				history.push(`/land/customAsset/${model}/details/${addedRecord?._id}`);
			}
		},
		fetchPolicy: 'no-cache',
		awaitRefetchQueries: true,
	});

	const handleClick = () => {
		addAndUpdateInRunTimeModel({
			variables: {
				tableName: tableStateValues.fetchDynamicSchema.tableName,
				record: {},
			},
		});
	};
	return (
		<>
			<Button variant="contained" color="primary" onClick={handleClick}>
				{`+ ADD ${tableStateValues.fetchDynamicSchema.tableName}`}
			</Button>
		</>
	);
}

export default memo(DynamicAssetGridToolBar);
