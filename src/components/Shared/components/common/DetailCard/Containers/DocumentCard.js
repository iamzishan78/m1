import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import NavHeader from 'components/Land/components/Common/NavHeader';

import { detailCardController } from 'controllers/detailCardController';
import { globalStateController } from 'controllers/globalStateController';

import DocumentsCard from '../Cards/Document';

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
