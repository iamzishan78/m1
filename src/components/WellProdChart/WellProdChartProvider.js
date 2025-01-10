import React from 'react';

import WellProdChart from './WellProdChart';
import { WellProdChartContextProvider } from './WellProdChartContext';

function WellProdChartProvider(props) {
	return (
		<WellProdChartContextProvider>
			<WellProdChart />
		</WellProdChartContextProvider>
	);
}

export default WellProdChartProvider;
