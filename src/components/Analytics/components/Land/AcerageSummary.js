import MRTTable from 'components/MRTTable';
import { globalStateController } from 'hookstate/globalStateController';
import { tableController } from 'hookstate/tableController';
import React, { useEffect } from 'react';

const TableKey = 'AcerageSummaryTable';

const AcerageSummary = () => {
	const { stateValues } = globalStateController.useState(['globalSearch']);

	useEffect(() => {
		tableController(TableKey).setGlobalFilter(stateValues.globalSearch);
	}, [stateValues.globalSearch]);

	return <MRTTable name={TableKey} />;
};

export default AcerageSummary;
