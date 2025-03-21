import { useEffect } from 'react';

import { tableGlobalController } from 'stateManagement/tableController';

const useTabedTablesUnmount = ignoreUnmount => {
	useEffect(() => {
		if (ignoreUnmount) {
			return null;
		}

		return () => {
			tableGlobalController.setSelectedTab(0);
		};
	}, [ignoreUnmount]);
};

export default useTabedTablesUnmount;
