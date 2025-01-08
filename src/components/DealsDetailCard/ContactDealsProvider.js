import React from 'react';

import ContactDealsCard from './ContactDealsCard';
import { ContactDetailsContextProvider } from '../ContactDetailCard/ContactDetailsContext';

export default function ContactDocumentsProvider(props) {
	return (
		<ContactDetailsContextProvider>
			<ContactDealsCard>{props.children}</ContactDealsCard>
		</ContactDetailsContextProvider>
	);
}
