import React from 'react';

import Revenue from './Revenue';
import { RevenueContextProvider } from './RevenueContext';

export default function ContactDetailsProvider(props) {
	return (
		<RevenueContextProvider>
			<Revenue>{props.children}</Revenue>
		</RevenueContextProvider>
	);
}
