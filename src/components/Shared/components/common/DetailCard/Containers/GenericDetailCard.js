import React, { useMemo } from 'react';

import NavHeader from 'components/Land/components/Common/NavHeader';
import { formatDate } from 'components/Shared/functions';

import { detailCardController } from 'stateManagement/detailCardController';
import { globalStateController } from 'stateManagement/globalStateController';

import GenericDetail from '../Cards/GenericDetail';

function GenericDetailCardContainer() {
	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const {
		stateValues: { currentAssetRecord },
	} = detailCardController.useState(['currentAssetRecord']);

	const controlColumn = useMemo(() => currentAsset?.modelKeys?.find(key => !!key.isControlColumn), [currentAsset]);

	const getControlColumnData = () => {
		if (controlColumn && currentAssetRecord) {
			const controlColumnKey = controlColumn?.mappingKey;
			const value = currentAssetRecord[controlColumnKey];

			switch (controlColumn.keyType) {
				case 'date':
					return formatDate(value);
				case 'user':
					return value?.name;
				case 'boolean':
					return value ? 'Yes' : 'No';
				default:
					return value;
			}
		}

		return null;
	};

	return (
		<NavHeader title={getControlColumnData()}>
			<GenericDetail />
		</NavHeader>
	);
}

export default GenericDetailCardContainer;
