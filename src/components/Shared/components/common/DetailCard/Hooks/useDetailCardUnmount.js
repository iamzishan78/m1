import { useEffect } from 'react';

import { detailCardController } from 'controllers/detailCardController';

const useDetailCardUnmount = ignoreUnmount => {
	useEffect(() => {
		if (ignoreUnmount) {
			return;
		}

		return () => {
			detailCardController.setBaseSelectedTab(0);
			detailCardController.setBottomSelectedTab(0);
		};
	}, [ignoreUnmount]);
};

export default useDetailCardUnmount;
