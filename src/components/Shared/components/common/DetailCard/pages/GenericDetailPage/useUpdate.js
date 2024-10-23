import { useContext, useEffect } from 'react';
import { AppContext } from 'AppContext';
import { useMutation } from '@apollo/client';
import { detailCardController } from 'hookstate/detailCardController';
import { UPDATE_RECORD_IN_RUN_TIME_MODEL } from 'graphQL/useMutationRunTimeModel';

const useUpdate = () => {
	const [stateApp] = useContext(AppContext);
	const { stateValues } = detailCardController.useState(['currentAssetRecord']);
	const currentAssetRecord = stateValues.currentAssetRecord;

	const { loadingField } = detailCardController.useState(['loadingField']);

	const [updateRecordInRunTimeModel, { data }] = useMutation(UPDATE_RECORD_IN_RUN_TIME_MODEL, {
		fetchPolicy: 'network-only',
	});

	useEffect(() => {
		if (data) {
			loadingField.set(null);
		}
	}, [data, loadingField]);

	return {
		callApi: (key, value, originalKey) => {
			detailCardController.updateState({ loadingField: originalKey || key });

			updateRecordInRunTimeModel({
				variables: {
					ids: [currentAssetRecord?._id],
					tableName: stateApp.currentAsset?.tableName,
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
