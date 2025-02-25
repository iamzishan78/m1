import React from 'react';

import TabButtons from 'components/Shared/TabPanels/TabButtons';

import { tableGlobalController } from 'controllers/tableController';

const TabHeader = ({ labels }) => {
	const {
		stateValues: { tabKey },
	} = tableGlobalController.useState(['tabKey']);

	return <TabButtons labels={labels} value={tabKey} setValue={n => tableGlobalController.setSelectedTab(n)} />;
};

export default TabHeader;
