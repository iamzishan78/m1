import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useMutation } from '@apollo/client';

import { UPDATE_RECORD_IN_RUN_TIME_MODEL } from 'graphQL/useMutationRunTimeModel';

import { detailCardController } from 'stateManagement/detailCardController';
import { globalStateController } from 'stateManagement/globalStateController';

import { UserSession } from 'utils/user';

import { showInfoMessage } from 'actions';

const useUpdate = () => {
	const dispatch = useDispatch();
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

	const validateField = (field, value) => {
		if (!field) {
			return;
		}
		const isEmpty = value === undefined || value === null || value === '' || value === 0;

		if (field.isRequired && isEmpty) {
			dispatch(showInfoMessage(`${field.label} is required`));
			return false;
		}
		return true;
	};

	return {
		callApi: ({ key, value, originalKey, field, previousValue, resetFn }) => {
			if (field && resetFn) {
				const isValid = validateField(field, value);
				if (!isValid) {
					resetFn?.(previousValue);
					return;
				}
			}

			detailCardController.updateState({ loadingField: originalKey || key });

			updateRecordInRunTimeModel({
				variables: {
					ids: [currentAssetRecord?._id],
					tableName: currentAsset?.tableName,
					record: {
						[key]: value,
					},
					targetLabel: currentAsset?.name,
					tenant: UserSession.getStorageItem('tenantName'),
				},
				refetchQueries: ['getRecordFromRunTimeModel'],
				awaitRefetchQueries: false,
			});
		},
	};
};

export default useUpdate;
