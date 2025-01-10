import React, { useEffect } from 'react';

import MRTTable from 'components/MRTTable';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController } from 'hookstate/tableController';

const TableKey = 'AcreageSummaryTable';

const AcreageSummary = () => {
	const { stateValues } = globalStateController.useState(['globalSearch']);

	useEffect(() => {
		tableController(TableKey).setGlobalFilter(stateValues.globalSearch);
	}, [stateValues.globalSearch]);

	return <MRTTable name={TableKey} />;
};

export default AcreageSummary;
