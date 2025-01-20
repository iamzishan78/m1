import React, { useMemo } from 'react';

import { useHistory } from 'react-router-dom';

import { detailCardController } from 'hookstate/detailCardController';
import { globalStateController } from 'hookstate/globalStateController';

import DocumentsCard from '../Cards/Document';
import NavHeader from 'components/Land/components/Common/NavHeader';

function DocumentCardContainer() {
	const history = useHistory();

	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const {
		stateValues: { currentAssetRecord },
	} = detailCardController.useState(['currentAssetRecord']);

	const controlColumn = useMemo(() => currentAsset?.modelKeys?.find(key => !!key.isControlColumn), [currentAsset]);
	return (
		<NavHeader title={currentAssetRecord?.[controlColumn?.mappingKey]} onClickFunc={() => history.goBack()}>
			<DocumentsCard />
		</NavHeader>
	);
}

export default DocumentCardContainer;
