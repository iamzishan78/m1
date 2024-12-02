import { useEffect } from 'react';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';

const useTabedTablesUnmount = ignoreUnmount => {
	useEffect(() => {
		if (ignoreUnmount) return;

		return () => {
			simpleTableGlobalController.setSelectedTab(0);
		};
	}, [ignoreUnmount]);
};

export default useTabedTablesUnmount;
