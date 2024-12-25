import React from 'react';

import ContactDetailedInfoCard from './ContactDetailedInfoCard';
import { ContactDetailsContextProvider } from '../ContactDetailCard/ContactDetailsContext';

export default function ContactDetailsProvider(props) {
	return (
		<ContactDetailsContextProvider>
			<ContactDetailedInfoCard>{props.children}</ContactDetailedInfoCard>
		</ContactDetailsContextProvider>
	);
}
