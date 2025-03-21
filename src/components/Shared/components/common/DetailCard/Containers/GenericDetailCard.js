import React, { useMemo } from 'react';

import NavHeader from 'components/Land/components/Common/NavHeader';

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
	return (
		<NavHeader title={currentAssetRecord?.[controlColumn?.mappingKey]}>
			<GenericDetail />
		</NavHeader>
	);
}

export default GenericDetailCardContainer;
