import React from 'react';

import ContactDocumentsCard from './ContactDocumentsCard';
import { ContactDetailsContextProvider } from '../ContactDetailCard/ContactDetailsContext';

export default function ContactDocumentsProvider(props) {
	return (
		<ContactDetailsContextProvider>
			<ContactDocumentsCard {...props}>{props.children}</ContactDocumentsCard>
		</ContactDetailsContextProvider>
	);
}
