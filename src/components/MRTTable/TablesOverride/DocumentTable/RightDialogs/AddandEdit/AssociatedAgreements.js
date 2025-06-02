import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { DocumentContext } from 'components/Document/DocumentContext';

import { ADD_AGREEMENT_TO_FILE_DESCRIPTOR } from 'graphQL/useMutationAddAgreementToFileDescriptor';
import { DELETE_AGREEMENT_FROM_FILE_DESCRIPTOR } from 'graphQL/useMutationDeleteAgreementFromFileDescriptor';

import { globalStateController } from 'stateManagement/globalStateController';

import { UserSession } from 'utils/user';

import DocumentAssociation from './DocumentAssociation';

export default function AssociatedAgreements({ selectedDocument }) {
	// Initials
	let history = useHistory();

	// States
	const [search, setSearch] = useState('');
	const [isSearchActive, setSearchState] = useState(false);

	const { getAgreementsFromDocument, getAgreementsLoading, agreementsFromDocument, shapes, setShapes } =
		React.useContext(DocumentContext);

	const [addAgreementToFileDescriptor, { loading: addAgreementsLoading }] = useMutation(
		ADD_AGREEMENT_TO_FILE_DESCRIPTOR
	);

	// Mutations
	const [deleteAgreementFromDescriptor, { loading: deleteAgreementLoading }] = useMutation(
		DELETE_AGREEMENT_FROM_FILE_DESCRIPTOR,
		{
			onCompleted: () =>
				getAgreementsFromDocument({
					variables: {
						descriptorObject: selectedDocument?._id,
					},
				}),
		}
	);

	// Fetching agreements from descriptor
	useEffect(() => {
		getAgreementsFromDocument({
			variables: {
				descriptorObject: selectedDocument?._id,
			},
		});
	}, []);

	// delete agreement from File Descriptor
	const deleteAgreement = async shapeId => {
		await deleteAgreementFromDescriptor({
			variables: { descriptorId: selectedDocument?._id, shapeId },
		});
	};

	const addSelectedAgreementToDocument = shape => {
		let shapeData = {
			...shape,
			createdBy: globalStateController.getValue('user')?._id,
		};
		addAgreementToFileDescriptor({
			variables: {
				descriptorId: selectedDocument?._id,
				shapeData,
			},
			awaitRefetchQueries: true,
		}).then(({ data }) => {
			const descriptorId = data.addAgreementToFileDescriptor._id;
			window.setStateApp(stateApp => ({
				...stateApp,
				selectedDocument: { ...selectedDocument, _id: descriptorId },
			}));
			getAgreementsFromDocument({
				variables: {
					descriptorObject: descriptorId,
				},
			});
		});
	};

	// sending to Agreements page
	const goToAgreement = shape => {
		history.push(
			`/land/agreement/details/${shape?._id.toLowerCase()}/?tenant=${UserSession.getStorageItem('tenantName')}`
		);
		window.setStateApp(stateApp => ({ ...stateApp, DocumentDrawer: false, selectedDocument: {} }));
	};

	// searching existing Agreement
	const searchExistingShapes = value => {
		setSearch(value);
		const contactDescriptor = agreementsFromDocument?.getAgreementDescriptors[0];
		let existingShapes = contactDescriptor.shapeObj || [];
		if (value !== '') {
			const searchedShapes = existingShapes.filter(shape => shape.name.toLowerCase().includes(value.toLowerCase()));
			setShapes(searchedShapes);
		} else {
			setShapes(existingShapes);
		}
	};
	return (
		<DocumentAssociation
			title={'Agreements'}
			items={shapes}
			navigateTo={goToAgreement}
			esFilter={[
				{
					field: 'shapeJson.properties.type.keyword',
					value: 'agreement',
				},
			]}
			esFields={['name']}
			esIndex="shapes_flat"
			searchExistingItems={searchExistingShapes}
			onSearchBlur={() => {
				setTimeout(() => {
					setSearchState(false);
				}, 300);
				setShapes(agreementsFromDocument?.getAgreementDescriptors[0]?.shapeObj);
			}}
			setSearchState={setSearchState}
			isSearchActive={isSearchActive}
			search={search}
			setSearch={setSearch}
			relatedObjectType="Shape"
			deleteDescriptorFile={deleteAgreement}
			getSelectedItem={addSelectedAgreementToDocument}
			addFileLoading={addAgreementsLoading}
			deleteFileLoading={deleteAgreementLoading}
			updateDocumentLoading={getAgreementsLoading}
			href={'/land/agreement/details/{ID}?tenant={TENANT}'}
		/>
	);
}

AssociatedAgreements.propTypes = {
	selectedDocument: PropTypes.object,
};
