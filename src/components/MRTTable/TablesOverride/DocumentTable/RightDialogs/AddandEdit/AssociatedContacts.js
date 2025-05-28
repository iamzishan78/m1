import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { DocumentContext } from 'components/Document/DocumentContext';

import { ADD_CONTACT_TO_FILE_DESCRIPTOR } from 'graphQL/useMutationAddContactToFileDescriptor';
import { DELETE_CONTACT_FROM_FILE_DESCRIPTOR } from 'graphQL/useMutationDeleteContactFromFileDescriptor';

import { globalStateController } from 'stateManagement/globalStateController';

import { UserSession } from 'utils/user';

import DocumentAssociation from './DocumentAssociation';

export default function AssociatedContacts({ selectedDocument }) {
	// Initials
	let history = useHistory();

	// States
	const [search, setSearch] = useState('');
	const [isSearchActive, setSearchState] = useState(false);

	const { getContactsFromDocument, contactsFromDocument, getContactsLoading, contacts, setContacts } =
		React.useContext(DocumentContext);

	const [addContactToFileDescriptor, { loading: addContactsLoading }] = useMutation(ADD_CONTACT_TO_FILE_DESCRIPTOR);

	// Mutations
	const [deleteContactFromDescriptor, { loading: deleteContactLoading }] = useMutation(
		DELETE_CONTACT_FROM_FILE_DESCRIPTOR,
		{
			onCompleted: () =>
				getContactsFromDocument({
					variables: {
						descriptorObject: selectedDocument?._id,
					},
				}),
		}
	);

	// Fetching contacts from descriptor
	useEffect(() => {
		getContactsFromDocument({
			variables: {
				descriptorObject: selectedDocument?._id,
			},
		});
	}, []);

	// delete contact from File Descriptor
	const deleteContact = async contactId => {
		await deleteContactFromDescriptor({
			variables: { descriptorId: selectedDocument?._id, contactId },
		});
	};

	const addSelectedContactToDocument = contact => {
		let contactData = {
			...contact,
			createdBy: globalStateController.getValue('user')?._id,
		};
		addContactToFileDescriptor({
			variables: {
				descriptorId: selectedDocument?._id,
				contactData: contactData,
			},
			awaitRefetchQueries: true,
		}).then(({ data }) => {
			const descriptorId = data.addContactToFileDescriptor._id;
			window.setStateApp(stateApp => ({
				...stateApp,
				selectedDocument: { ...selectedDocument, _id: descriptorId },
			}));
			getContactsFromDocument({
				variables: {
					descriptorObject: descriptorId,
				},
			});
		});
	};

	// sending to Contacts page
	const goToContact = contact => {
		const tenantName = UserSession.getStorageItem('tenantName');
		history.push(`/contact/details/${contact?._id.toLowerCase()}?tenant=${tenantName}`);
		window.setStateApp(stateApp => ({ ...stateApp, DocumentDrawer: false, selectedDocument: {} }));
	};

	// searching existing Contact
	const searchExistingContacts = value => {
		setSearch(value);
		const contactDescriptor = contactsFromDocument?.getContactDescriptors[0];
		let existingContacts = contactDescriptor?.contacts || [];
		if (value !== '') {
			const searchedContacts = existingContacts.filter(contact =>
				contact.entityDetail.name.toLowerCase().includes(value)
			);
			setContacts(searchedContacts);
		} else {
			setContacts(existingContacts);
		}
	};
	return (
		<DocumentAssociation
			title={'Contacts'}
			items={contacts}
			navigateTo={goToContact}
			esFilter={[]}
			esFields={['name']}
			esIndex="contacts_flat"
			searchExistingItems={searchExistingContacts}
			onSearchBlur={() => {
				setTimeout(() => {
					setSearchState(false);
				}, 300);
				setContacts(contactsFromDocument?.getContactDescriptors[0]?.contacts);
			}}
			setSearchState={setSearchState}
			isSearchActive={isSearchActive}
			search={search}
			setSearch={setSearch}
			relatedObjectType="Contact"
			deleteDescriptorFile={deleteContact}
			getSelectedItem={addSelectedContactToDocument}
			addFileLoading={addContactsLoading}
			deleteFileLoading={deleteContactLoading}
			updateDocumentLoading={getContactsLoading}
			href={'/contact/details/{ID}?tenant={TENANT}'}
		/>
	);
}

AssociatedContacts.propTypes = {
	selectedDocument: PropTypes.object,
};
