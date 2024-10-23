import React, { useContext, memo } from 'react';

import { AppContext } from 'AppContext';

import DocViewer from 'components/Shared/DocViewer';
import CommonSummaryFieldsComponent from 'components/Shared/components/common/DetailCard/CommonSummaryFields';

const MainGridLeftContainer = () => {
	const [stateApp] = useContext(AppContext);

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

	return <CommonSummaryFieldsComponent />;
};

export default memo(MainGridLeftContainer);
