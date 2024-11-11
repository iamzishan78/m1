import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

//Contexts
import { AppContext } from 'AppContext';

import DocumentAssociation from './DocumentAssociation';
import { DocumentContext } from '../DocumentContext';
import { useMutation } from '@apollo/client';
import { ADD_PROPERTY_TO_FILE_DESCRIPTOR } from 'graphQL/useMutationAddPropertyToFileDescriptor';
import { DELETE_PROPERTY_FROM_FILE_DESCRIPTOR } from 'graphQL/useMutationDeletePropertyFromFileDescriptor';

export default function AssociatedProperties() {
	// Initials
	const [stateApp, setStateApp] = useContext(AppContext);
	let history = useHistory();

	// States
	const [search, setSearch] = useState('');
	const [isSearchActive, setSearchState] = useState(false);

	const { getPropertiesFromDocument, getPropertiesLoading, propertiesFromDocument, properties, setProperties } =
		React.useContext(DocumentContext);

	const [addPropertyToFileDescriptor, { loading: addPropertiesLoading }] = useMutation(ADD_PROPERTY_TO_FILE_DESCRIPTOR);

	// Mutations
	const [deletePropertyFromDescriptor, { loading: deletePropertyLoading }] = useMutation(
		DELETE_PROPERTY_FROM_FILE_DESCRIPTOR,
		{
			onCompleted: () =>
				getPropertiesFromDocument({
					variables: {
						descriptorObject: stateApp.selectedDocument._id,
					},
				}),
		}
	);

	// Fetching properties from descriptor
	useEffect(() => {
		getPropertiesFromDocument({
			variables: {
				descriptorObject: stateApp.selectedDocument._id,
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// delete property from File Descriptor
	const deleteProperty = async propertyId => {
		await deletePropertyFromDescriptor({
			variables: { descriptorId: stateApp?.selectedDocument?._id, propertyId },
		});
	};

	const addSelectedPropertyToDocument = property => {
		let propertyData = {
			...property,
			createdBy: stateApp?.user?._id,
		};
		addPropertyToFileDescriptor({
			variables: {
				descriptorId: stateApp?.selectedDocument?._id,
				propertyData,
			},
			awaitRefetchQueries: true,
		}).then(({ data }) => {
			const descriptorId = data.addPropertyToFileDescriptor._id;
			const selectedDocument = stateApp.selectedDocument ?? {};
			setStateApp(stateApp => ({
				...stateApp,
				selectedDocument: { ...selectedDocument, _id: descriptorId },
			}));
			getPropertiesFromDocument({
				variables: {
					descriptorObject: descriptorId,
				},
			});
		});
	};

	// sending to property page
	const goToProperty = property => {
		history.push(`/revenue/property/details/${property?._id.toLowerCase()}`);
		setStateApp({ ...stateApp, DocumentDrawer: false, selectedDocument: {} });
	};

	// searching existing Property
	const searchExistingProperties = value => {
		setSearch(value);
		const propertyDescriptor = propertiesFromDocument?.getPropertyDescriptors;
		let existingProperties = propertyDescriptor?.properties || [];
		if (value !== '') {
			const searchedProperties = existingProperties.filter(property => property?.name?.toLowerCase().includes(value));
			setProperties(searchedProperties);
		} else {
			setProperties(existingProperties);
		}
	};
	return (
		<DocumentAssociation
			title={'Related Properties'}
			items={properties}
			navigateTo={goToProperty}
			esFilter={[]}
			esFields={['name.keyword']}
			esIndex="properties_flat"
			searchExistingItems={searchExistingProperties}
			onSearchBlur={() => {
				setTimeout(() => {
					setSearchState(false);
				}, 300);
				setProperties(propertiesFromDocument?.getPropertyDescriptors?.properties);
			}}
			setSearchState={setSearchState}
			isSearchActive={isSearchActive}
			search={search}
			setSearch={setSearch}
			relatedObjectType="Property"
			deleteDescriptorFile={deleteProperty}
			getSelectedItem={addSelectedPropertyToDocument}
			addFileLoading={addPropertiesLoading}
			deleteFileLoading={deletePropertyLoading}
			updateDocumentLoading={getPropertiesLoading}
			sort={{
				field: 'name.keyword',
				order: 'asc',
			}}
			href={`/revenue/property/details/{ID}?tenant={TENANT}`}
		/>
	);
}
