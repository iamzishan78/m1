import React, { memo } from 'react';

import { useMutation } from '@apollo/client';

import Loader from 'components/Loaders';

import { ADD_RECORD_IN_RUN_TIME_MODEL } from 'graphQL/useMutationRunTimeModel';

import { tableGlobalController } from 'hookstate/tableController';

import CreateUpdateRecordInRunTimeModal from './CreateUpdateRecordInRunTimeModal';

function DynamicAssetTableDialogs() {
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};

	const [addAndUpdateInRunTimeModel] = useMutation(ADD_RECORD_IN_RUN_TIME_MODEL, {
		awaitRefetchQueries: true,
	});

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			dialog: {},
		});
	};

	const onSubmit = record => {
		Loader.createToast('addAndUpdate', 'Add and Update in Progress');
		addAndUpdateInRunTimeModel({
			variables: { name: rest.name, record },
		}).then(
			res => {
				if (res?.data?.addRecordInRunTimeModel) {
					const { success, message } = res.data.addRecordInRunTimeModel;
					if (success) {
						Loader.successToast('addAndUpdate', message);
					} else {
						Loader.errorToast('addAndUpdate', message);
					}
				} else {
					Loader.errorToast('addAndUpdate', 'Failed to add row (s)');
				}
				tableGlobalController.refetch();
			},
			() => {
				Loader.errorToast('addAndUpdate', 'Failed to add row (s)');
				tableGlobalController.refetch();
			}
		);
	};

	return (
		<>
			{type === 'addAndUpdateInRunTimeModel' && (
				<CreateUpdateRecordInRunTimeModal
					open={true}
					columns={rest.columns}
					onClose={handleCloseDialog}
					onSubmit={onSubmit}
					name={rest.name}
				/>
			)}
		</>
	);
}

export default memo(DynamicAssetTableDialogs);
