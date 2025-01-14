import React, { useMemo } from 'react';

import { detailCardController } from 'hookstate/detailCardController';
import { globalStateController } from 'hookstate/globalStateController';

import GenericDetail from '../Cards/GenericDetail';
import NavHeader from 'components/Land/components/Common/NavHeader';

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
