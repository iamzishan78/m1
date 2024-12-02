import React, { useContext, useEffect } from 'react';

import { AppContext } from 'AppContext';
import MRTTable from 'components/MRTTable';
import { tableController } from 'hookstate/tableController';

function Agreements(props) {
	const [stateApp] = useContext(AppContext);

	useEffect(() => {
		if (stateApp.landSearchFilters) {
			let filters = [];
			for (const key of Object.keys(stateApp.landSearchFilters)) {
				filters = [...filters, ...stateApp.landSearchFilters[key]];
			}
			tableController('AgreementTable').updateState({ filters });
		}
	}, [stateApp.landSearchFilters]);

	return (
		<div
			style={{
				marginTop: '65px',
				marginLeft: '-10px',
			}}
		>
			<MRTTable name="AgreementTable" />
		</div>
	);
}

export default Agreements;
