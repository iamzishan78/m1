import { useEffect } from 'react';

import { tableGlobalController } from 'hookstate/tableController';

const useTabedTablesUnmount = ignoreUnmount => {
	useEffect(() => {
		if (ignoreUnmount) {
			return;
		}

		return () => {
			tableGlobalController.setSelectedTab(0);
		};
	}, [ignoreUnmount]);
};

export default useTabedTablesUnmount;
