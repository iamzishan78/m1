import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useLazyQuery } from '@apollo/client';

import { ContactDetailsContextProvider } from 'components/ContactDetailCard/ContactDetailsContext';
import { NavigationContext } from 'components/Navigation/NavigationContext';

import { CONTACT } from 'graphQL/useQueryContact';

import ParcelsDetailCard from './ParcelsDetailCard';

export default function ContactParcelsInterestProvider(props) {
	let history = useHistory();
	const [stateNav, setStateNav] = useContext(NavigationContext);
	const [contactData, setContactData] = useState(null);

	const [getContact, { data }] = useLazyQuery(CONTACT);

	const parcelId = history.location.pathname.split('/')[history.location.pathname.split('/').length - 1];

	const contactId = history.location.pathname.split('/')[history.location.pathname.split('/').length - 3];

	useEffect(() => {
		if (contactId) {
			getContact({
				variables: {
					contactId: contactId,
				},
			});
		}
	}, [contactId, getContact]);

	useEffect(() => {
		if (data && data.contact) {
			setContactData(data.contact);
		}
	}, [data]);

	const checkModuleHistory = () => {
		return !!stateNav.contactFromMap;
	};

	return (
		<div style={{ position: 'absolute', top: '64px' }}>
			<ContactDetailsContextProvider>
				<ParcelsDetailCard id={parcelId}>{props.children}</ParcelsDetailCard>
			</ContactDetailsContextProvider>
		</div>
	);
}
