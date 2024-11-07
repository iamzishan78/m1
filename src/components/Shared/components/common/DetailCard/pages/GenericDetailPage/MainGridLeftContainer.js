import React, { useContext, memo, useEffect, useState } from 'react';

import { AppContext } from 'AppContext';
import { globalStateController } from 'hookstate/globalStateController';

import { getAssetFields } from '../../helpers';
import DocViewer from 'components/Shared/DocViewer';
import CommonSummaryFieldsComponent from 'components/Shared/components/common/DetailCard/CommonSummaryFields';

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

	if (stateApp.viewDoc && ExtenstionGetter(stateApp?.viewDoc.name))
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

	return <CommonSummaryFieldsComponent formFields={formFields} />;
};

export default memo(MainGridLeftContainer);
