import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { DocumentContext } from 'components/Document/DocumentContext';

import { ADD_PROPERTY_TO_FILE_DESCRIPTOR } from 'graphQL/useMutationAddPropertyToFileDescriptor';
import { DELETE_PROPERTY_FROM_FILE_DESCRIPTOR } from 'graphQL/useMutationDeletePropertyFromFileDescriptor';

import { globalStateController } from 'stateManagement/globalStateController';

import { UserSession } from 'utils/user';

import DocumentAssociation from './DocumentAssociation';

export default function AssociatedProperties({ selectedDocument }) {
	// Initials
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
						descriptorObject: selectedDocument?._id,
					},
				}),
		}
	);

	// Fetching properties from descriptor
	useEffect(() => {
		getPropertiesFromDocument({
			variables: {
				descriptorObject: selectedDocument?._id,
			},
		});
	}, []);

	// delete property from File Descriptor
	const deleteProperty = async propertyId => {
		await deletePropertyFromDescriptor({
			variables: { descriptorId: selectedDocument?._id, propertyId },
		});
	};

	const addSelectedPropertyToDocument = property => {
		let propertyData = {
			...property,
			createdBy: globalStateController.getValue('user')?._id,
		};
		addPropertyToFileDescriptor({
			variables: {
				descriptorId: selectedDocument?._id,
				propertyData,
			},
			awaitRefetchQueries: true,
		}).then(({ data }) => {
			const descriptorId = data.addPropertyToFileDescriptor._id;
			window.setStateApp(stateApp => ({
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
		const tenantName = UserSession.getStorageItem('tenantName');
		history.push(`/revenue/property/details/${property?._id.toLowerCase()}?tenant=${tenantName}`);
		window.setStateApp(stateApp => ({ ...stateApp, DocumentDrawer: false, selectedDocument: {} }));
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
			href={'/revenue/property/details/{ID}?tenant={TENANT}'}
		/>
	);
}

AssociatedProperties.propTypes = {
	selectedDocument: PropTypes.object,
};
