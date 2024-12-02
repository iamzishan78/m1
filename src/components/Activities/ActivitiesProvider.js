import React from 'react';
import { ActivitiesContextProvider } from './ActivitiesContext';
import Calendar from '.';

export function ActivitiesProvider(props) {
	return (
		<ActivitiesContextProvider>
			<Calendar>{props.children}</Calendar>
		</ActivitiesContextProvider>
	);
}

export default ActivitiesProvider;
