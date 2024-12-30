import React from 'react';

import Calendar from '.';
import { ActivitiesContextProvider } from './ActivitiesContext';

export function ActivitiesProvider(props) {
	return (
		<ActivitiesContextProvider>
			<Calendar>{props.children}</Calendar>
		</ActivitiesContextProvider>
	);
}

export default ActivitiesProvider;
