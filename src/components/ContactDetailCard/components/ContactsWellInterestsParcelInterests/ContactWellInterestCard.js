import { useLazyQuery } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { CONTACT } from 'graphQL/useQueryContact';

import ContactsWellInterestsParcelInterests from './ContactsWellInterestsParcelInterests';

export default function ContactDocumentsCard(props) {
	let history = useHistory();

	const [contactData, setContactData] = useState(null);

	const contactId = history.location.pathname.split('/')[history.location.pathname.split('/').length - 2];

	const [getContact, { data }] = useLazyQuery(CONTACT);

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

	return (
		<div
			style={{
				position: 'absolute',
				top: '64px',
				height: '95%',
				width: '100%',
				zIndex: '50',
			}}
		>
			{contactData ? (
				<ContactsWellInterestsParcelInterests activeTap={0} contactData={contactData} />
			) : (
				<div style={{ padding: 20 }}>
					<CircularProgress size={80} disableShrink color="secondary" />
				</div>
			)}
		</div>
	);
}
