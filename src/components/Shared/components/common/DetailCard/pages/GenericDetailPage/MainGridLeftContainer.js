import React, { useContext, memo, useEffect, useState } from 'react';

import CommonSummaryFieldsComponent from 'components/Shared/components/common/DetailCard/CommonSummaryFields';
import DocViewer from 'components/Shared/DocViewer';

import { globalStateController } from 'stateManagement/globalStateController';
import { popupController } from 'stateManagement/popupStateController';

import { AppContext } from 'AppContext';

import { getAssetFields } from '../../helpers';

const MainGridLeftContainer = () => {
	const [stateApp] = useContext(AppContext);
	const [formFields, setFormFields] = useState([]);

	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const {
		stateValues: { expandedCard },
	} = popupController.useState(['expandedCard']);

	useEffect(() => {
		const summaryFields = getAssetFields(currentAsset, true);
		const nonsummaryFields = expandedCard ? getAssetFields(currentAsset, false) : [];

		// If card is expanded, combine both summary and non-summary fields
		setFormFields([...summaryFields, ...nonsummaryFields]);
	}, [currentAsset, setFormFields, expandedCard]);

	const ExtenstionGetter = name => {
		let fileExtension = name?.slice(name.lastIndexOf('.') + 1)?.toLowerCase();
		return fileExtension;
	};

	if (stateApp.viewDoc && ExtenstionGetter(stateApp?.viewDoc.name)) {
		return (
			<DocViewer
				divCondition={true}
				DocStyle={{
					position: 'relative',
					height: 'calc(100% - 5px)',
					width: '100vw',
				}}
			/>
		);
	}

	return <CommonSummaryFieldsComponent formFields={formFields} />;
};

export default memo(MainGridLeftContainer);
