import React, { useContext, memo, useEffect, useState } from 'react';

import CommonSummaryFieldsComponent from 'components/Shared/components/common/DetailCard/CommonSummaryFields';
import DocViewer from 'components/Shared/DocViewer';

import { globalStateController } from 'stateManagement/globalStateController';

import { AppContext } from 'AppContext';

import { getAssetFields } from '../../helpers';

const MainGridLeftContainer = () => {
	const [stateApp] = useContext(AppContext);
	const [formFields, setFormFields] = useState([]);

	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	useEffect(() => {
		const summaryFields = getAssetFields(currentAsset, true);
		setFormFields(summaryFields);
	}, [currentAsset, setFormFields]);

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
