import React from 'react';

import { RevenueContextProvider } from './RevenueContext';
import Revenue from './Revenue';

export default function ContactDetailsProvider(props) {
	return (
		<RevenueContextProvider>
			<Revenue>{props.children}</Revenue>
		</RevenueContextProvider>
	);
}
