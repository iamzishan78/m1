import React from 'react';

import { ParcelCardContextProvider } from './ParcelCardContext';
import ParcelCard from './ParcelCard';

export default function ParcelCardProvider(props) {
	return (
		<ParcelCardContextProvider>
			<ParcelCard selectedParcel={props.selectedParcel} />
		</ParcelCardContextProvider>
	);
}
