import { useEffect } from 'react';

import { useMutation } from '@apollo/client';

import { detailCardController } from 'controllers/detailCardController';
import { globalStateController } from 'controllers/globalStateController';

import { UPDATE_RECORD_IN_RUN_TIME_MODEL } from 'graphQL/useMutationRunTimeModel';

const useUpdate = () => {
	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');
	const { stateValues } = detailCardController.useState(['currentAssetRecord']);
	const currentAssetRecord = stateValues.currentAssetRecord;

	const [updateRecordInRunTimeModel, { data }] = useMutation(UPDATE_RECORD_IN_RUN_TIME_MODEL, {
		fetchPolicy: 'network-only',
	});

	useEffect(() => {
		if (data) {
			detailCardController.updateState({ loadingField: null });
		}
	}, [data]);

	return {
		callApi: (key, value, originalKey) => {
			detailCardController.updateState({ loadingField: originalKey || key });

			updateRecordInRunTimeModel({
				variables: {
					ids: [currentAssetRecord?._id],
					tableName: currentAsset?.tableName,
					record: {
						[key]: value,
					},
				},
				refetchQueries: ['getRecordFromRunTimeModel'],
				awaitRefetchQueries: false,
			});
		},
	};
};

export default useUpdate;
