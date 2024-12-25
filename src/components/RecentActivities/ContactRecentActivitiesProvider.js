import React from 'react';

import ContactRecentActivitiesCard from './ContactRecentActivitiesCard';
import { ContactDetailsContextProvider } from '../ContactDetailCard/ContactDetailsContext';

export default function ContactRecentActivitiesProvider(props) {
	return (
		<ContactDetailsContextProvider>
			<ContactRecentActivitiesCard>{props.children}</ContactRecentActivitiesCard>
		</ContactDetailsContextProvider>
	);
}
