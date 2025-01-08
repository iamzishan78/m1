import React from 'react';

import ContactDetailCard from './ContactDetailCard';
import { ContactDetailsContextProvider } from './ContactDetailsContext';

export default function ContactDetailsProvider(props) {
	return (
		<ContactDetailsContextProvider>
			<ContactDetailCard>{props.children}</ContactDetailCard>
		</ContactDetailsContextProvider>
	);
}
